from django.contrib.auth.models import User
from rest_framework import generics, viewsets
from .serializers import UserSerializer, CategorySerializer, AssetSerializer, FieldDefinitionSerializer
# Importa as classes de permissão do DRF.
from rest_framework.permissions import IsAuthenticated, AllowAny
# Importa os modelos do banco de dados.
from .models import Asset, Category, FieldDefinition

# --- View para criação de novos usuários ---
# generics.CreateAPIView é uma view genérica que fornece apenas a funcionalidade de POST (criação).
class CreateUserView(generics.CreateAPIView):
    # O queryset base para a view. Embora seja para criação, o DRF ainda o exige.
    queryset = User.objects.all()
    # O serializer que será usado para validar e desserializar os dados de entrada.
    serializer_class = UserSerializer
    # Define as permissões para esta view. `AllowAny` permite que qualquer um
    # (autenticado ou não) acesse este endpoint, o que é necessário para o registro.
    permission_classes = [AllowAny]

# --- ViewSet para o modelo Category ---
# viewsets.ModelViewSet é um conjunto de views que fornece automaticamente as ações
# `list` (GET), `create` (POST), `retrieve` (GET /id), `update` (PUT/PATCH /id),
# e `destroy` (DELETE /id).
class CategoryViewSet(viewsets.ModelViewSet):
    # O serializer a ser usado para as categorias.
    serializer_class = CategorySerializer
    # Apenas usuários autenticados (`IsAuthenticated`) podem acessar estes endpoints.
    permission_classes = [IsAuthenticated]

    # Sobrescreve o método que retorna o queryset.
    def get_queryset(self):
        # Filtra as categorias para retornar apenas aquelas que pertencem (`owner`)
        # ao usuário que está fazendo a requisição (`self.request.user`).
        # Isso impede que um usuário veja as categorias de outro.
        return Category.objects.filter(owner=self.request.user)

    # Hook chamado no momento da criação de um objeto.
    def perform_create(self, serializer):
        # Ao salvar a nova categoria, define automaticamente o campo `owner`
        # como o usuário que está fazendo a requisição. O `owner` não precisa
        # ser enviado no corpo da requisição POST.
        serializer.save(owner=self.request.user)

# --- ViewSet para o modelo Asset ---
class AssetViewSet(viewsets.ModelViewSet):
    # O serializer a ser usado para os ativos.
    serializer_class = AssetSerializer
    # Apenas usuários autenticados podem interagir com seus ativos.
    permission_classes = [IsAuthenticated]

    # Sobrescreve o método que retorna o queryset de ativos.
    def get_queryset(self):
        user = self.request.user
        # Começa filtrando os ativos para mostrar apenas os do usuário logado.
        queryset = Asset.objects.filter(owner=user)
        
        # Permite filtrar ainda mais os ativos por categoria através de um parâmetro na URL.
        # Ex: /api/assets/?category_id=3
        category_id = self.request.query_params.get('category_id')
        if category_id:
            # Se o parâmetro `category_id` for fornecido, aplica um filtro adicional.
            queryset = queryset.filter(category_id=category_id)
        return queryset

    # Hook chamado na criação de um novo ativo.
    def perform_create(self, serializer):
        # Define automaticamente o dono do ativo como o usuário logado.
        serializer.save(owner=self.request.user)

# --- View para listar e criar FieldDefinitions para uma categoria específica ---
# generics.ListCreateAPIView fornece os métodos GET (para listar) e POST (para criar).
class FieldDefinitionListCreateView(generics.ListCreateAPIView):
    serializer_class = FieldDefinitionSerializer
    permission_classes = [IsAuthenticated]

    # Sobrescreve o método para buscar os objetos.
    def get_queryset(self):
        # Pega o ID da categoria a partir dos parâmetros da URL.
        # A URL para esta view seria algo como /api/categories/<category_pk>/fields/.
        category_id = self.kwargs['category_pk']
        # Retorna apenas as definições de campo que pertencem à categoria especificada.
        return FieldDefinition.objects.filter(category_id=category_id)

    # Hook chamado na criação de uma nova definição de campo.
    def perform_create(self, serializer):
        # Pega o ID da categoria da URL novamente.
        category_id = self.kwargs['category_pk']
        # Busca a instância da categoria, garantindo que ela pertence ao usuário logado
        # para que um usuário não possa adicionar campos a categorias de outros.
        category = Category.objects.get(pk=category_id, owner=self.request.user)
        # Salva a nova definição de campo, associando-a à categoria correta.
        serializer.save(category=category)


# --- View para manipular uma única FieldDefinition (detalhe, atualização, exclusão) ---
# generics.RetrieveUpdateDestroyAPIView fornece os métodos GET /id, PUT/PATCH /id e DELETE /id.
class FieldDefinitionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FieldDefinitionSerializer
    permission_classes = [IsAuthenticated]

    # Sobrescreve o método para buscar os objetos.
    def get_queryset(self):
        # Garante a segurança retornando um queryset que contém apenas
        # FieldDefinitions cujas categorias pertencem ao usuário logado.
        # A sintaxe `category__owner` atravessa a relação de ForeignKey.
        # Mesmo que um usuário tente acessar /api/.../fields/123, se o campo 123
        # não pertencer a uma de suas categorias, o DRF retornará "Não encontrado".
        return FieldDefinition.objects.filter(category__owner=self.request.user)
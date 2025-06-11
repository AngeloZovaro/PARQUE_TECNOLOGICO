from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Asset, Category, FieldDefinition, AssetFieldValue

# --- Serializer para o modelo User ---
# Converte o modelo User em dados JSON e vice-versa.
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        # Especifica o modelo que este serializer irá manipular.
        model = User
        # Define os campos do modelo que serão incluídos na representação serializada.
        fields = ["id", "username", "password"]
        # Define opções extras para campos específicos.
        extra_kwargs = {
            # O campo 'password' será usado apenas para escrita (criação/atualização),
            # mas não será retornado em respostas de leitura (GET). Isso é por segurança.
            "password": {"write_only": True}
        }

    # Sobrescreve o método padrão de criação de objetos.
    def create(self, validated_data):
        # Usa o método `create_user` do manager do User, que lida corretamente
        # com a criação do usuário e o hashing da senha.
        user = User.objects.create_user(**validated_data)
        return user

# --- Serializer para o modelo FieldDefinition ---
# Representa a definição de um campo personalizado (ex: "Cor", "Voltagem").
class FieldDefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        # Especifica o modelo a ser serializado.
        model = FieldDefinition
        # Define os campos a serem incluídos.
        fields = ['id', 'name', 'field_type']

# --- Serializer para o modelo Category ---
# Representa uma categoria de ativos (ex: "Eletrônicos", "Móveis").
class CategorySerializer(serializers.ModelSerializer):
    # Define um campo aninhado. Ao buscar uma categoria, os detalhes de suas
    # definições de campo (FieldDefinition) serão incluídos.
    # `many=True` indica que há múltiplos `FieldDefinition` para uma `Category`.
    # `read_only=True` significa que este campo será retornado em GETs, mas não
    # pode ser usado para criar/atualizar uma categoria diretamente por aqui.
    field_definitions = FieldDefinitionSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        # Inclui os campos do modelo e o campo aninhado `field_definitions`.
        fields = ['id', 'name', 'owner', 'field_definitions']
        extra_kwargs = {
            # O 'owner' (dono) da categoria será definido automaticamente
            # na view com base no usuário logado e não será editável pelo cliente.
            "owner": {"read_only": True}
        }

# --- Serializer para o modelo AssetFieldValue ---
# Representa o valor de um campo específico para um ativo (ex: Cor = "Azul").
class AssetFieldValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssetFieldValue
        # Define os campos que ligam o valor (`value`) à sua definição (`field_definition`).
        fields = ['field_definition', 'value']

# --- Serializer para o modelo Asset ---
# Representa um ativo específico (ex: um notebook, uma cadeira).
class AssetSerializer(serializers.ModelSerializer):
    # Campo aninhado para os valores dos campos do ativo.
    # `many=True` porque um ativo pode ter vários pares de campo/valor.
    # Este serializer permitirá a criação e atualização de ativos junto com seus valores.
    field_values = AssetFieldValueSerializer(many=True)

    class Meta:
        model = Asset
        # Campos do ativo a serem serializados.
        fields = ['id', 'patrimonio', 'category', 'owner', 'created_at', 'field_values']
        extra_kwargs = {
            # O 'owner' do ativo também será definido na view e é somente leitura.
            "owner": {"read_only": True},
        }

    # Sobrescreve o método de criação para lidar com o campo aninhado `field_values`.
    def create(self, validated_data):
        # Remove os dados dos valores dos campos (`field_values`) do dicionário principal.
        field_values_data = validated_data.pop('field_values')
        # Cria o objeto Asset com os dados restantes.
        asset = Asset.objects.create(**validated_data)
        # Itera sobre cada dicionário de valor de campo recebido.
        for field_value_data in field_values_data:
            # Cria um objeto AssetFieldValue, associando-o ao Asset recém-criado.
            AssetFieldValue.objects.create(asset=asset, **field_value_data)
        return asset

    # Sobrescreve o método de atualização para lidar com o campo aninhado `field_values`.
    def update(self, instance, validated_data):
        # `instance` é o objeto Asset original que está sendo atualizado.
        # Remove os dados dos valores dos campos do dicionário de dados validados.
        field_values_data = validated_data.pop('field_values')
        
        # Atualiza os campos do próprio Asset.
        instance.patrimonio = validated_data.get('patrimonio', instance.patrimonio)
        instance.category = validated_data.get('category', instance.category)
        instance.save()

        # Estratégia de atualização para os valores dos campos: apagar os antigos e criar os novos.
        # Esta é uma abordagem simples, mas eficaz.
        # Primeiro, deleta todos os AssetFieldValue associados a este ativo.
        instance.field_values.all().delete()
        
        # Depois, cria os novos AssetFieldValue a partir dos dados recebidos.
        for field_value_data in field_values_data:
            AssetFieldValue.objects.create(asset=instance, **field_value_data)

        return instance
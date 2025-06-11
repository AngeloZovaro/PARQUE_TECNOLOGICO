from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, AssetViewSet, FieldDefinitionListCreateView, FieldDefinitionDetailView

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'assets', AssetViewSet, basename='asset')

urlpatterns = [
    path('', include(router.urls)),
    # Rota para listar e criar campos de uma categoria
    path('categories/<int:category_pk>/fields/', FieldDefinitionListCreateView.as_view(), name='field-definition-list'),
    
    # Rota para deletar, atualizar ou ver um campo específico
    # Ex: DELETE /api/fields/5/
    path('fields/<int:pk>/', FieldDefinitionDetailView.as_view(), name='field-definition-detail'),
]
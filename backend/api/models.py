from django.db import models
from django.contrib.auth.models import User

# O modelo Categoria armazena os tipos de ativos, como "Notebooks" ou "Câmeras".
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="categories")

    def __str__(self):
        return self.name

# O modelo FieldDefinition define os campos customizáveis para uma categoria.
# Ex: Para a categoria "Notebooks", podemos ter campos como "Processador", "Memória RAM".
class FieldDefinition(models.Model):
    FIELD_TYPE_CHOICES = [
        ('text', 'Texto'),
        ('number', 'Número'),
        ('date', 'Data'),
    ]
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='field_definitions')
    name = models.CharField(max_length=100)
    field_type = models.CharField(max_length=20, choices=FIELD_TYPE_CHOICES, default='text')

    def __str__(self):
        return f"{self.category.name} - {self.name}"

# O modelo Asset representa um ativo individual.
class Asset(models.Model):
    patrimonio = models.CharField(max_length=100, unique=True) # Campo obrigatório
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='assets')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="assets")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.patrimonio

# Armazena o valor de um campo específico para um ativo.
# Ex: Para o Ativo "Notebook Dell" (patrimônio 12345), o campo "Memória RAM" pode ter o valor "16GB".
class AssetFieldValue(models.Model):
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name='field_values')
    field_definition = models.ForeignKey(FieldDefinition, on_delete=models.CASCADE)
    value = models.TextField()

    def __str__(self):
        return f"{self.asset.patrimonio} - {self.field_definition.name}: {self.value}"
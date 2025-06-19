from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from .models import Asset, Category, FieldDefinition, AssetFieldValue

# Serializer antigo, pode ser usado para listar usuários se necessário no futuro
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]

# --- NOVO SERIALIZER, APENAS PARA CRIAÇÃO DE USUÁRIO ---
class CreateUserSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    secret_question = serializers.CharField(write_only=True, required=True)
    secret_answer = serializers.CharField(write_only=True, required=True)
    id = serializers.IntegerField(read_only=True)
    def create(self, validated_data):
        secret_question = validated_data.pop('secret_question')
        secret_answer = validated_data.pop('secret_answer')
        user = User.objects.create_user(**validated_data)
        user.profile.secret_question = secret_question
        user.profile.secret_answer = make_password(secret_answer)
        user.profile.save()
        return user
    
class UserProfileSerializer(serializers.ModelSerializer):
# Pega o papel (role) do modelo Profile relacionado
    role = serializers.CharField(source='profile.role')

class Meta:
    model = User
    fields = ['id', 'username', 'role']
    
# --- Serializer para o modelo FieldDefinition ---
# Representa a definição de um campo personalizado (ex: "Cor", "Voltagem").
class FieldDefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FieldDefinition
        fields = ['id', 'name', 'field_type']

class CategorySerializer(serializers.ModelSerializer):
    field_definitions = FieldDefinitionSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'owner', 'field_definitions']
        extra_kwargs = {"owner": {"read_only": True}}

class AssetFieldValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssetFieldValue
        fields = ['field_definition', 'value']

class AssetSerializer(serializers.ModelSerializer):
    field_values = AssetFieldValueSerializer(many=True)

    class Meta:
        model = Asset
        fields = ['id', 'patrimonio', 'category', 'owner', 'created_at', 'field_values']
        extra_kwargs = {
            "owner": {"read_only": True},
        }

    def create(self, validated_data):
        field_values_data = validated_data.pop('field_values')
        asset = Asset.objects.create(**validated_data)
        for field_value_data in field_values_data:
            AssetFieldValue.objects.create(asset=asset, **field_value_data)
        return asset

    def update(self, instance, validated_data):
        field_values_data = validated_data.pop('field_values')
        instance.patrimonio = validated_data.get('patrimonio', instance.patrimonio)
        instance.category = validated_data.get('category', instance.category)
        instance.save()

        instance.field_values.all().delete()
        for field_value_data in field_values_data:
            AssetFieldValue.objects.create(asset=instance, **field_value_data)

        return instance
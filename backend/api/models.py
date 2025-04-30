from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Note(models.Model):
    title = models.CharField(max_length=100) # utilizamos o campo de caracteres com no máximo 100 para o título
    content=models.TextField() # utilizamos o campo de texto para alocar as anotações
    created_at = models.DateTimeField(auto_now_add=True) # o parâmetro utilizado permite que ele preencha automaticamente o campo
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name ="notes") # utilizamos para identificar o autor
    # Utilizamos o foreignkey no author, para indicarmos que ele pode ter várias notas (N - *) 1 para vários
    # O on_delete... é utilizado para caso o usuário seja deletado, as notations também sejam deletadas

    def __str__(self):
        return self.title
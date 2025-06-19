from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Permite acesso apenas a usuários administradores.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.profile.role == 'admin'

class IsAdminOrEditorUser(permissions.BasePermission):
    """
    Permite acesso a Administradores ou Editores.
    """
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        return request.user.profile.role in ['admin', 'editor']
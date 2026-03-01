# language: es
# author: Andres Castañeda

Característica: Iniciar sesion en la pagina de mysticalcut

  @registro
  Escenario: Completar el formulario de iniciar sesion
    Dado que el visitante está en la página de Mystical e ingresa a iniciarsesion
    Cuando ingresa las credenciales básicas:
      | correo                 | contraseña |
      | Bot-services@gmail.com | 12345678   |
    Entonces debe ser redirigido a la vista home


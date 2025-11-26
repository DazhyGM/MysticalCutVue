#language:es
  #author:Kevin Sabogal

Característica: Autenticacion en la pagina de MysticalCut
  Como usuario de MysticalCut
  Quiero autenticarme en el portal
  Para poder acceder al contenido y funcionalidades disponibles en mi cuenta.

  @autenticacion

  Escenario: Verificar la autenticacion exitosa en la pagina de Mystical
    Dado que el usuario se encuentra en la pagina de inicio de sesion de Mystical
    Cuando ingrese las credenciales correctas (usuario y contrasena)
      |         usuarios         |    clave   |
      | kevinsabogal24@gmail.com |  12345678  |
    Entonces se debe verificar que el usuario haya sido autenticado correctamente y redirigido a su pagina de inicio de Mystical

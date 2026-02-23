#language:es
#author:Oscar Andres Leon

Característica: Recuperación de contraseña
  Como usuario de la plataforma
  Quiero poder recuperar mi contraseña
  Para poder restablecer el acceso a mi cuenta en caso de olvidarla

  @recuperarContrasena
  Escenario: Recuperar contraseña mediante correo electrónico
    Dado que el usuario se encuentra en la página de recuperar Contraseña
    Cuando ingresa su correo electrónico registrado y hace clic en el botón Enviar
      | leonoscarandres04@gmail.com |
      | correo_electronico  |
    Entonces el sistema debe enviar un enlace de recuperación al correo ingresado y debe mostrarse un mensaje indicando que se ha enviado el correo exitosamente
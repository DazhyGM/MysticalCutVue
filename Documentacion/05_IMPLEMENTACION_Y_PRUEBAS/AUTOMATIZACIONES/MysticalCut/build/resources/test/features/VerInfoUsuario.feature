  # language: es
  # author: Oscar Andres Leon

  Característica: Entrar al apartado de usuarios y visualizar todos los usuarios registrados


    Antecedentes:
      Dado que el visitante está en la página de Mystical e ingresa a iniciarsesion
      Cuando ingresa las credenciales básicas:
        | correo                      | contraseña |
        | leonoscarandres04@gmail.com | 12345678   |

    @registro
    Escenario: Visualizar toda la infomacion del usuario que se encuentra registrado en la pagina MysticalCut

      Cuando complete el inicio de sesion, se dirigira al apartado usuarios y podra ver todos los usuarios y seleccionara al usuarios que quiere ver su informacion

      Entonces  Verificar que salga toda la informacion del usuario que se encuentra registado en MysticalCut


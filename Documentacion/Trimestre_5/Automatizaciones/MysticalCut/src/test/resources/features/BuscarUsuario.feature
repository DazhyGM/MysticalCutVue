  # language: es
  # author: Kevin Sabogal

  Característica: Entrar al apartado de usuarios y ver un usuario en especifico


    Antecedentes:
      Dado que el visitante está en la página de Mystical e ingresa a iniciarsesion
      Cuando ingresa las credenciales básicas:
        | correo                   | contraseña |
        | kevinsabogal24@gmail.com | 12345678   |

    @buscarusuario
    Escenario: Visualizar un usuario que se encuentre registrado en la pagina MysticalCut

      Cuando complete el inicio de sesion, se dirigira al apartado usuarios y podra ver el usuario en especifico
      | 20987654 |
      Entonces  Verificar que se filtre correctamente el usuario que esta registrado en MysticalCut
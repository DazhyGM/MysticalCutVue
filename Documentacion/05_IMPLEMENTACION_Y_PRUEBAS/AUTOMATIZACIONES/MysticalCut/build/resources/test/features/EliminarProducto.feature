  # language: es
  # author: Oscar Andres Leon

  Característica: Entrar al apartado de usuarios y visualizar todos los usuarios registrados


    Antecedentes:
      Dado que el visitante está en la página de Mystical e ingresa a iniciarsesion
      Cuando ingresa las credenciales básicas:
        | correo                      | contraseña |
        | leonoscarandres04@gmail.com | 12345678   |

    @registro
    Escenario: Eliminar un producto que se encuentren agregados en la pagina MysticalCut

      Cuando complete el inicio de sesion, se dirigira al apartado productos y podra ver todos los productos con su boton eliminar

      Entonces  Verificar que el producto se encuentre inactivo en MysticalCut


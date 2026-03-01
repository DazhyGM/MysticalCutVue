  # language: es
  # author: Andres Castañeda

  Característica: Agendar una cita, elegir el servicio, barbero, dia hora


    Antecedentes:
      Dado que el visitante está en la página de Mystical e ingresa a iniciarsesion
      Cuando ingresa las credenciales básicas:
        | correo                 | contraseña |
        | Bot-services@gmail.com | 12345678   |

    @registro
    Escenario: Agendar una cita

      Cuando completa los campos requeridos de servicio, barbero, dia

      Entonces  Verificar la orden del servicio


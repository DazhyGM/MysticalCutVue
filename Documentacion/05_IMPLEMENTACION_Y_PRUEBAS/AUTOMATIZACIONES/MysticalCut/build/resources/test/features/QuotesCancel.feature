  # language: es
  # author: Andres Castañeda

  Característica: Ver una cita


    Antecedentes:
      Dado que el visitante está en la página de Mystical e ingresa a iniciarsesion
      Cuando ingresa las credenciales básicas:
        | correo                 | contraseña |
        | Bot-services@gmail.com | 12345678   |

    @registro
    Escenario: Ver la cita qye se quiere cancelar
      Cuando Cancelar la cita que se quiere cancelar

      Entonces  Verificar que se cancele la cita


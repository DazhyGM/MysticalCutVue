function confirmRegistro() {
    Swal.fire({
        title: 'Confirmación de registro',
        text: `¿Está seguro que desea registrar este usuario?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, registrar',
        cancelButtonText: 'Cancelar',
        customClass: {
            popup: 'swal2-popup'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Usuario registrado con exito',
                text: `Ya puedes iniciar sesion con tu correo y contraseña registrados.`,
                icon: 'success',
                confirmButtonColor: '#CCAF54',
                confirmButtonText:'Iniciar Sesión',
                customClass: {
                    popup: 'swal2-popup'
                }
            }).then(() => {
                // Redirige a otra página después de que se confirme
                window.location.href = 'Login.html'; // Cambia 'URL_DE_REDIRECCIÓN_AQUÍ' por la URL de destino
            });
        }
            });
        }


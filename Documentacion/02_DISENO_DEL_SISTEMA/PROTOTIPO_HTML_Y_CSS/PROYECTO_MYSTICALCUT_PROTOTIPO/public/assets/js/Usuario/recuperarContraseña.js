function recuperarContraseña() {
            Swal.fire({
                title: 'Correo enviado con exito',
                text: `Verifique la bandeja de entrada de su correo o la sección de "spam" para poder restablecer su contraseña.`,
                icon: 'success',
                confirmButtonColor: '#CCAF54',
                confirmButtonText:'Iniciar Sesion',
                customClass: {
                    popup: 'swal2-popup'
                }
            }).then(() => {
                // Redirige a otra página después de que se confirme
                window.location.href = 'Login.html'; // Cambia 'URL_DE_REDIRECCIÓN_AQUÍ' por la URL de destino
            });
        } 
           

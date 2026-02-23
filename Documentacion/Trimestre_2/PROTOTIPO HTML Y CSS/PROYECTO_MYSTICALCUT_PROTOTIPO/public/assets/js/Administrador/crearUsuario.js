function confirmCrear() {
    Swal.fire({
        title: 'Confirmación de registro',
        text: `¿Está seguro que desea crear este usuario?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, crear',
        cancelButtonText: 'Cancelar',
        customClass: {
            popup: 'swal2-popup'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Usuario creado con exito',
                text: ``,
                icon: 'success',
                confirmButtonColor: '#CCAF54',
                confirmButtonText:'Regresar',
                customClass: {
                    popup: 'swal2-popup'
                }
            }).then(() => {
                // Redirige a otra página después de que se confirme
                window.location.href = 'verYCrearUsuarioADM.html'; // Cambia 'URL_DE_REDIRECCIÓN_AQUÍ' por la URL de destino
            });
        }
            });
        }


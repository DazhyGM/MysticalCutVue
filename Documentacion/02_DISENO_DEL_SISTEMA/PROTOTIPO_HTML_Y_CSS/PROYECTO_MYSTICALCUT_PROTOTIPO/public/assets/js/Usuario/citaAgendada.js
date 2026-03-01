function confirmCitaAgendada() {
    Swal.fire({
        title: 'Confirmación de cita',
        text: `¿Está seguro que desea agendar esta cita?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, agendar',
        cancelButtonText: 'Cancelar',
        customClass: {
            popup: 'swal2-popup'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Cita agendada con éxito',
                text: `Recuerde que al correo electrónico registrado le llegara el recordatorio de la cita.`,
                icon: 'success',
                confirmButtonColor: '#CCAF54',
                confirmButtonText:'Regresar a la pagina principal',
                customClass: {
                    popup: 'swal2-popup'
                }
            }).then(() => {
                // Redirige a otra página después de que se confirme
                window.location.href = 'PaginaPrincipal.html'; // Cambia 'URL_DE_REDIRECCIÓN_AQUÍ' por la URL de destino
            });
        } else {
            Swal.fire({
                title: 'Acción cancelada',
                icon: 'info',
                confirmButtonColor: '#CCAF54',
                customClass: {
                    popup: 'swal2-popup'
                }
            });
        }
    });
}


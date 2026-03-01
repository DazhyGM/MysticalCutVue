function confirmCita(id) {
    Swal.fire({
        title: 'Confirmación de Servicio',
        text: `¿Está seguro que desea marcar este servicio como terminado?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar',
        customClass: {
            popup: 'swal2-popup'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Eliminar la fila del servicio confirmado
            document.querySelector(`tr[data-id="${id}"]`).remove();
            
            Swal.fire({
                title: 'Servicio terminado con éxito',
                text: ``,
                icon: 'success',
                confirmButtonColor: '#CCAF54',
                customClass: {
                    popup: 'swal2-popup'
                }
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

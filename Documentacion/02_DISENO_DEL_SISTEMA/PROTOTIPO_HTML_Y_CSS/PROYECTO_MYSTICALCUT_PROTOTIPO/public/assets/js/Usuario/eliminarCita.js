function confirmDeleteCita(id) {
    Swal.fire({
        title: 'Confirmación de eliminación',
        text: `¿Está seguro que desea eliminar esta cita?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#28a745',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        customClass: {
            popup: 'swal2-popup'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Eliminar la fila correspondiente
            document.querySelector(`tr[data-id="${id}"]`).remove();

            Swal.fire({
                title: 'Eliminado',
                text: `Cita eliminada con éxito.`,
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

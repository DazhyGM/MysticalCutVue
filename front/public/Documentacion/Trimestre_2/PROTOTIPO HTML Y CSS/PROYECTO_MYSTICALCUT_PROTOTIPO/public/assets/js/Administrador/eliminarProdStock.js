function deleteProdStock(id) {
    Swal.fire({
        title: 'Confirmación de eliminación',
        text: `¿Está seguro que desea eliminar este producto del stock?`,
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
            // Eliminar la fila correspondiente al id
            document.querySelector(`tr[data-id="${id}"]`).remove();

            Swal.fire({
                title: 'Eliminado',
                text: `Producto eliminado con éxito.`,
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

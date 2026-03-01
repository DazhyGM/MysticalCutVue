function confirmDelete() {
    Swal.fire({
        title: 'Confirmación de eliminación',
        text: `¿Está seguro que desea eliminar este usuario?`,
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
            // Aquí puedes agregar el código para eliminar el usuario
            // Por ejemplo, puedes hacer una solicitud AJAX para eliminar el usuario
            Swal.fire({
                title: 'Eliminado',
                text: `Usuario eliminado con éxito.`,
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

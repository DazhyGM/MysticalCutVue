function deleteServicio(id) {
    Swal.fire({
        title: 'Confirmación de cancelación',
        text: `¿Está seguro que desea cancelar este servicio?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#28a745',
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'Cancelar',
        customClass: {
            popup: 'swal2-popup'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Mostrar motivo de cancelación con un cuadro desplegable
            Swal.fire({
                title: 'Motivo de la cancelación',
                input: 'select',
                inputOptions: {
                    'opcion1': 'Cliente No Asiste',
                    'opcion2': 'Cliente LLego Tarde',
                    'opcion3': 'Cliente No Quiere El Servicio',
                },
                inputPlaceholder: 'Seleccione el motivo',
                showCancelButton: true,
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#d33',
                cancelButtonColor: '#28a745',
                customClass: {
                    popup: 'swal2-popup'
                },
                inputValidator: (value) => {
                    if (!value) {
                        return 'Debe seleccionar un motivo para continuar';
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    // Eliminar la fila del servicio cancelado
                    document.querySelector(`tr[data-id="${id}"]`).remove();

                    Swal.fire({
                        title: 'Cancelado',
                        text: `Servicio cancelado con éxito`,
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

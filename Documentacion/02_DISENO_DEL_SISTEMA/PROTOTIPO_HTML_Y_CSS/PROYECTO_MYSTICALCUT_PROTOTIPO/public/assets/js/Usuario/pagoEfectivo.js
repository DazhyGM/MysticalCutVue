function pagoEfectivo() {
    Swal.fire({
        title: 'Procesando pedido',
        text: `¿Está seguro que desea pagar su pedido en efectivo?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, pedir',
        cancelButtonText: 'Cancelar',
        customClass: {
            popup: 'swal2-popup'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Pedido confirmado con exito',
                text: `Puede revisar el estado de su pedido en la seccion "Mis pedidos".`,
                icon: 'success',
                confirmButtonColor: '#CCAF54',
                confirmButtonText:'Ir a Mis pedidos',
                customClass: {
                    popup: 'swal2-popup'
                }
            }).then(() => {
                // Redirige a otra página después de que se confirme
                window.location.href = 'verPedido.html'; // Cambia 'URL_DE_REDIRECCIÓN_AQUÍ' por la URL de destino
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


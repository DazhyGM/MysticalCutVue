function toggleConfirmation(event) {
    const isChecked = event.target.checked;
    const message = isChecked 
        ? "¿Está seguro que desea habilitar este Usuario?"
        : "¿Está seguro que desea inhabilitar este Usuario?";

    Swal.fire({
        title: 'Confirmación',
        text: message,
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
            const successMessage = isChecked 
                ? 'Usuario habilitado con éxito.'
                : 'Usuario inhabilitado con éxito.';
            
            Swal.fire({
                title: 'Confirmado',
                text: successMessage,
                icon: 'success',
                confirmButtonColor: '#CCAF54',  // Color del botón OK
                customClass: {
                    popup: 'swal2-popup'
                }
            });
        } else {
            // Revertir el estado del interruptor si el usuario cancela
            event.target.checked = !isChecked;

            // Mostrar un mensaje específico para la cancelación
            Swal.fire({
                title: 'Acción cancelada',
                icon: 'info',
                confirmButtonColor: '#CCAF54',  // Color del botón OK
                customClass: {
                    popup: 'swal2-popup'
                }
            });
        }
    });
}
window.onload = function() {
    // Selecciona todos los switches en la página
    const switches = document.querySelectorAll('.form-check-input');

    // Itera sobre cada switch y lo marca como checked
    switches.forEach(function(switchElement) {
        switchElement.checked = true;
    });
};
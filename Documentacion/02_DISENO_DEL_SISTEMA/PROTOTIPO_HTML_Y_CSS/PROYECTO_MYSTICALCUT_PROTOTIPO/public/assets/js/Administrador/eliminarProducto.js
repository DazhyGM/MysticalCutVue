let selectedServiceId = null;

        // Evento para seleccionar el servicio
        document.querySelectorAll('.select-service').forEach(button => {
            button.addEventListener('click', function() {
                // Desmarcar todos los botones
                document.querySelectorAll('.select-service').forEach(btn => {
                    btn.classList.remove('selected');
                });

                // Marcar el botón seleccionado
                this.classList.add('selected');
                selectedServiceId = this.getAttribute('data-service-id');

                // Mostrar alerta con Swal
                Swal.fire({
                    title: 'Servicio seleccionado',
                    text: `Servicio seleccionado: ${selectedServiceId}`,
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#CCAF54',
                });
            });
        });

        // Evento para eliminar el servicio seleccionado
        document.getElementById('delete-product').addEventListener('click', function() {
            if (selectedServiceId) {
                // Mostrar confirmación con Swal
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: `¿Deseas eliminar el servicio ${selectedServiceId}?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, eliminar',
                    confirmButtonColor: '#d33',
                    cancelButtonText: 'Cancelar',
                    cancelButtonColor: '#28a745',
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Lógica para eliminar el servicio, por ejemplo, removiendo el elemento del DOM
                        const serviceCard = document.querySelector(`[data-service-id="${selectedServiceId}"]`).closest('.product');
                        serviceCard.remove();

                        // Mostrar alerta de eliminación exitosa
                        Swal.fire({
                            title: 'Eliminado',
                            text: `Servicio eliminado: ${selectedServiceId}`,
                            icon: 'success',
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#CCAF54',
                        });

                        selectedServiceId = null; // Reiniciar la selección
                    }
                });
            } else {
                // Mostrar alerta con Swal
                Swal.fire({
                    title: 'Error',
                    text: 'Por favor, selecciona un servicio para eliminar.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#CCAF54',
                });
            }
        });
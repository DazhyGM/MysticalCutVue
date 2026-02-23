let totalCortes = 10;  // Contador de cortes realizados
        let totalGanancia = 40000;  // Ganancia total
        let cop = 30000;  // COP, por ejemplo

        function obtenerFechaActual() {
            const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const fecha = new Date();
            return fecha.toLocaleDateString('es-ES', opciones);
        }

        function mostrarInformacion(id, precio) {
            const fechaActual = obtenerFechaActual();

           
            // Actualizar los totales
            totalCortes++;
            totalGanancia += precio;

            Swal.fire({
                title: `Resumen Día 
                ${fechaActual}`,
                html: `
                    <div class="info-message">Total cortes realizados: <strong>${totalCortes}</strong></div>
                    <div class="info-message">Total ganancia:</div>
                    <div class="info-message"><strong>$${cop.toFixed(2)}</strong> COP</div>
                `,
                icon: 'info',
                showConfirmButton: false,
                timer: 8000, // La alerta se cierra automáticamente después de 5 segundos
                customClass: {
                    popup: 'swal2-popup'
                }
            }).then(() => {
                // Eliminar la fila del servicio confirmado
                document.querySelector(`tr[data-id="${id}"]`).remove();
            });
        }
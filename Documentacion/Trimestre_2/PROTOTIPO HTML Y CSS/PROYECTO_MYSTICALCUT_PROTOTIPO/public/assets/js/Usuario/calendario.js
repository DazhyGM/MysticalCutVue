let selectedDay = '';
let selectedTime = '';

function selectDay(element) {
    // Quitar la selección previa si existe
    if (selectedDay) {
        selectedDay.classList.remove('selected');
    }
    // Asignar la nueva selección
    selectedDay = element;
    selectedDay.classList.add('selected');

    // Actualizar el resumen del servicio
    updateServiceSummary();
}

function selectTime(element) {
    // Quitar la selección previa si existe
    if (selectedTime) {
        selectedTime.classList.remove('selected');
    }
    // Asignar la nueva selección
    selectedTime = element;
    selectedTime.classList.add('selected');

    // Actualizar el resumen del servicio
    updateServiceSummary();
}

function updateServiceSummary() {
    // Obtener el elemento donde se va a mostrar el resumen
    const serviceSummaryElement = document.querySelector('.service-summary');

    // Asegúrate de que tanto el día como la hora estén seleccionados antes de actualizar
    if (selectedDay && selectedTime) {
        const selectedDate = `${selectedDay.textContent} de Agosto de 2024`;
        const selectedHour = selectedTime.textContent;

        // Actualizar el contenido del resumen
        serviceSummaryElement.innerHTML = `
            <h3>MysticalCut</h3>
            <p>Fecha seleccionada: ${selectedDate}</p>
            <p>Hora seleccionada: ${selectedHour}</p>
            <button class="confirm-button" onclick="window.location.href='ResumenCita.html';">Continuar</button>
        `;
    }
}
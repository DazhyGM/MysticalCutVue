function toggleCalendar() {
    var calendarContainer = document.getElementById('calendarContainer');
    if (calendarContainer.style.display === 'none' || calendarContainer.style.display === '') {
        calendarContainer.style.display = 'block';
    } else {
        calendarContainer.style.display = 'none';
    }

}

function mostrarGrafica(grafica, titulo) {
    document.getElementById('modalImage').src = "../../../public/assets/img/" + grafica;
    document.getElementById('detalleModalLabel').textContent = titulo; // Cambia el título
}

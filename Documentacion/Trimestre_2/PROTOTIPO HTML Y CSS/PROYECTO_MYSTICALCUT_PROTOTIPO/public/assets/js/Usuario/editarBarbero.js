function selectBarber(name, experience, rating) {
    document.getElementById('service-title').textContent = name;
    document.getElementById('service-price').textContent = `Experiencia: ${experience} años`;
    const ratingStars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    document.getElementById('service-price').innerHTML += `<br>Calificación: ${ratingStars}`;
}

function clearServiceDetails() {
document.getElementById('service-title').textContent = 'Selecciona un servicio';
document.getElementById('service-price').textContent = 'Experiencia';
}
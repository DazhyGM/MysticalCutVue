function showServiceDetails(title, price) {
    document.getElementById('service-title').textContent = title;
    document.getElementById('service-price').textContent = price;
}

function clearServiceDetails() {
    document.getElementById('service-title').textContent = 'Selecciona un servicio';
    document.getElementById('service-price').textContent = 'Precio: $****';
}
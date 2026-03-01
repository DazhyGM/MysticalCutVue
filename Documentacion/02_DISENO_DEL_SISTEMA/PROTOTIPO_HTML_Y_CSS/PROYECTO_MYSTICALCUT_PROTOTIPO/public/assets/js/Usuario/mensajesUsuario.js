const cartIcon = document.getElementById('cartIcon');
const cartMessage = document.getElementById('cartMessage');

// Mostrar el mensaje cuando el mouse está sobre el ícono del carrito
cartIcon.addEventListener('mouseover', function(event) {
    cartMessage.style.display = 'block';
    cartMessage.style.left = event.pageX + 'px'; // Posicionar cerca del mouse
    cartMessage.style.top = event.pageY + 'px';
});

// Ocultar el mensaje cuando el mouse sale del ícono del carrito
cartIcon.addEventListener('mouseout', function() {
    cartMessage.style.display = 'none';
});

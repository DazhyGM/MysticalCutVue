// Seleccionamos todos los elementos con la clase 'status-item'
const statusItems = document.querySelectorAll('.status-item');

statusItems.forEach((item, index) => {
    // Añadimos un evento de clic a cada elemento
    item.addEventListener('click', function () {
        // Primero, eliminamos la clase 'completed' de todos los elementos
        statusItems.forEach(el => el.classList.remove('completed'));
        
        // Luego, agregamos la clase 'completed' al elemento clicado y a todos los anteriores
        for (let i = 0; i <= index; i++) {
            statusItems[i].classList.add('completed');
        }
    });
});

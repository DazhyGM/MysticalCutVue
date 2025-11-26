let subtotal = 0;
        
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = parseInt(button.getAttribute('data-price'));

        const productList = document.getElementById('product-list');
        const productItem = document.createElement('li');
        productItem.classList.add('d-flex', 'justify-content-between', 'align-items-center'); // Flexbox para alinear contenido

        // Crear el nombre del producto
        const productName = document.createElement('span');
        productName.textContent = `${name}`;

        // Crear el botón de eliminación
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Eliminar';
        removeButton.classList.add('btn', 'gold-button', 'btn-sm'); // Añadir la clase 'gold-button'

        // Eliminar producto al hacer clic en el botón
        removeButton.addEventListener('click', () => {
            subtotal -= price; // Restar el precio del producto eliminado
            productItem.remove(); // Eliminar el elemento del DOM
            const discount = 10000; // Descuento
            const total = subtotal - discount;
            document.getElementById('subtotal').textContent = `${subtotal} COP`;
            document.getElementById('discount').textContent = `${discount} COP`;
            document.getElementById('total').textContent = `${total} COP`;
        });

        // Agregar el nombre del producto y el botón a la lista
        productItem.appendChild(productName);
        productItem.appendChild(removeButton);
        productList.appendChild(productItem);

        subtotal += price;
        const discount = 10000; // Ejemplo de descuento
        const total = subtotal - discount;

        document.getElementById('subtotal').textContent = `${subtotal} COP`;
        document.getElementById('discount').textContent = `${discount} COP`;
        document.getElementById('total').textContent = `${total} COP`;
    });
});
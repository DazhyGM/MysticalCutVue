flatpickr("#facturaFecha", {
    dateFormat: "Y-m-d",
    altInput: true,
    altFormat: "F j, Y",
    theme: "dark",
});

function agregarProducto() {
    // Clonar el primer div de producto
    var original = document.querySelector(".producto");
    var clone = original.cloneNode(true);

    // Limpiar los valores de los campos clonados
    clone.querySelector('select').value = "";
    clone.querySelector('input[type="number"]').value = "";
    clone.querySelector('input[type="number"]').value = "";

    // Agregar el nuevo div al contenedor de productos
    document.getElementById("productos").appendChild(clone);
}
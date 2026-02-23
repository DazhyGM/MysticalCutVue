document.getElementById('browse-button').addEventListener('click', function() {
    // Simula un clic en el input de archivo
    document.getElementById('file-input').click();
});

// Maneja la previsualización de la imagen seleccionada
document.getElementById('file-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')) {
        const reader = new FileReader();
        
        // Cargar la imagen seleccionada en el elemento de marcador de posición
        reader.onload = function(e) {
            document.getElementById('placeholder-image').src = e.target.result;
        };
        
        reader.readAsDataURL(file); // Lee el archivo como una URL de datos
    } else {
        alert("Por favor, seleccione una imagen en formato JPG, JPEG o PNG.");
        // Restablece el valor del input si no es una imagen válida
        event.target.value = "";
    }
});
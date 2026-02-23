function previewImage(imageNumber) {
    const fileInput = document.getElementById(`fileInput${imageNumber}`);
    const imagePreview = document.getElementById(`imagePreview${imageNumber}`);

    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.style.backgroundImage = `url(${e.target.result})`;
        }
        reader.readAsDataURL(file);
    }
}
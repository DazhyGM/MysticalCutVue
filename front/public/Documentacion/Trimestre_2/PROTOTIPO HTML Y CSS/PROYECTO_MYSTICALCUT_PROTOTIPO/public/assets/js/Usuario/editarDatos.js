function toggleEdit(button) {
    var input = button.previousElementSibling;
    if (input.hasAttribute('readonly')) {
        input.removeAttribute('readonly');
        input.focus();
    } else {
        input.setAttribute('readonly', true);
    }
}
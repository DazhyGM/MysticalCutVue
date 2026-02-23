<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="<?= FOLDER_PUBLIC_ASSETS ?>/img/background/LOGOHEADERTRANS.png">
    <?php include_once FOLDER_VIEWS_CSS . 'style.php'; ?>
    <title><?= $title ?></title>
</head>

<body>
    <div class="container">
        <header
            class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
            <div class="col-md-3 mb-2 mb-md-0">
                <img src="<?= FOLDER_PUBLIC_ASSETS ?>/img/background/LOGO.png" alt="" width="125" height="125"
                    class="d-inline-block align-text-top">
            </div>

            <ul class="nav col-12 justify-content-center mx-auto">
                <h1>Recuperar Contraseña</h1>
            </ul>
        </header>
    </div>

    <div class="login-container1">
        <div class="header">
            <h2>Para recuperar su contraseña por favor digite el correo registrado a su cuenta, allí le enviaremos un
                enlace para ingresar su nueva contraseña.</h2>
        </div>
        <form class="login-form">
            <label for="username">Correo Electrónico</label>
            <input type="text" required id="RecuperarPassword" name="RecuperarPassword">


        </form>
        <div class="d-flex flex-column align-items-center mt-3">
            <a class="btn back-button mb-2" onclick="recuperarContraseña()">Enviar Correo</a> 
            <button class="back-button" onclick="window.location.href='index';">Regresar</button>
        </div>
    </div>

    <footer class="py-3 my-4">
        <ul class="nav justify-content-center border-bottom pb-3 mb-3">
        </ul>
        <p class="text-center text-white"></p>
    </footer>
</body>
<script src="../../../public/assets/js/Usuario/recuperarContraseña.js"></script>

</html>
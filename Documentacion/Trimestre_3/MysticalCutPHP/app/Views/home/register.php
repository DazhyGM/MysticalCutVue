<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="<?= FOLDER_PUBLIC_ASSETS ?>/img/background/LOGOHEADERTRANS.png">
    <?php include_once FOLDER_VIEWS_CSS . 'style.php'; ?>
    <?php include_once FOLDER_VIEWS_CSS . 'register.php'; ?>
    <title>Register</title>
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
                <h1>Registrarse</h1>
            </ul>
        </header>
    </div>

    <div class="recover-container">
        <form class="recover-form">
            <div class="row">
                <div class="col-md-6">
                    <h3>Tipo de documento de identificación</h3>
                    <label>
                        <input type="radio" name="doc-type" value="cedula-ciudadania"> Cédula de Ciudadanía
                    </label>
                    <label>
                        <input type="radio" name="doc-type" value="tarjeta-identidad"> Tarjeta de Identidad
                    </label>
                    <label>
                        <input type="radio" name="doc-type" value="cedula-extranjeria"> Cédula de Extranjería
                    </label>
                    <label for="full-name">Nombres y Apellidos</label>
                    <input type="text" id="full-name" name="full-name" required
                        placeholder="Ingresa tu nombre y apellido">
                    <label for="email">Correo Electrónico</label>
                    <input type="email" id="email" name="email" required placeholder="Ingresa tu correo">
                </div>
                <div class="col-md-6">
                    <label for="id-number">Número de Identificación</label>
                    <input type="text" id="id-number" name="id-number" required placeholder="Ingresa tu documento">
                    <label for="address">Dirección</label>
                    <input type="text" id="address" name="address" required placeholder="Ingresa tu dirección">
                    <label for="password">Contraseña</label>
                    <input type="password" id="password" name="password" required placeholder="Ingresa tu contraseña">
                    <label for="confirm-password">Confirmar Contraseña</label>
                    <input type="password" id="confirm-password" name="confirm-password" required
                        placeholder="Confirma tu contraseña">
                </div>
            </div>

            <td><a class="btn button-registrar" onclick="confirmRegistro()">Registrarse</a></td>
        </form>
        <button class="back-button" onclick="window.location.href='index';">Regresar</button>
    </div>

    <footer class="py-3 my-4">
        <ul class="nav justify-content-center border-bottom pb-3 mb-3">
        </ul>
        <p class="text-center text-white"></p>
    </footer>
</body>
<script src="../../../public/assets/js/Usuario/registro.js"></script>

</html>
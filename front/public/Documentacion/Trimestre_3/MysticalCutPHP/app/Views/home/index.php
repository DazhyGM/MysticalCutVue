<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="<?= FOLDER_PUBLIC_ASSETS ?>/img/background/LOGOHEADERTRANS.png">
    <?php include_once FOLDER_VIEWS_CSS . 'style.php'; ?>
    <title>Inicio</title>
</head>

<body>
    <div class="container">
        <header
            class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
            <div class="col-md-3 mb-2 mb-md-0">
                <img src="<?= FOLDER_PUBLIC_ASSETS ?>/img/background/LOGO.png" alt="" width="125" height="125"
                    class="d-inline-block align-text-top">
            </div>

            <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                <H1>MysticalCut</H1>
            </ul>

            <div class="col-md-3 text-end">
                <a class="btn botonav" href="<?= URL_CONTROLLER_LOGIN ?>">
                    <i class="fas fa-cog me-2"></i>Iniciar Sesion
                </a>
                <a class="btn botonav" href="<?= URL_CONTROLLER_REGISTER ?>">
                    <i class="fas fa-cog me-2"></i>Registrar
                </a>
            </div>
        </header>
    </div>


    <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
        <div class="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active"
                aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1"
                aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2"
                aria-label="Slide 3"></button>
        </div>
        <div class="carousel-inner">
            <div class="carousel-item active">
                <img src="<?= FOLDER_PUBLIC_ASSETS ?>/img/background/ImagenPrincipal.jpeg" class="d-block w-100"
                    alt="...">
                <div class="carousel-caption d-none d-md-block titulo1">
                    <h1>Bienvenidos a MysticalCut</h1>
                </div>
            </div>
            <div class="carousel-item">
                <img src="<?= FOLDER_PUBLIC_ASSETS ?>/img/background/Productos.jpg" class="d-block w-100" alt="...">
                <div class="carousel-caption d-none d-md-block">
                    <h2>Los mejores productos de Barberia</h2>
                    <p>Ofrecemos los mejores productos que puedes encontrar en el mercado a los mejores precios.</p>
                </div>
            </div>
            <div class="carousel-item">
                <img src="<?= FOLDER_PUBLIC_ASSETS ?>/img/background/corte.jpeg" class="d-block w-100" alt="...">
                <div class="carousel-caption d-none d-md-block">
                    <h2>Nuestros servicios</h2>
                    <p>Ofrecemos una gran variedad de servicios como: Cortes barba tintura.</p>
                </div>
            </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions"
            data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions"
            data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>


</body>

<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>

<footer class="py-3 my-4 bg-dark text-white">
    <div class="container">
        <div class="row">
            <div class="col-md-6">
                <h5>Barbería Mystical Cut</h5>
                <p>
                    Dirección: Calle Ejemplo 123, Ciudad, País<br>
                    Teléfono: (123) 456-7890<br>
                    Email: contacto@mysticalcut.com
                </p>
            </div>
            <div class="col-md-6 text-center">
                <h5>Síguenos</h5>
                <ul class="nav justify-content-center">
                    <li class="nav-item">
                        <a class="nav-link" href="https://facebook.com" target="_blank" aria-label="Facebook">
                            <img src="<?= FOLDER_PUBLIC_ASSETS ?>/img/background/logo facebook.png" alt="Facebook"
                                class="social-icon">
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="https://instagram.com" target="_blank" aria-label="Twitter">
                            <img src="<?= FOLDER_PUBLIC_ASSETS ?>/img/background/instagram.png" alt="Twitter"
                                class="social-icon">
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="https://tiktok.com" target="_blank" aria-label="Instagram">
                            <img src="<?= FOLDER_PUBLIC_ASSETS ?>/img/background/tiktok.png" alt="Instagram"
                                class="social-icon">
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="https://wa.me/1234567890" target="_blank" aria-label="LinkedIn">
                            <img src="<?= FOLDER_PUBLIC_ASSETS ?>/img/background/whatsapp.jpg" alt="LinkedIn"
                                class="social-icon">
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <p class="text-center mt-3 mb-0">© 2024 www.mysticalcut.com, Inc</p>
    </div>
</footer>



</html>
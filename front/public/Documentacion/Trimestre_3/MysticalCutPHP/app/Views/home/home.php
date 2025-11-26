<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="<?= FOLDER_PUBLIC_ASSETS ?>/img/background/LOGOHEADERTRANS.png">
    <?php include_once FOLDER_VIEWS_CSS . 'style.php'; ?>

    <title>Home</title>
</head>

<body>

<div class="container">
    <header
      class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <div class="col-md-3 mb-2 mb-md-0">
        <img src="<?= FOLDER_PUBLIC_ASSETS ?>/img/background/LOGO.png" alt="Logo" width="125" height="125"
          class="d-inline-block align-text-top">
      </div>

      <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">

        <?php foreach ($roleModules as $module): ?>
          <li class="nav-item">
            <a class="nav-link"
              href="<?= URL_CONTROLLER ?>/<?= $module['module_route'] ?>"><?= $module['role_module'] ?></a>
          </li>
        <?php endforeach ?>
      </ul>

      <div class="col-md-3 text-end">
        <div class="dropdown d-inline">
          <a href="#" class="textnav dropdown-toggle" id="profileDropdown" data-bs-toggle="dropdown"
            aria-expanded="false">
            <img src="<?= FOLDER_PUBLIC_ASSETS ?>/img/background/Icono usuario.png" alt="Profile" class="icon"
              >Perfil
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><a class="dropdown-item" href="<?= URL_CONTROLLER_HOME?>"><?= ($getUser[0]['full_name']) ?></a></li>
            <li>
              <hr class="dropdown-divider">
            </li>
            <li style="background: red;"><a style="color:gray;" class="dropdown-item"
                href="<?= URL_CONTROLLER ?>/login/logOut">Log Out</a></li>
          </ul>
        </div>
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



    <div id="servicios" class="container section">
        <h2 class="section-title">Servicios</h2>
    </div>

    <div class="container">
        <div class="row row-cols-1 row-cols-md-4 g-8">
            <div class="col">
                <div class="card">
                    <a href="../Usuario/ElegirTipoCita.html">
                        <img src="<?= FOLDER_PUBLIC_ASSETS ?>/img/background/BarbaCortaCuadrada.jpg"
                            class="card-img-top" alt="Barba Corta Cuadrada">
                    </a>
                    <div class="card-body">
                        <h5 class="card-title">Barba Corta Cuadrada</h5>
                        <p class="card-text">La barba corta cuadrada se parece a una barba completa, pero sus laterales
                            son más
                            finos y están recortados con precisión.</p>
                    </div>
                </div>

            </div>
            <div class="col">
                <div class="card">
                    <a href="../Usuario/ElegirTipoCita.html">
                        <img src="<?= FOLDER_PUBLIC_ASSETS ?>/img/background/mullet.jpg" class="card-img-top" alt="...">
                    </a>
                    <div class="card-body">
                        <h5 class="card-title">Mullet</h5>
                        <p class="card-text">El corte mullet es un estilo que juega con dos extensiones: más corto en la
                            parte
                            superior de la cabeza y los lados, y más largo en la parte de atrás.</p>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card">
                    <a href="../Usuario/ElegirTipoCita.html">
                        <img src="<?= FOLDER_PUBLIC_ASSETS ?>/img/background/cejasflat.jpg" class="card-img-top"
                            alt="...">
                    </a>
                    <div class="card-body">
                        <h5 class="card-title">Cejas Flat</h5>
                        <p class="card-text">Son un tipo de cejas que son rectas y terminan en una pequeña curva.</p>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card">
                    <a href="../Usuario/ElegirTipoCita.html">
                        <img src="<?= FOLDER_PUBLIC_ASSETS ?>/img/background/tintebicolor.jpg" class="card-img-top"
                            alt="...">
                    </a>
                    <div class="card-body">
                        <h5 class="card-title">Tinte bicolor</h5>
                        <p class="card-text">Dividiendo el pelo por la mitad o creando líneas en el cabello</p>
                    </div>
                </div>
            </div>
        </div>

        <button class="back-button btn-custom mx-auto" onclick="window.location.href='paginaPrincipalADM.html';">Elige
            tu
            servicio</button>


        <div id="productos" class="container section">
            <h2 class="section-title">Productos</h2>
        </div>

        <div class="row row-cols-1 row-cols-md-4 g-8">
            <div class="col">
                <div class="card">
                    <a href="../Usuario/Productos.html">
                        <img src="<?= FOLDER_PUBLIC_ASSETS ?>/img/background/ceramate.jpg" class="card-img-top"
                            alt="...">
                    </a>
                    <div class="card-body">
                        <h5 class="card-title">Cera</h5>
                        <p class="card-text">Cera mate para que tu pelo luzca como nunca</p>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card">
                    <a href="../Usuario/Productos.html"></a>
                    <img src="<?= FOLDER_PUBLIC_ASSETS ?>/img/background/shampoocaida.jpg" class="card-img-top"
                        alt="...">
                    </a>
                    <div class="card-body">
                        <h5 class="card-title">Shampoo</h5>
                        <p class="card-text">Shampoo para la caida del bello capilar</p>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card">
                    <a href="../Usuario/Productos.html">
                        <img src="<?= FOLDER_PUBLIC_ASSETS ?>/img/background/shaver.jpg" class="card-img-top" alt="...">
                    </a>
                    <div class="card-body">
                        <h5 class="card-title">Shaver</h5>
                        <p class="card-text">Esta shaver esta bañada en oro para pulir tus bellos y que queden bellos
                        </p>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card">
                    <a href="../Usuario/Productos.html">
                        <img src="<?= FOLDER_PUBLIC_ASSETS ?>/img/background/cremabarba.jpg" class="card-img-top"
                            alt="...">
                    </a>
                    <div class="card-body">
                        <h5 class="card-title">Crema</h5>
                        <p class="card-text">Crema especial para cuidar tu hermosa barba de macho pecho peludo</p>
                    </div>
                </div>
            </div>
        </div>

        <button class="back-button btn-custom mx-auto" onclick="window.location.href='paginaPrincipalADM.html';">Elige
            el
            producto
            que más te guste </button>
    </div>
    </div>
    </div>


</body>

<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>

<footer class="py-3 my-4 bg-dark text-white">
    <div class="container">
        <div class="row">
            <div class="col-md-6">
                <h5>Barbería Mystical Cut</h5>
                <p class="mb-3">
                    Dirección: Calle Ejemplo 123, Ciudad, País<br>
                    Teléfono: (123) 456-7890<br>
                    Email: contacto@mysticalcut.com
                </p>
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
            <div class="col-md-6">
                <h5>Ubicación</h5>
                <div class="map-container mb-3">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4230.7278529137275!2d-74.11469928920897!3d4.596216942534717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f992f88e2ce0b%3A0x5f759f81a7557781!2sSENA%20-%20Complejo%20sur!5e1!3m2!1ses!2smx!4v1725854087638!5m2!1ses!2smx"
                        width="100%" height="200" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
                </div>
            </div>
        </div>
        <p class="text-center mt-3 mb-0">© 2024 www.mysticalcut.com, Inc</p>
    </div>
</footer>

</html>
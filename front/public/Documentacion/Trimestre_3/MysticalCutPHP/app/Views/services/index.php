<?php

?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php include_once FOLDER_VIEWS_CSS . 'style.php'; ?>
    <?php include_once FOLDER_VIEWS_CSS . 'Services.php'; ?>
    <title><?= $title ?></title>
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


                        </ul>

                        <div class="col-md-3 text-end">
                            <div class="dropdown d-inline">
                                <a href="#" class="textnav dropdown-toggle" id="profileDropdown" data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    <img src="<?= FOLDER_PUBLIC_ASSETS ?>/img/background/Icono usuario.png" alt="Profile"
                                        class="icon">Perfil
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><a class="dropdown-item"
                                            href="<?= URL_CONTROLLER_HOME ?>"><?= ($getUser[0]['full_name']) ?></a></li>
                                    <li>
                                        <hr class="dropdown-divider">
                                    </li>
                                    <li style="background: red;"><a style="color:gray;" class="dropdown-item"
                                            href="<?= URL_CONTROLLER ?>/login/logOut">Log Out</a></li>
                                </ul>
                            </div>
                        </div>
                    </header>

                    <div>
                        <a href="<?= URL_CONTROLLER ?>/services/viewCreate" class="btn btn-agregar">
                            <img src="../../public/assets/img/logos/person-plus-fill.svg"
                                style="width: 20px; height: 20px; margin-right: 5px;">Agregar
                        </a>
                    </div>

                    <?php
                    // Arreglo con los nombres personalizados
                    $customTitles = [
                        1 => "Cortes de Cabello ", // ID del servicio 1
                        2 => "Afeitado y Barba", // ID del servicio 2
                        3 => "Coloración y Tintes", // ID del servicio 3
                        4 => "Tratamientos Capilares", // ID del servicio 4
                        5 => "Servicios para Niños", // ID del servicio 5
                    ];
                    ?>

                    <div class="row justify-content-center">
                        <!-- Left Column: Services -->
                        <div class="col-md-8">
                            <section id="cortes" class="section">
                                <div class="d-flex flex-column align-items-center">
                                    <?php foreach ($services as $service): ?>
                                        <div class="service-section w-75 mb-5">
                                            <!-- Encabezado encima del servicio -->
                                            <h3 class="text-center text-uppercase">
                                                <?= htmlspecialchars($customTitles[$service['id_services']] ?? "Sin título") ?>
                                            </h3>

                                            <!-- Tarjeta del servicio -->
                                            <div class="card">
                                                <div class="card-body d-flex">
                                                    <!-- Imagen del servicio -->
                                                    <div class="service-image">
                                                        <img src="<?= FOLDER_PUBLIC_ASSETS ?>/img/background/combo01.png"
                                                            <?= htmlspecialchars($service['image'] ?? 'default.jpg') ?>"
                                                            alt="<?= htmlspecialchars($service['name_service']) ?>" class="img-fluid"
                                                            style="max-width: 150px; margin-right: 15px;">
                                                    </div>

                                                    <!-- Detalles del servicio -->
                                                    <div class="service-details">
                                                        <h5 class="card-title"><?= htmlspecialchars($service['name_service']) ?></h5>

                                                        <div class="card-actions mt-2">
                                                            <a href="<?= URL_CONTROLLER ?>/services/edit/<?= $service['id_services'] ?>"
                                                                class="btn btn-icon btn-edit">Editar</a>
                                                            <button class="btn btn-icon btn-delete"
                                                                onclick="if(confirm('¿Estás seguro de eliminar este servicio?')) { window.location.href='<?= URL_CONTROLLER ?>/facture/index/<?= $service['id_services'] ?>'; }">Eliminar</button>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    <?php endforeach; ?>
                                </div>
                            </section>
                        </div>
                    </div>
                    <div class="btn-regresar mt-3">
                        <button class="back-button btn btn-secondary"
                            onclick="window.location.href='../home/perfil';">Regresar</button>
                    </div>

                </div>
                <footer class="py-3 my-4">
                    <ul class="nav justify-content-center border-bottom pb-3 mb-3">
                    </ul>
                    <p class="text-center text-white"></p>
                </footer>
                <?php include_once FOLDER_VIEWS_JS . 'js.php'; ?>
            </body>

</html>
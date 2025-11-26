<?php
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="<?= FOLDER_PUBLIC_ASSETS ?>/img/background/LOGOHEADERTRANS.png">
    <?php include_once FOLDER_VIEWS_CSS . 'style.php'; ?>
    <?php include_once FOLDER_VIEWS_CSS . 'verycrearusuario.php'; ?>

    <title>User</title>
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

    <div class="container">


        <div class="d-flex align-items-center justify-content-between w-100 mb-3">
            <div>
                <a href="<?= URL_CONTROLLER ?>/user/viewCreate" class="btn btn-agregar">
                    <img src="../../public/assets/img/logos/person-plus-fill.svg"
                        style="width: 20px; height: 20px; margin-right: 5px;">Agregar
                </a>
            </div>

            <div class="input-group" style="max-width: 300px;">
                <input type="text" class="form-control" placeholder="Buscar usuario..." aria-label="Buscar usuario">
                <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                    aria-expanded="false"></button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="#">A......Z</a></li>
                    <li><a class="dropdown-item" href="#">Z......A</a></li>
                    <li><a class="dropdown-item" href="#">Fecha de registro</a></li>
                    <li><a class="dropdown-item" href="#">Último pedido</a></li>
                </ul>
            </div>
        </div>

        <div class="pedido-container" style="height : 400px; overflow: auto">
            
            <?php foreach ($users as $index => $user): ?>
                <div class="pedido-box">
                    <div class="icon-usuario-container">
                        <img src="../../public/assets/img/logos/person-circle.svg" class="btn icon-usuario">
                    </div>
                    <h5><?= htmlspecialchars($user['full_name']) ?></h5>

                    <div class="icon-container">
                        <a href="<?= URL_CONTROLLER ?>/user/edit/<?= $user['user_id'] ?>" class="btn btn-icon">
                        <img src="../../public/assets/img/logos/pencil.svg" alt="Icono lapiz">
                        </a>
                        <a href="<?= URL_CONTROLLER ?>/user/showId/<?= $user['user_id'] ?>" class="btn btn-icon">
                            <img src="../../public/assets/img/logos/eye.svg" alt="Icono Ojo">
                        </a>
                        <a href="<?= URL_CONTROLLER ?>/user/viewDelete/<?= $user['user_id'] ?>" class="btn btn-icon"
                            onclick="return confirm('¿Estás seguro de eliminar este usuario?');">
                            <img src="../../public/assets/img/logos/x-circle.svg">
                        </a>
                    </div>
                </div>
            <?php endforeach; ?>
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

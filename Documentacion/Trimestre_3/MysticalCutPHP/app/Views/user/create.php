<?php

?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <?php include_once FOLDER_VIEWS_CSS . 'style.php'; ?>
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

      <ul class="nav col-12 justify-content-center mx-auto">
        <h1>Agregar usuario</h1>
      </ul>
    </header>
  </div>
  <div class="container">
    <h3><?= $title ?></h3>

    <div class="row">

    <form action="<?= URL_CONTROLLER ?>/user/create" method="POST">
        
        <div class="form-floating mb-3">
          <input type="email" class="form-control form-control-sm" id="user" name="user" placeholder="name@example.com" required>
          <label for="user">Email</label>
        </div>
        <div class="form-floating mb-3">
          <input type="password" class="form-control form-control-sm" id="password" name="password" placeholder="Password" required>
          <label for="password">Password</label>
        </div>
        <div class="form-floating mb-3">
          <input type="text" class="form-control form-control-sm" id="full_name" name="full_name" placeholder="full name" required>
          <label for="user">Full name</label>
        </div>
        <div class="form-floating">
          <input type="hidden" class="form-control form-control-sm" id="status" value="1" name="status" placeholder="Activo" required>
        </div>
        <div class="form-floating">
          <input type="hidden" class="form-control form-control-sm" id="role" value="3" name="role" placeholder="Cliente" required>
        </div>
        
  
        <button type="submit" class="btn btn-success mt-2 w-100">Success</button>
      </form>
    </div>
    <div class="btn-regresar mt-3">
            <button class="back-button btn btn-secondary"
                onclick="window.location.href='../user/index';">Regresar</button>
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
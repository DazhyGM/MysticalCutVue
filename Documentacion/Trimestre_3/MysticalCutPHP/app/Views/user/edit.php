<?php

?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <?php include_once FOLDER_VIEWS_CSS . 'style.php'; ?>
  <?php include_once FOLDER_VIEWS_CSS . 'editUser.php'; ?>
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
        <h1>Editar Usuario</h1>
      </ul>
    </header>
  </div>
  <div class="recover-container">
    <div class="container">

      <form action="<?= URL_CONTROLLER ?>/user/update/<?= $user[0]['user_id'] ?>" method="POST">
        <div class="container">

          <div class="form-floating mb-3">
            <input type="email" class="form-control form-control-sm" id="user" name="user"
              placeholder="name@example.com" value="<?= $user[0]['user_email'] ?>" required>
            <label for="user">Email address</label>
          </div>
          <div class="form-floating mb-3">
            <input type="password" style="text-overflow: ellipsis;" class="form-control form-control-sm" id="password"
              name="password" placeholder="Password" value="<?= $user[0]['user_password'] ?>" required>
            <label for="password">Password</label>
          </div>
          <div class="form-floating mb-3">
            <input type="text" class="form-control form-control-sm" id="full_name" name="full_name"
              placeholder="full_name" value="<?= $user[0]['full_name'] ?>" required>
            <label for="user">Full name</label>
          </div>
          
          <select class="form-select form-select-sm mt-2" aria-label=".form-select-sm example" id="status" name="status"
            required>
            <option disabled value>Open this select user status</option>
            <?php for ($i = 0; $i < count($status); $i++): ?>
              <?php if ($status[$i]['userStatus_id'] == $user[0]['userStatus_fk']): ?>
                <option selected value="<?= $status[$i]['userStatus_id'] ?>"><?= $status[$i]['userStatus_name'] ?></option>
              <?php else: ?>
                <option value="<?= $status[$i]['userStatus_id'] ?>"><?= $status[$i]['userStatus_name'] ?></option>
              <?php endif ?>
            <?php endfor ?>
          </select>
          <select class="form-select form-select-sm mt-2" aria-label=".form-select-sm example" id="role" name="role"
            required>
            <option disabled value>Open this select role</option>
            <?php for ($i = 0; $i < count($roles); $i++): ?>
              <?php if ($roles[$i]['role_id'] == $user[0]['role_fk']): ?>
                <option selected value="<?= $roles[$i]['role_id'] ?>"><?= $roles[$i]['role_name'] ?></option>
              <?php else: ?>
                <option value="<?= $roles[$i]['role_id'] ?>"><?= $roles[$i]['role_name'] ?></option>
              <?php endif ?>
            <?php endfor ?>
          </select>
        </div>
        <button type="submit" class="btn submit-button" title="Update">Update</button>
      </form>
    </div>

    <div class="btn-regresar mt-3">
      <button class="back-button btn btn-secondary" onclick="window.location.href='../index';">Regresar</button>
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
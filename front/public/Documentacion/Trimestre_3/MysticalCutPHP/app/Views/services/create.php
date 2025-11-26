<?php

?>

<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <?php include_once FOLDER_VIEWS_CSS . 'style.php'; ?>
  <?php include_once FOLDER_VIEWS_CSS . 'agregarProducto.php'; ?>
  <title><?= $title ?></title>
</head>

<body>
  <div class="container">
    <header
      class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <div class="col-md-3 mb-2 mb-md-0">
        <img src="<?= FOLDER_PUBLIC_ASSETS ?>/img/background/LOGO.png" alt="Logo" width="125" height="125">
      </div>
      <ul class="nav col-12 justify-content-center mx-auto">
        <h1><?= $title ?></h1>
      </ul>
    </header>

    <div class="row edit-container">
      <div class="col-md-5 text-center">
        <div class="image-placeholder mx-auto">
          <img id="placeholder-image" src="<?= FOLDER_PUBLIC_ASSETS ?>/img/placeholder.png" alt="Placeholder Image"
            style="max-width: 100%; height: auto;">
        </div>
        <div class="additional-container">
          <label for="file-input" class="profile-button btn btn-dark mt-2"
            style="display: inline-block; text-align: center; cursor: pointer;">Examinar</label>
          <input type="file" id="file-input" class="file-input" accept="image/jpeg, image/png, image/jpg"
            style="display: none;">
        </div>

      </div>

      <div class="col-md-5 offset-md-1">
        <form action="<?= URL_CONTROLLER ?>/services/update/<?= $service['id_services'] ?>" method="POST"
          class="edit-form">
          <div class="form-floating mb-3">
            <input type="text" class="form-control form-control-sm" id="name_service" name="name_service"
              placeholder="Nombre del servicio" value="<?= $service['name_service'] ?>" required>
            <label for="name_service">Nombre del Servicio</label>
          </div>

          <div class="form-floating mb-3">
            <input type="time" class="form-control form-control-sm" id="estimated_time" name="estimated_time"
              value="<?= $service['estimated_time'] ?>" required>
            <label for="estimated_time">Tiempo Estimado</label>
          </div>

          <div class="form-floating mb-3">
            <input type="number" step="0.01" class="form-control form-control-sm" id="price" name="price"
              placeholder="Precio" value="<?= $service['price'] ?>" required>
            <label for="price">Precio</label>
          </div>

          <div class="form-floating mb-3">
            <label for="id_category_services">Categoría</label>
            <select class="form-select form-select-sm mt-2" id="id_category_services" name="id_category_services"
              required>
              <option disabled value>Selecciona una categoría</option>
              <?php foreach ($category_services as $category): ?>
                <option value="<?= $category['id_category_services'] ?>"
                  <?= $category['id_category_services'] == $service['id_category_services'] ? 'selected' : '' ?>>
                  <?= $category['name'] ?>
                </option>
              <?php endforeach ?>
            </select>
          </div>

          <button type="submit" class="btn btn-success mt-3 w-100" title="Actualizar">Actualizar</button>
        </form>
      </div>
    </div>

    <div class="text-center mt-3">
      <button class="back-button btn btn-secondary"
        onclick="window.location.href='../services/index';">Regresar</button>
    </div>
  </div>

  <footer class="py-3 my-4">
    <ul class="nav justify-content-center border-bottom pb-3 mb-3"></ul>
  </footer>

  <?php include_once FOLDER_VIEWS_JS . 'js.php'; ?>
</body>

</html>
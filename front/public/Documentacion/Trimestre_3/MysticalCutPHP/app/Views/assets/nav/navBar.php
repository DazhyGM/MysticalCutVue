<nav
  class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
  <div class="container">
    <a class="navbar-brand" href="#"> <img src="<?= FOLDER_PUBLIC_ASSETS ?>/img/background/LOGO.png"
        class="img img-fluid" width="50">
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">

        <?php foreach ($roleModules as $module): ?>
          <li class="nav-item">
            <a class="nav-link" href="<?= URL_CONTROLLER ?>/<?= $module['module_route'] ?>"><?= $module['role_module'] ?></a>
          </li>
        <?php endforeach ?>
      </ul>
      <ul class="col-md-3 text-end" style="padding-right:100px !important;">
        <li class="nav-item dropdown">
          <div class="btn-group dropstart">
            <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown"
              aria-expanded="false">
              <i class="bi bi-person-circle"></i>
            </button>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li><a class="dropdown-item" href="#"><?= ($getUser[0]['full_name']) ?></a></li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li style="background: red;"><a style="color:gray;" class="dropdown-item"
                  href="<?= URL_CONTROLLER ?>/login/logOut">Log Out</a></li>
            </ul>
          </div>
        </li>
      </ul>

    </div>
  </div>
</nav>
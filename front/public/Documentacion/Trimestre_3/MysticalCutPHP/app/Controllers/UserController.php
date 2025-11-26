<?php


namespace App\Controllers;

use App\Models\UserModel;
use App\Models\RoleModuleModel;
use App\Models\UserStatusModel;
use App\Models\RoleModel;
use App\Config\View;

use Exception;

class UserController
{
  private $data;
  private $model;
  private $roleModel;
  private $roleModuleModel;
  private $roleModules;
  private $statusModel;
  private $result;
  private $userApp;

  /**
   * The constructor initializes data, model objects, and result variable for a user-related class in
   * PHP.
   */
  public function __construct()
  {
    $this->data = [];
    $this->userApp=[];
    $this->model = new UserModel();
    $this->statusModel = new UserStatusModel();
    $this->roleModel = new RoleModel();
    $this->result = "";
    
  }

 /**
  * The index function retrieves all user data from the model and renders it in a view, handling
  * exceptions by setting an error message if an exception occurs.
  */
  public function index()
{
    try {
      $this->getModulesRoles();
        // Parámetros de paginación
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1; // Página actual
        $limit = 20; // Número de usuarios por página
        $offset = ($page - 1) * $limit; // Cálculo del desplazamiento

        // Obtener usuarios paginados
        $this->result = $this->model->findAll($offset, $limit);
        $totalUsers = $this->model->countUsers(); // Método para contar el total de usuarios

        // Cálculo de páginas totales
        $totalPages = ceil($totalUsers / $limit);

        // Configurar vista con datos
        $view = new View('user/index');
        $view->set('title', 'User Index');
        $view->set('users', $this->result);
        $view->set('roleModules', $this->roleModules);
        $view->set('getUser', $this->userApp);

        // Datos de paginación
        $view->set('currentPage', $page);
        $view->set('totalPages', $totalPages);
        $view->render();
    } catch (Exception $e) {
        $this->data['data'] = [];
        $this->data['status'] = 404;
        $this->data['message'] = "Error: " . $e->getMessage();
    }
}

  public function getModulesRoles(){
    $this->roleModuleModel=new RoleModuleModel();
    $this->userApp= $_SESSION[SESSION_APP];
    $userRole= $this->userApp[0]['role_fk'];
    $this->roleModules=$this->roleModuleModel->roleModules($userRole);
  }
 /**
  * The function `showId` retrieves user data by ID and renders it in a view, handling exceptions if
  * they occur.
  * 
  * @param int id The `showId` function is a method that takes an integer parameter ``, which is set
  * to `null` by default. This function is responsible for fetching user data based on the provided
  * `` and rendering a view to display the user details along with roles and status information.
  */
  public function showId(int $id = null)
  {
    try {
      $this->getModulesRoles();
      $this->result = $this->model->findId($id);
      $view = new View('user/show');
      $view->set('title', 'User Show');
      $view->set('user', $this->result);
      $view->set('roles', $this->roleModel->findAll());
      $view->set('status', $this->statusModel->findAll());
      $view->set('roleModules',  $this->roleModules);
      $view->set('getUser',  $this->userApp);
      $view->render();
    } catch (Exception $e) {
      $this->data['data'] = [];
      $this->data['status'] = 404;
      $this->data['message'] = "Error: " . $e->getMessage();
    }
     //echo json_encode($this->data);
  }
  
/**
 * The edit function retrieves user data for editing and renders a view with user information, roles,
 * and status options, handling exceptions by returning an error message.
 * 
 * @param int id The `edit` function in the code snippet you provided is a PHP method that is
 * responsible for rendering a user edit view with specific data. The function takes an integer
 * parameter `` with a default value of `null`. This parameter is used to find a specific user
 * record based on the provided ID
 */
  public function edit(int $id = null)
  {
    try {
      $this->getModulesRoles();
      $this->result = $this->model->findId($id);
      $view = new View('user/edit');
      $view->set('title', 'User Edit');
      $view->set('user', $this->result);
      $view->set('roles', $this->roleModel->findAll());
      $view->set('status', $this->statusModel->findAll());
      $view->set('roleModules',  $this->roleModules);
      $view->set('getUser',  $this->userApp);
      $view->render();
    } catch (Exception $e) {
      $this->data['data'] = [];
      $this->data['status'] = 404;
      $this->data['message'] = "Error: " . $e->getMessage();
    }
     //echo json_encode($this->data);
  }

 /**
  * The show function retrieves data from a model in PHP and handles exceptions by returning
  * appropriate status and message.
  */
  public function show()
  {
    try {
      $this->result = $this->model->findAll();
      $this->data['data'] = $this->result;
      $this->data['status'] = 200;
      $this->data['message'] = "ok";
    } catch (Exception $e) {
      $this->data['data'] = [];
      $this->data['status'] = 404;
      $this->data['message'] = "Error: " . $e->getMessage();
    }
    echo json_encode($this->data);
  }

  /**
   * The create function attempts to create a new entry using model data and handles exceptions by
   * setting appropriate response data.
   */

   public function create()
{
    try {
      $this->result = $this->model->create($this->getDataModel());
      $this->data['data'] = $this->result;
      $this->data['status'] = 200;
      $this->data['message'] = "ok";
        
        // $this->result = $this->model->create($data); // Intenta crear el usuario

        if ($this->result) {
            //Redirigir con mensaje de éxito
            header("Location: ".URL_CONTROLLER_USER."");
            exit;
        } else {
            throw new Exception("Error al crear el usuario.");
        }
    } catch (Exception $e) {
        // Redirigir con mensaje de error
        header("Location: ".URL_CONTROLLER_USER."/create?error=" . urlencode($e->getMessage()));
        exit;
    }
}

public function createAPI()
{
    
    try {
      $this->result = $this->model->create($this->getDataModel());
      $this->data['data'] = $this->result;
      $this->data['status'] = 200;
      $this->data['message'] = "ok";
    } catch (Exception $e) {
      $this->data['data'] = [];
      $this->data['status'] = 404;
      $this->data['message'] = "Error: " . $e->getMessage();
    }
    echo json_encode($this->data);
}

 /**
  * The viewCreate function in PHP sets up a view for creating a user with title, roles, and status
  * data, and catches any exceptions that may occur.
  */
  public function viewCreate()
  {
    try {
      $this->getModulesRoles();
      $view = new View('user/create');
      $view->set('title', 'User Create');

      $view->set('roleModules',  $this->roleModules);
      $view->set('getUser',  $this->userApp);
      $view->render();
    } catch (Exception $e) {
      $this->data['data'] = [];
      $this->data['status'] = 404;
      $this->data['message'] = "Error: " . $e->getMessage();
    }
    //echo json_encode($this->data);
  }

  /**
   * This PHP function updates a record in a database based on the provided ID, handling validation and
   * error messages accordingly.
   * 
   * @param int id The `update` function you provided seems to be updating a record in a database based
   * on the `` parameter. The function first checks if a record with the given `` exists in the
   * database. If it does, it proceeds with the update operation; otherwise, it returns an error message
   */

  public function update(int $id = null)
  {
    try {
      
      if (count($this->model->findId($id)) > 0) {
        $this->result  = $this->model->update($this->getDataModel(), $id);
        $this->data['data'] = $this->result;
        $this->data['status'] = 200;
        $this->data['message'] = "ok";

        header("Location: ".URL_CONTROLLER_USER);
      } else {
        $this->data['data'] =  [];
        $this->data['status'] = 404;
        $this->data['message'] = "Error: Validate - User record does not exist";
      }
    } catch (Exception $e) {
      $this->data['data'] = [];
      $this->data['status'] = 404;
      $this->data['message'] = "Error: " . $e->getMessage();
    }
    //echo json_encode($this->data);
  }

  public function updateAPI(int $id = null)
  {
    try {
      
      if (count($this->model->findId($id)) > 0) {
        $this->result  = $this->model->update($this->getDataModel(), $id);
        $this->data['data'] = $this->result;
        $this->data['status'] = 200;
        $this->data['message'] = "ok";

      } else {
        $this->data['data'] =  [];
        $this->data['status'] = 404;
        $this->data['message'] = "Error: Validate - User record does not exist";
      }
    } catch (Exception $e) {
      $this->data['data'] = [];
      $this->data['status'] = 404;
      $this->data['message'] = "Error: " . $e->getMessage();
    }
    echo json_encode($this->data);
  }
/**
 * This PHP function deletes a user record based on the provided ID and returns a response with status
 * and message.
 * 
 * @param int id The `delete` function you provided seems to be a part of a PHP class. This function is
 * responsible for deleting a record based on the provided `id`.
 */
  public function delete(int $id = null)
  {
    try {
     
        if (count($this->model->findId($id)) > 0) {
          $this->result  = $this->model->delete($id);
          $this->data['data'] = $this->result;
          $this->data['status'] = 200;
          $this->data['message'] = "ok";
          header("Location: ".URL_CONTROLLER_USER);
        } else {
          $this->data['data'] =  [];
          $this->data['status'] = 404;
          $this->data['message'] = "Error: Validate - User record does not exist";
        }
    
    } catch (Exception $e) {
      $this->data['data'] = [];
      $this->data['status'] = 404;
      $this->data['message'] = "Error: " . $e->getMessage();
    }
    // echo json_encode($this->data);
  }

/**
 * The viewDelete function in PHP retrieves user data for deletion and renders a view with user
 * details, roles, and status options.
 * 
 * @param int id The `viewDelete` function is a PHP method that is responsible for displaying a user
 * deletion view. It takes an integer parameter `` which is set to `null` by default. This parameter
 * is used to find the user with the corresponding ID for deletion.
 */
  public function viewDelete(int $id = null)
  {
    try {
      $this->getModulesRoles();
        $this->result = $this->model->findId($id);
        $view = new View('user/delete');
        $view->set('title', 'User Delete');
        $view->set('user', $this->result);
        $view->set('roles', $this->roleModel->findAll());
        $view->set('status', $this->statusModel->findAll());
        $view->set('roleModules',  $this->roleModules);
        $view->set('getUser',  $this->userApp);
        $view->render();
    } catch (Exception $e) {
      $this->data['data'] = [];
      $this->data['status'] = 404;
      $this->data['message'] = "Error: " . $e->getMessage();
    }
    // echo json_encode($this->data);
  }

/**
 * The function `getDataModel` retrieves user data from either JSON input or request parameters in PHP.
 * 
 * @return The `getDataModel` function returns an array `` containing the following keys and
 * values based on the input data:
 */

  private function getDataModel()
  {
    $data_request = json_decode(file_get_contents('php://input'), true);
  
    if ($data_request != NULL) {
      $getModel['user_email'] = empty($data_request['user']) ? '' : $data_request['user'];
      $getModel['user_password'] = empty($data_request['password']) ? '' : $data_request['password'];
      
      $getModel['full_name'] = empty($data_request['full_name']) ? '' : $data_request['full_name'];
      
      $getModel['userStatus_fk'] = $data_request['status'];
      $getModel['role_fk'] = $data_request['role'];
      
      
    } else {
      $getModel['user_email'] = empty($_REQUEST['user']) ? '' : $_REQUEST['user'];
      $getModel['user_password'] = empty($_REQUEST['password']) ? '' : $_REQUEST['password'];
     
      $getModel['full_name'] = empty($_REQUEST['full_name']) ? '' : $_REQUEST['full_name'];

      $getModel['userStatus_fk'] =empty($_REQUEST['status']) ? '' : $_REQUEST['status'];
      $getModel['role_fk'] = empty($_REQUEST['role']) ? '' : $_REQUEST['role'];
      

    }

    return $getModel;
  }
  
}

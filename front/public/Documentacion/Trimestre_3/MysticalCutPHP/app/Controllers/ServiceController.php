<?php


namespace App\Controllers;

use App\Models\ServiceModel;
use App\Models\RoleModuleModel;
use App\Models\ServiceStatusModel;
use App\Models\RoleModel;
use App\Config\View;

use Exception;


class ServiceController
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
    $this->model = new ServiceModel();
    //$this->statusModel = new ServiceStatusModel();
    $this->roleModel = new RoleModel();
    $this->result = "";
    $this->getModulesRoles();
  }

 /**
  * The index function retrieves all user data from the model and renders it in a view, handling
  * exceptions by setting an error message if an exception occurs.
  */
  public function index()
  {
    try {
      $this->result = $this->model->findAll();
      $view = new View('services/index');
      $view->set('title', 'service Index');
      $view->set('services', $this->result);
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
      $this->result = $this->model->findId($id);
      $view = new View('Services/show');
      $view->set('title', 'Service Show');
      $view->set('Services', $this->result);
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
      $this->result = $this->model->findId($id);
      $view = new View('services/edit');
      $view->set('title', 'Service Edit');
      $view->set('Services', $this->result);
      $view->set('roles', $this->roleModel->findAll());
      //$view->set('status', $this->statusModel->findAll());
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
    //echo json_encode($this->data);
  }

  /**
   * The create function attempts to create a new entry using model data and handles exceptions by
   * setting appropriate response data.
   */

  public function create()
  {
    try {
      $this->result  = $this->model->create($this->getDataModel());
      $this->data['data'] = $this->result;
      $this->data['status'] = 200;
      $this->data['message'] = "ok";
      header("Location: ".URL_CONTROLLER_SERVICE);
    } catch (Exception $e) {
      $this->data['data'] = [];
      $this->data['status'] = 404;
      $this->data['message'] = "Error: " . $e->getMessage();
    }
    //echo json_encode($this->data);
  }

 /**
  * The viewCreate function in PHP sets up a view for creating a user with title, roles, and status
  * data, and catches any exceptions that may occur.
  */
  public function viewCreate()
  {
    try {

      $view = new View('services/create');
      $view->set('title', 'Service Create');

      //$view->set('roleModules',  $this->roleModules);
      //$view->set('getUser',  $this->userApp);
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
          header("Location: ".URL_CONTROLLER_SERVICE);
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
        $this->result = $this->model->findId($id);
        $view = new View('service/delete');
        $view->set('title', 'Service Delete');
        $view->set('Service', $this->result);
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
      $getModel['name_services'] = empty($data_request['name_services']) ? '' : $data_request['name_services'];
      $getModel['estimated_time'] = empty($data_request['estimated_time']) ? '' : $data_request['estimated_time'];
      $getModel['price'] = empty($data_request['price']) ? '' : $data_request['price'];
      $getModel['id_category_services'] = empty($data_request['id_category_services']) ? '' : $data_request['id_category_services'];
    } else {
      $getModel['name_services'] = empty($_REQUEST['name_services']) ? '' : $_REQUEST['name_services'];
      $getModel['estimated_time'] = empty($_REQUEST['estimated_time']) ? '' : $_REQUEST['estimated_time'];
      $getModel['price'] = empty($_REQUEST['price']) ? '' : $_REQUEST['price'];
      $getModel['id_category_services'] = empty($_REQUEST['id_category_services']) ? '' : $_REQUEST['id_category_services'];
    }

    return $getModel;
  }
  
}
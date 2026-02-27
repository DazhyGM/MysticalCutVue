<?php


namespace App\Controllers;

use App\Models\ModuleModel;

use Exception;

class ModuleController
{
  private $data;
  private $model;
  private $idKey;
  /**
   * The constructor initializes an empty data array, creates a new instance of the UserModel class, and
   * sets the idKey property to "user_id".
   */
  public function __construct()
  {
    $this->data = [];
    $this->model = new ModuleModel();
    $this->idKey = "module_id";
  }
  /**
   * The index function initializes data and returns it as a JSON response with status and message.
   */
  public function index() {}
  /**
   * The function retrieves data from a model in PHP and returns it as a JSON response with status and
   * message information.
   */
  public function show()
  {
    try {
      $results = $this->model->findAll();
      $this->data['data'] = $results;
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
   * The function `showId` in PHP retrieves data based on an ID and returns a JSON response with status
   * and message.
   * 
   * @param int id The `showId` function is a PHP method that takes an integer parameter `` with a
   * default value of `null`.
   */
  public function showId(int $id = null)
  {
    try {
      if (!empty($id)) {
        $results = $this->model->findId($id);
        $this->data['data'] = $results;
        $this->data['status'] = 200;
        $this->data['message'] = "ok";
      } else {
        $this->data['data'] = [];
        $this->data['status'] = 404;
        $this->data['message'] = "Error Id";
      }
    } catch (Exception $e) {
      $this->data['data'] = [];
      $this->data['status'] = 404;
      $this->data['message'] = "Error: " . $e->getMessage();
    }
    echo json_encode($this->data);
  }

  public function create()
  {
    try {
      $results = $this->model->create($this->getDataModel());
      $this->data['data'] = $results;
      $this->data['status'] = 200;
      $this->data['message'] = "ok";
    } catch (Exception $e) {
      $this->data['data'] = [];
      $this->data['status'] = 404;
      $this->data['message'] = "Error: " . $e->getMessage();
    }
    echo json_encode($this->data);
  }

  public function update(int $id = null)
  {
    try {
      if (count($this->model->findId($id)) > 0) {
        $results = $this->model->update($this->getDataModel(), $id);
        $this->data['data'] = $results;
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

  public function delete(int $id = null)
  {
    try {

      if (count($this->model->findId($id)) > 0) {
        $results = $this->model->delete($id);
        $this->data['data'] = $results;
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

  private function getDataModel()
  {
    $data_request = json_decode(file_get_contents('php://input'), true);
    $getModel['module_name'] = empty($data_request['name']) ? '' : $data_request['name'];
    $getModel['module_route'] = empty($data_request['route']) ? '' : $data_request['route'];
    $getModel['module_description'] = empty($data_request['description']) ? '' : $data_request['description'];
    return $getModel;
  }
}

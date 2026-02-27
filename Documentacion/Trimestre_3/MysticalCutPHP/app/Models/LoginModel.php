<?php


namespace App\Models;

use App\Config\ConnectDB;
use Exception;
use PDO;

class LoginModel
{

  private $conn;
  private $data;
  private $sql;
  private $pdo;
  private $modelData;
  private $userKey;


  public function __construct()
  {
    $this->data = [];
    $this->modelData = ['user_email', 'user_password'];
    $this->userKey = 'user_email';
  }




  public function validateUser(array $user): array
  {

    try {
      if ($this->validateModel($user)) {
        $this->conn = new ConnectDB();
        $this->pdo = $this->conn->connect();
        $this->sql = "SELECT * FROM user WHERE userStatus_fk=1 AND $this->userKey=?";
        $stmt = $this->pdo->prepare($this->sql);

        $stmt->bindParam(1, $user[$this->modelData[0]]);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $this->data['logIn'] = $results;
        $this->data['password'] = $user[$this->modelData[1]];
      } else {
        $this->data['data'] = [];
        $this->data['status'] = 404;
        $this->data['message'] = 'Error';
      }
    } catch (Exception $e) {
      $this->data['data'] = [];
      $this->data['status'] = 404;
      $this->data['message'] = $e->getMessage();
    }
    return $this->data;
  }


  private function validateModel(array $array): bool
  {
    foreach ($this->modelData as $field) {
      if (empty($array[$field])) {
        return false;
      }
    }
    return true;
  }
}

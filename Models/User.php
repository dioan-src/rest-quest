<?php
require_once __DIR__ . '/Model.php';

class User extends Model
{
    protected $tableName = 'users';

    public function __construct()
    {
        parent::__construct();
    }

    public function findByEmail($email)
    {
        $query = "SELECT * FROM {$this->tableName} WHERE email = :email";
        $params = [':email' => $email];
        return $this->executeQuery($query, $params);
    }
}
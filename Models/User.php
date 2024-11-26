<?php
require_once __DIR__ . '/Model.php';

class User extends Model
{
    protected $tableName = 'users';

    public function __construct()
    {
        parent::__construct();
    }

    public function findByEmail(string $email)
    {
        $query = "SELECT * FROM {$this->tableName} WHERE email = :email";
        $params = [':email' => $email];
        return $this->executeQuery($query, $params);
    }

    public function findByRole(int $id)
    {
        $query = "SELECT * FROM {$this->tableName} WHERE role_id = :role_id";
        $params = ['role_id' => $id];
        return $this->executeQuery($query, $params);
    }

    public function findByUsername(string $username)
    {
        $query = "SELECT * FROM {$this->tableName} WHERE username = :username";
        $params = ['username' => $username];
        $results = $this->executeQuery($query, $params);
        return ($results) ? current($results) : null;
    }
}
<?php
require_once __DIR__ . '/Model.php';

class Request extends Model
{
    protected $tableName = 'requests';

    public function __construct()
    {
        parent::__construct();
    }

    public function findByUser($id)
    {
        $query = "SELECT * FROM {$this->tableName} WHERE user_id = :user_id";
        $params = ['user_id' => $id];
        return $this->executeQuery($query, $params);
    }

    public function findByStatus($statusId)
    {
        $query = "SELECT * FROM {$this->tableName} WHERE status_id = :status_id";
        $params = ['status_id' => $statusId];
        return $this->executeQuery($query, $params);
    }
}
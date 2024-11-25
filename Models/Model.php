<?php
require_once __DIR__ . '/../db/DBManager.php';

abstract class Model
{
    protected $db;
    protected $tableName;

    public function __construct()
    {
        $dbManager = new DBManager();
        $this->db = $dbManager->getConnection();
    }

    public function executeQuery($query, $params = null)
    {
        $stmt = $this->db->prepare($query);
        if ($params) {
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
        }
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findAll()
    {
        $query = "SELECT * FROM {$this->tableName}";
        return $this->executeQuery($query);
    }

    public function find($id)
    {
        $query = "SELECT * FROM {$this->tableName} WHERE id = :id";
        $params = ['id' => $id];
        return $this->executeQuery($query, $params);
    }

    public function create(array $data)
    {
        $columns = implode(',', array_keys($data));
        $placeholders = ':' . implode(',:', array_keys($data));

        $query = "INSERT INTO {$this->tableName} ($columns) VALUES ($placeholders)";
        $this->executeQuery($query, $data);

        return $this->db->lastInsertId();
    }

    public function update($id, array $data)
    {
        $assignments = implode(', ', array_map(fn($key) => "$key = :$key", array_keys($data)));

        $query = "UPDATE {$this->tableName} SET $assignments WHERE id = :id";
        $params = array_merge($data, [':id' => $id]);

        return $this->executeQuery($query, $params);
    }

    public function findByEmail($email)
    {
        $query = "SELECT * FROM {$this->tableName} WHERE email = :email";
        $params = [':email' => $email];
        return $this->executeQuery($query, $params);
    }
}
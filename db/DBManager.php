<?php 
require_once __DIR__ . '/../utils/Env.php';

class DBManager {
    private $pdo;

    public function __construct()
    {
        $host = Env::get('DB_HOST');
        $db = Env::get('DB_DATABASE');
        $user = Env::get('DB_USERNAME');
        $password = Env::get('DB_PASSWORD');
        
        try {
            $dsn = "mysql:host=$host;dbname=$db;charset=utf8";
            $this->pdo = new PDO($dsn, $user, $password);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die("Connection failed: " . $e->getMessage());
        }
    }

    public function getConnection()
    {
        return $this->pdo;
    }

    public function closeConnection()
    {
        $this->pdo = null;
    }
}
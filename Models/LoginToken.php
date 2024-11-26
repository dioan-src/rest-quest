<?php
require_once __DIR__ . '/Model.php';
require_once __DIR__ . '/../utils/TimeUtils.php';

class LoginToken extends Model
{
    protected $tableName = 'login_tokens';

    public function __construct()
    {
        parent::__construct();
    }

    public function getActiveLoginToken(int $user_id)
    {
        $query = "SELECT * FROM {$this->tableName} 
                WHERE user_id = :user_id 
                AND valid = :valid 
                AND timestamp >= :last_half_hour";
        $params = ['user_id' => $user_id, "valid" => 1, "last_half_hour" => TimeUtils::getTimestampWithInterval('-30 minutes')];
        $results = $this->executeQuery($query, $params);
        
        return ($results) ? current($results) : null;
    }

    public function invalidateToken(int $user_id)
    {
        $data = ['valid'=>0];
        $assignments = implode(', ', array_map(fn($key) => "$key = :$key", array_keys($data)));
        
        $query = "UPDATE {$this->tableName} SET $assignments WHERE user_id = :user_id";
        $params = array_merge($data, [':user_id' => $user_id]);
        
        return $this->executeQuery($query, $params);
        
    }
}
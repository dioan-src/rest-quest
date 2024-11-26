<?php
require_once __DIR__ . '/Model.php';

class Login extends Model
{
    protected $tableName = 'logins';

    public function __construct()
    {
        parent::__construct();
    }
}
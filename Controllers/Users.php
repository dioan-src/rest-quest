<?php
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../Models/User.php';

class Users
{
    public static function show()
    {
        try{
            $users = (new User())->findAll();
            Response::sendResponse((array) $users, "", true, 200);
        } catch (Exception $e){
            Response::sendResponse([], "Something went Wrong", false, 500);
        }
    }
    
    public static function store()
    {

    }

    public static function edit()
    {
        
    }

    public static function destroy()
    {
        
    }
}
<?php
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../Models/User.php';
require_once __DIR__ . '/../Models/Request.php';

class Users
{
    const MANAGER_ROLE=1;
    const EMPLOYEE_ROLE=2;
    
    public static function show()
    {
        $users = (new User())->findAll();
        Response::sendSuccess((array) $users, "");
    }
    
    public static function store(array $data)
    {
        $user_id = (new User())->create($data);
        
        Response::sendResponse([], "User created successfully", true, 200);
    }

    public static function edit(int $id, array $data)
    {
        (new User())->update($id, $data);
        
        Response::sendResponse([], "User edited successfully", true, 200);
    }

    public static function destroy(int $id)
    {
        (new User())->delete($id);
        Response::sendResponse([], "User deleted successfully", true, 200);
    }

    public static function showManagers()
    {
        $users = (new User())->findByRole(self::MANAGER_ROLE);
        Response::sendSuccess((array) $users, "");
    }

    public static function showEmployees()
    {
        $users = (new User())->findByRole(self::EMPLOYEE_ROLE);
        Response::sendSuccess((array) $users, "");
    }

    public static function storeManagers(array $data)
    {
        //add manager role before user creation
        $data = array_merge($data, ['role_id' => self::MANAGER_ROLE]);
        $user_id = (new User())->create($data);
        
        Response::sendResponse([], "Manager created successfully", true, 200);
    }

    public static function storeEmployees(array $data)
    {
        //add employer role before user creation
        $data = array_merge($data, ['role_id' => self::EMPLOYEE_ROLE]);
        $user_id = (new User())->create($data);
        
        Response::sendResponse([], "Manager created successfully", true, 200);
    }

    public static function showUserRequests(int $id)
    {
        try{
            $request = (new Request())->findByUser($id);
            Response::sendResponse((array) $request, "", true, 200);
        } catch (Exception $e){
            Response::sendResponse([], "Something went Wrong", false, 500);
        }
    }
}
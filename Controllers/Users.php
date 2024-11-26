<?php
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../Models/User.php';
require_once __DIR__ . '/../Models/Request.php';
require_once __DIR__ . '/../Models/Login.php';
require_once __DIR__ . '/../Models/LoginToken.php';
require_once __DIR__ . '/../utils/TimeUtils.php';

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

    public static function login(array $data)
    {
        $username = $data['username'];
        $password = $data['password'];

        $userToLogin = (new User())->findByUsername($username);

        if (empty($userToLogin)) Response::sendResponse([], "Account doesn't exist", false, 400);

        if ($userToLogin->password !== $password) Response::sendResponse([], "Credentials don't match", false, 400);
        
        //log loggin
        $loginId = (new Login())->create( ["user_id" => $userToLogin->id, "timestamp" => TimeUtils::getCurrentTimestamp()] );

        //create login token
        $loginTokenRepo = new LoginToken();
        //check if user has logged in, in the last hour
        $logintoken = $loginTokenRepo->getActiveLoginToken($userToLogin->id);
        //if not - create one
        if (empty($logintoken)) {
            $loginTokenId = $loginTokenRepo->create( ["token" => substr(uniqid(), 0, 10), "user_id" => $userToLogin->id, "timestamp" => TimeUtils::getCurrentTimestamp()] );
            //fetch it
            $logintoken = $loginTokenRepo->find($loginTokenId);
        }
        
        Response::sendResponse([
            "username" => $userToLogin->username,
            "email" => $userToLogin->email,
            "role_id" => $userToLogin->role_id,
            "role" => ($userToLogin->role_id === 1) ? 'Manager' : 'Employer',
            "login_token" => $logintoken->token,
        ], "Login successful", true, 200);
    }

    public static function logout(array $data)
    {
        (new LoginToken())->invalidateToken($data['user_id']);
        Response::sendResponse([], "User logged out successfully", true, 200);
    }
}
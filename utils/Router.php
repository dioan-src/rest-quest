<?php
require_once __DIR__ . '/Response.php';

class Router {

    CONST ROUTES = [
        'Users' => [
            'POST' => 'store',
            'POST|managers' => 'storeManagers',
            'POST|employees' => 'storeEmployees',
            'POST|login' => 'login',
            'POST|logout' => 'logout',
            'GET|{id}' => 'showSingle',
            'GET' => 'show',
            'GET|managers' => 'showManagers',
            'GET|employees' => 'showEmployees',
            'PUT|{id}' => 'edit',
            'DELETE|{id}' => 'destroy',
            'GET|{id}|requests' => 'showUserRequests',
        ],
        'Requests' => [
            'POST' => 'store',
            'GET' => 'show',
            'PUT|{id}' => 'edit',
            'DELETE|{id}' => 'destroy',
        ]
    ];
    public static function getControllerFunction($controller, $method, $suffix1, $suffix2){
        //build key to find correct route
        $key = $method;
        if ($suffix1) $key .= is_numeric($suffix1) ? '|{id}' : '|' . $suffix1;
        if ($suffix2) $key .= ($suffix2) ? '|' . $suffix2 : '';
        
        return self::ROUTES[$controller][$key] ?? null;
    }

    public static function guide($requestMethod, $controller, $suffix1, $suffix2){
        if (empty($controller)) {
            Response::sendBadRequest([], 'Wrongly Formed Request');
        }
        
        $controllerPath = __DIR__ . '/../Controllers/' . $controller . '.php';
        if (!file_exists($controllerPath)) {
            Response::sendBadRequest([], 'Wrongly Formed Request');
        }
        
        require_once $controllerPath;
        
        $controllerClass = $controller;
        if (!class_exists($controllerClass)) {
            Response::sendBadRequest([], 'Wrongly Formed Request');
        }
        
        $functionName = self::getControllerFunction($controller, $requestMethod, $suffix1, $suffix2);
        if (empty($functionName)) Response::sendBadRequest([], 'Wrongly Formed Request');
        if (!method_exists($controllerClass, $functionName)) {
            Response::sendBadRequest([], 'Wrongly Formed Request');
        }
        
        //send to controller function,  along with params when needed
        if ($requestMethod === 'GET'){
            if(is_numeric($suffix1)) $controllerClass::$functionName((int)$suffix1);
            $controllerClass::$functionName();
        }
        if ($requestMethod === 'POST'){
            $data = json_decode(file_get_contents("php://input"), true);
            $controllerClass::$functionName($data);
        }
        if ($requestMethod === 'PUT'){
            $data = json_decode(file_get_contents("php://input"), true);
            if(!is_numeric($suffix1)) Response::sendBadRequest([], 'Wrongly Formed Request');
            $controllerClass::$functionName((int)$suffix1, $data);
        }
        if ($requestMethod === 'DELETE'){
            if(!is_numeric($suffix1)) Response::sendBadRequest([], 'Wrongly Formed Request');
            $controllerClass::$functionName((int)$suffix1);
        }
        
        Response::sendBadRequest([], 'Wrongly Formed Request');
    }
}
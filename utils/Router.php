<?php
require_once __DIR__ . '/Response.php';

class Router {

    CONST ROUTES = [
        'Users' => [
            'POST' => 'store',
            'GET' => 'show',
            'PUT' => 'edit',
            'DELETE' => 'destroy',
        ]
    ];
    public static function getControllerFunction($controller, $method){
        return self::ROUTES[$controller][$method] ?? null;
    }

    public static function guide($requestMethod, $controller, $id){
        if (empty($controller)) {
            Response::sendResponse([], 'Wrongly Formed Request', false, 400);
        }
        
        $controllerPath = __DIR__ . '/../Controllers/' . $controller . '.php';
        if (!file_exists($controllerPath)) {
            Response::sendResponse([], "Controller '$controller' not found", false, 404);
        }
        
        require_once $controllerPath;
        
        $controllerClass = $controller;
        if (!class_exists($controllerClass)) {
            Response::sendResponse([], "Controller class '$controllerClass' not found", false, 404);
        }
        
        $functionName = self::getControllerFunction($controller, $requestMethod);
        if (!method_exists($controllerClass, $functionName)) {
            Response::sendResponse([], "Action '$action' not found in '$controllerClass'", false, 404);
        }

        //send to function
        $controllerClass::$functionName();
    }
}
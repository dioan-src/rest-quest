<?php
require_once __DIR__ . '/../utils/Router.php';
require_once __DIR__ . '/../utils/Response.php';


// Get the request path
$requestMethod = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];

// Strip the "/api/" prefix to identify the specific endpoint
$path = str_replace('/api/', '', parse_url($requestUri, PHP_URL_PATH));
$segments = explode('/', $path);

$controller = ucfirst($segments[0]) ?? null;
$suffix1 = $segments[1] ?? null;
$suffix2 = $segments[2] ?? null;

try {
    Router::guide($requestMethod, $controller, $suffix1, $suffix2);
} catch (Exception $e) {
    Response::sendInternalServerError();
}
<?php
class Response {

    public static function sendResponse($content, $message, $success, $httpCode){
        http_response_code($httpCode);
        $response = [
            'success' => $success,
            'message' => $message,
            'content' => $content,
        ];
        echo json_encode($response);
        die();
    }
}
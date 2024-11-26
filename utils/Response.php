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

    public static function sendSuccess($content, $message){
        self::sendResponse($content, $message, true, 200);
    }

    public static function sendBadRequest($content, $message){
        self::sendResponse($content, $message, false, 400);
    }

    public static function sendInternalServerError(){
        self::sendResponse([], 'Something went wrong', false, 500);
    }
}
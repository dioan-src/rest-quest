<?php
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../Models/Request.php';

class Requests
{
    const PENDING_STATUS = 1;
    const ACCEPTED_STATUS = 2;
    const REJECTED_STATUS = 3;

    public static function show()
    {
        $users = (new Request())->findAll();
        Response::sendSuccess((array) $users, "");
    }

    
    public static function store(array $data)
    {
        $data = array_merge($data, ['status_id' => self::PENDING_STATUS]);
        $request_id = (new Request())->create($data);
        
        Response::sendResponse([], "Request created successfully", true, 200);
    }

    public static function edit(int $id, array $data)
    {
        (new Request())->update($id, $data);
        
        Response::sendResponse([], "Request edited successfully", true, 200);
    }

    public static function destroy(int $id)
    {
        (new Request())->delete($id);
        Response::sendResponse([], "Request deleted successfully", true, 200);
    }
}
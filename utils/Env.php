<?php


class Env {
    private static $envFilePath = __DIR__ . '/../.env';

    public static function get($key, $default =null)
    {
        $envParameters = self::loadEnvFile(self::$envFilePath);
        
        return $envParameters[$key] ?? null;
    }

    public static function loadEnvFile($filePath)
    {
        if (!file_exists($filePath)) {
            throw new Exception("Environment file not found: " . self::$envFilePath);        
        }   
        
        $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $envParameters = [];
        
        foreach($lines as $line){
            //skips comments
            if (strpos(trim($line), '#') === 0) {
                continue;
            }

            
            [$key, $value] = explode('=', $line, 2);

            $key = trim($key);
            $value = trim($value);
            $value = trim($value, '"\'');

            $envParameters[$key] = $value;
        }

        return $envParameters;
    }
}
<?php
class TimeUtils {

    public static function getCurrentTimestamp(): string{
        $timezone = new DateTimeZone('Europe/Athens');
        // Create a DateTime object with the current time in the Athens timezone
        $dateTime = new DateTime('now', $timezone);
        // Format the timestamp as a string
        return $dateTime->format('Y-m-d H:i:s');
    }

    public static function getTimestampWithInterval(string $interval){
        $currentTimestamp = self::getCurrentTimestamp();

        // Create a DateTime object from the current timestamp
        $timezone = new DateTimeZone('Europe/Athens');
        $dateTime = new DateTime($currentTimestamp, $timezone);

        // Apply the interval
        $dateTime->modify($interval);

        // Return the new timestamp
        return $dateTime->format('Y-m-d H:i:s');
    }
}
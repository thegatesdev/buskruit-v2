<?php

$conn = false;

// Initialize database login settings
define("DB_SETTINGS", gdb_settings_login("user","name", "pwd_hash"));

// Try to connect
try{
    $conn = mysqli_connect("localhost", "root", "", "buskruit");
    mysqli_set_charset($conn, 'utf8');
}catch(Exception $e){
}

function disconnect(){
    global $conn;
    if ($conn) mysqli_close($conn);
}
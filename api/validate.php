<?php

function errorJson($title, $message){
    return json_encode(["err" => ["title" => $title, "msg" => $message]]);
}

session_start();

// Get user input
$input_json = json_decode(file_get_contents('php://input'), true);
$inp_name = $input_json['username'] ?? null;
$inp_pwd = $input_json['password'] ?? null;
// Validate user input
if (!isset($inp_name, $inp_pwd)){
    echo errorJson("Onvoldoende velden ingevuld", "Vul gebruikersnaam en wachtwoord in!");
    exit;
}

// Database connection
include_once("../lib/gdb.php");
include_once("../lib/login_settings.php");
include_once("../lib/db.php");
if (!$conn){
    echo errorJson("Geen verbinding", "Kon geen verbinding maken met de database!");
    exit;
}

// Validate user
$valid_user_id = gdb_validate($conn, DB_SETTINGS, $inp_name, $inp_pwd);
disconnect();

if ($valid_user_id === false){
    echo errorJson("Onjuiste gegevens", "De gebruikersnaam of het wachtwoord zijn incorrect!");
    session_destroy();
    session_unset();
    exit;
}

// Start user session
$_SESSION['user'] = $valid_user_id;
echo "{}";
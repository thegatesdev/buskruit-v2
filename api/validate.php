<?php

session_start();

include_once("lib/json_api.php");

// Get user input
$input_json = json_decode(file_get_contents('php://input'), true);
$inp_name = $input_json['username'] ?? null;
$inp_pwd = $input_json['password'] ?? null;
// Validate user input
if (!isset($inp_name, $inp_pwd)) jsonExitError("Onvoldoende velden ingevuld", "Vul gebruikersnaam en wachtwoord in!");

// Database connection
include_once("../lib/gdb.php");
include_once("../lib/login_settings.php");
include_once("../lib/db.php");
if (!$conn) jsonExitError("Geen verbinding", "Kon geen verbinding maken met de database!");

// Validate user
$valid_user_id = gdb_validate($conn, $dbsettings, $inp_name, $inp_pwd);
disconnect();

if ($valid_user_id === false){
    session_destroy();
    session_unset();
    jsonExitError("Onjuiste gegevens", "De gebruikersnaam of het wachtwoord zijn incorrect!");
}

// Start user session
$_SESSION['user'] = $valid_user_id;
jsonExitOk();
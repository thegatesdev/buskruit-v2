<?php

function errorJson($title, $message){
    return json_encode(["err" => ["title" => $title, "msg" => $message]]);
}

$input_json = json_decode(file_get_contents('php://input'), true);

$inp_name = $input_json['username'] ?? null;
$inp_pwd = $input_json['password'] ?? null;

if (!isset($inp_name, $inp_pwd)){
    echo errorJson("Onvoldoende velden ingevuld", "Vul gebruikersnaam en wachtwoord in!");
    exit(200);
}

include_once("../lib/gdb.php");
include_once("../lib/db.php");


if (!$conn){
    echo errorJson("Geen verbinding", "Kon geen verbinding maken met de database!");
    exit;
}

$validation = gdb_validate($conn, DB_SETTINGS, $inp_name, $inp_pwd);
if ($validation === false){
    echo errorJson("Onjuiste gegevens", "De gebruikersnaam of het wachtwoord zijn incorrect");
}else{
    // TODO Get user type and redirect
}

disconnect();
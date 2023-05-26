<?php

function errorJson($title, $message){
    return json_encode(["err" => ["title" => $title, "msg" => $message]]);
}

$input_json = json_decode(file_get_contents('php://input'), true);

$inp_name = $input_json['username'] ?? null;
$inp_pwd = $input_json['password'] ?? null;

if (!isset($inp_name, $inp_pwd)){
    echo errorJson("Onvoldoende velden ingevuld", "Vul gebruikersnaam en wachtwoord in!");
    exit;
}

include_once("../lib/gdb.php");
include_once("../lib/db.php");


if (!$conn){
    echo errorJson("Geen verbinding", "Kon geen verbinding maken met de database!");
    exit;
}

$valid_user_id = gdb_validate($conn, DB_SETTINGS, $inp_name, $inp_pwd);

if ($valid_user_id === false){
    echo errorJson("Onjuiste gegevens", "De gebruikersnaam of het wachtwoord zijn incorrect!");
}else{
    $page = get_user_page($conn, $valid_user_id);
    if (!$page) echo errorJson("Geen landings-pagina", "Dit gebruiker type heeft geen landings-pagina!");
    else echo json_encode(["redirect" => "pages/" . $page . ".php"]);
}

disconnect();
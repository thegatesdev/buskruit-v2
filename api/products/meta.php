<?php

session_start();
include_once("../lib/json_api.php");

// Not logged in, error!
if (!isset($_SESSION['user'])) jsonExitError("No session");

// Database connection
include_once("../../lib/gdb.php");
include_once("../../lib/login_settings.php");
include_once("../../lib/db.php");
if (!$conn) jsonExitError("Geen verbinding", "Kon geen verbinding maken met de database!");

// Get user input
$input_json = json_decode(file_get_contents('php://input'), true);


if (!isset($input_json['type'])) jsonExitError("No meta type");

switch(strtolower($input_json['type'])){
    case "getproduct":
        getProductData($conn, $input_json);
        break;
    case "getindexes":
        getIndexData($conn, $input_json);
        break;
    default:
        jsonExitError("Unknown meta type");
        break;
}
// This happens when the case doesn't call exit().
jsonExitError("Could not handle your request");

function getProductData($conn, $data){
    $result = mysqli_query($conn, "SELECT product_num, description, unit, price, storage FROM product WHERE product_num={$data['product_id']} LIMIT 1");
    if (mysqli_num_rows($result) != 1) jsonExitError("Product niet gevonden", "Dit product was niet gevonden!");

    $data = mysqli_fetch_assoc($result);
    jsonExitOk([
        "id" => $data['product_num'],
        "description" => $data['description'],
        "unit" => $data['unit'],
        "price" => $data['price'],
        "storage" => $data['storage'],
    ]);
}

function getIndexData($conn, $data){
    $result = mysqli_query($conn, "SELECT product_num FROM product");
    $ids = array();
    while ($row = mysqli_fetch_array($result, MYSQLI_NUM)){
        $ids[] = $row[0];
    }
    jsonExitOk([
        "product_ids" => $ids,
    ]);
}
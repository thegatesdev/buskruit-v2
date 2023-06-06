<?php

session_start();

include_once("../lib/json_api.php");

if (!isset($_SESSION['user'])) jsonExitError("No session", "No active session");

// Get user input
$input_json = json_decode(file_get_contents('php://input'), true);
$inp_product_id = $input_json['product_id'] ?? null;

if (!isset($inp_product_id)) jsonExitError("No product", "No product");
$inp_product_id = (int)$inp_product_id;

// Database connection
include_once("../../lib/db.php");
if (!$conn)
jsonExitError("Geen verbinding", "Kon geen verbinding maken met de database!");

$result = mysqli_query($conn, "SELECT product_num, description, unit, price, storage FROM buskruit.product WHERE product_num=$inp_product_id LIMIT 1");
if (mysqli_num_rows($result) != 1) 
jsonExitError("Product niet gevonden", "Dit product was niet gevonden!");

$data = mysqli_fetch_assoc($result);
jsonExitOk([
    "description" => $data['description'],
    "unit" => $data['unit'],
    "price" => $data['price'],
    "storage" => $data['storage'],
    "id" => $data['product_num']
]);
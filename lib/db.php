<?php

$conn = false;

// Try to connect
try{
    $conn = mysqli_connect("localhost", "d71414_root", "A4S4h0CtbFcoNU8r", "d71414_buskruit");
    mysqli_set_charset($conn, 'utf8');
}catch(Exception $e){
}

function disconnect(){
    global $conn;
    if ($conn) mysqli_close($conn);
}

function get_user_page(mysqli $conn, int $userid){
    $page_result = mysqli_query($conn, "SELECT page FROM type_from_user WHERE user_id=$userid");
    if (!$page_result || mysqli_num_rows($page_result) != 1) return false;
    return mysqli_fetch_array($page_result, MYSQLI_NUM)[0];
}
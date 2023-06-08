<?php

session_start();

// Redirect if not logged in
if (!isset($_SESSION['user'])){
    header("Location:login.php");
    exit;
}

include_once("lib/gdb.php");
include_once("lib/login_settings.php");
include_once("lib/db.php");

if ($conn){
    $userpage = get_user_page($conn, $_SESSION['user']);
    if (!$userpage) $userpage = "nopage";

    header("Location:pages/$userpage.php");
    exit;
}

$page_title = "Doorsturen...";
$page_message = "Kon geen verbinding maken met de database!";
include_once("parts/message.php");

session_destroy();
session_unset();
?>
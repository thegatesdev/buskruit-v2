<?php
session_start();

// Redirect if not logged in
if (!isset($_SESSION['user'])){
    header("Location:login.php");
    exit;
}

$page_title = "Kassa";
$relative_path = "..";
$page_css = array("checkout");
$page_js = array("checkout/checkout", "checkout/numpad");
include_once("../parts/open.php");
?>
<body>
    
</body>
</html>
<?php
session_start();

// Redirect if already logged in
if (isset($_SESSION['user'])){
    header("Location:redirect.php");
    exit;
}

$page_title = "Inloggen";
$page_css = array("login");
$page_js = array("popup", "login");
include_once("./parts/open.php"); 
?>
<body>
    <div class="flex-center">
        <div id="login-form" class="noselect">
            <h3 id="login-title">Inloggen</h3>

            <input class="text-input" type="text" id="inp-username" size='18' placeholder="Gebruikersnaam">
            <input class="text-input" type="text" id="inp-password" size='18' placeholder="Wachtwoord">

            <input id="login-button" type="submit" onclick="onLoginSubmit()" value="Inloggen" class="button-big">
        </div>
        <div id="page-popup" onclick="hidePopup()">
            <h2 class="title"></h2>
            <p class="body"></p>
        </div>
    </div>
</body>
</html>
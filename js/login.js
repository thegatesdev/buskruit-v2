const usernameField = document.getElementById("inp-username");
const passwordField = document.getElementById("inp-password");

const loginMessageDiv = document.getElementById("login-message");
const messageTitleField = document.getElementById("login-message-title");
const messageTextField = document.getElementById("login-message-text");

hideErrorMessage();

// Login

function onLoginSubmit(){
    tryLogin(usernameField.value, passwordField.value);
}

async function tryLogin(username, password){
    if (isEmptyField(username) || isEmptyField(password)){
        displayErrorMessage("Onvoldoende velden ingevuld", "Vul gebruikersnaam en wachtwoord in!")
        return;
    }
    const response = await fetchValidation(username, password);
    const jsonData = await response.json();

    if (!jsonData.ok){
        displayErrorMessage("Inloggen mislukt", jsonData.error);
        return;
    }
    
    window.location.replace("redirect.php")
}

function fetchValidation(username, password){
    return fetch("./api/validate.php", {
        method: "POST",
        mode: 'cors',
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({
            password: password,
            username: username,
        }),
    });
}

// Message

let hideMessageTimeoutId;

function displayErrorMessage(title, message, time = 4000){
    // Remove previous hide message timout
    if (hideMessageTimeoutId != null) clearTimeout(hideMessageTimeoutId);

    // Set message display
    messageTitleField.textContent = title;
    messageTextField.textContent = message;
    loginMessageDiv.style.transform = "scale(1)";

    // Hide after timeout
    hideMessageTimeoutId = setTimeout(hideErrorMessage, time);
}

function hideErrorMessage(){
    loginMessageDiv.style.transform = "scale(0)";
}

// Util

function isEmptyField(input){
    return !input || !input.trim().length;
}
const usernameField = document.getElementById("inp-username");
const passwordField = document.getElementById("inp-password");

// Login

function onLoginSubmit(){
    tryLogin(usernameField.value, passwordField.value);
}

async function tryLogin(username, password){
    if (isEmptyField(username) || isEmptyField(password)){
        popup("Onvoldoende velden ingevuld", "Vul gebruikersnaam en wachtwoord in!")
        return;
    }
    const response = await fetchValidation(username, password);
    const jsonData = await response.json();

    if (!jsonData.ok){
        popup("Inloggen mislukt", jsonData.error);
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

// Util

function isEmptyField(input){
    return !input || !input.trim().length;
}
const calcDisplay = document.getElementById("calc-input");
const keyPadKeys = document.getElementsByClassName("keybutton");

for (const key of keyPadKeys) key.onclick = function(){onKeyPadPress(key)}
calcDisplay.value = "";

// Currently inputted number value
let currentInput = 0;
let prefix = null;

function onKeyPadPress(key){
    let input = getCurrentInput();
    
    if (isNaN(key.textContent)) handleSpecialKey(key.textContent);
    else{
        const keynum = parseInt(key.textContent);
        
        input *= 10
        input += keynum;
        updateInput(input);
    }
}

function getCurrentInput(){
    return currentInput;
}

function updateInput(value = null){
    currentInput = value ?? "";
    calcDisplay.value = (prefix ?? "") + currentInput;
}

function setInputPrefix(newPrefix = null){
    prefix = newPrefix;
}

function handleSpecialKey(value){
    switch(value){
        case "c", "C":
            updateInput(null);
            break;
        case "<":
            updateInput(Math.trunc(getCurrentInput() * 0.1));
            break;
    }
}
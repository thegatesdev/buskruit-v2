const calcDisplay = document.getElementById("calc-input");
const keyPadKeys = document.getElementsByClassName("keybutton");

for (const key of keyPadKeys) key.onclick = function(){onKeyPadPress(key)}
calcDisplay.innerHTML = "0";

// Currently inputted number value
let currentInput = 0;

function onKeyPadPress(key){
    // Reset after manual input
    if (calcDisplay.value != currentInput){
        if (isNaN(calcDisplay.value)) currentInput = 0;
        else currentInput = parseInt(calcDisplay.value)
    }
    
    if (isNaN(key.textContent)) handleSpecialKey(key.textContent);
    else{
        const keynum = parseInt(key.textContent);
        
        currentInput *= 10
        currentInput += keynum;
    }
    updateInput();
}

function updateInput(value = currentInput){
    currentInput = value;
    calcDisplay.value = currentInput;
}

function handleSpecialKey(value){
    switch(value){
        case "c", "C":
            currentInput = 0;
            break;
        case "<":
            currentInput = Math.trunc(currentInput * 0.1);
            break;
    }
}
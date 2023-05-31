const calcDisplay = document.getElementById("calc-input");
const keyPadKeys = document.getElementsByClassName("keybutton");

for (const key of keyPadKeys) key.onclick = function(){onKeyPadPress(key)}
calcDisplay.innerHTML = "0";

// Currently inputted number value
let currentInput = 0;

function onKeyPadPress(key){
    if (isNaN(key.innerHTML)) handleSpecialKey(key.innerHTML);
    else{
        const keynum = parseInt(key.innerHTML);
        // Reset after manual input
        if (calcDisplay.value != currentInput){
            if (isNaN(calcDisplay.value)) currentInput = 0;
            else currentInput = parseInt(calcDisplay.value)
        }
        
        currentInput *= 10
        currentInput += keynum;
    }
    calcDisplay.value = currentInput;
}

function handleSpecialKey(value){
    switch(value){
        case "c", "C":
            currentInput = 0;
            break;
    }
}
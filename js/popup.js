const popupElement = document.getElementById("page-popup");
const popupTitle = popupElement.getElementsByClassName("title")[0];
const popupBody = popupElement.getElementsByClassName("body")[0];

let activePopups = [];
let popupActive = false;

function popup(title, body, time=6000){
    activePopups.push({
        title: title,
        body: body,
        time: time,
    });
    nextPopup();
}

function nextPopup(){
    if (popupActive) return;
    const active = activePopups.pop();
    if (active === undefined) return;
    popupActive = true;

    popupTitle.innerText = active.title;
    popupBody.innerText = active.body;

    showPopup();

    setTimeout(onPopupTimeout, active.time);
}

function onPopupTimeout(){
    hidePopup();
    popupActive = false;
    nextPopup();
}

function showPopup(){
    popupElement.classList.add("show");
}

function hidePopup(){
    popupElement.classList.remove("show");
}
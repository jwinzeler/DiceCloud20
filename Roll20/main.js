let chatElements = getChatElements();

function getChatElements() {
    return document.getElementById("textchat-input");
}

function sendChatMessage(message) {
    if (!chatElements) {
        chatElements = getChatElements();
    }

    if (chatElements) {
        chatElements.querySelector("textarea").value = message;
        chatElements.querySelector("button").click();
    } else {
        alert("Could not send message, please refresh");
        console.error('Chat elements not found');
    }
}

chrome.runtime.sendMessage("init");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch(request) {
        case "ready":
            console.log("DiceCloud20 Ready");
            break;
        default:
            sendChatMessage(request);
            break;
    }
});
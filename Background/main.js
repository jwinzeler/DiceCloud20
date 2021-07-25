let diceCloud;
let roll20;
let monsterMaker;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request === "init") {
        if (sender.origin === "https://dicecloud.com") {
            console.log("DiceCloud initiated");
            diceCloud = sender;
            chrome.tabs.sendMessage(diceCloud.tab.id, "ready");
        } else if (sender.origin === "https://app.roll20.net") {
            console.log("Roll20 initiated");
            roll20 = sender;
        } else if (sender.origin === "https://giffyglyph.com") {
            console.log("MonsterMaker initiated");
            monsterMaker = sender;
            chrome.tabs.sendMessage(monsterMaker.tab.id, "ready");
        }
    } else {
        if (sender.origin === "https://dicecloud.com") {
            if (roll20) {
                console.log("Sending Message to Roll20", request, sendResponse);
                chrome.tabs.sendMessage(roll20.tab.id, request);
            } else {
                console.warn("Attempted to send Message to Roll20 but it hasn't been initated.", request, sendResponse);
                chrome.tabs.sendMessage(diceCloud.tab.id, "noRoll20");
            }
        } else if (sender.origin === "https://giffyglyph.com") {
            if (roll20) {
                console.log("Sending Message to Roll20", request, sendResponse);
                chrome.tabs.sendMessage(roll20.tab.id, request);
            } else {
                console.warn("Attempted to send Message to Roll20 but it hasn't been initated.", request, sendResponse);
                chrome.tabs.sendMessage(monsterMaker.tab.id, "noRoll20");
            }
        } else if (sender.origin === "https://app.roll20.net") {
            if (dicecloud) {
                console.log("Sending Message to DiceCloud", request, sendResponse);
                chrome.tabs.sendMessage(dicecloud.tab.id, request);
            } else {
                console.warn("Attempted to send Message to DiceCloud but it hasn't been initated.", request, sendResponse);
            }
        }
    }
});
class Messager {
    diceCloud;
    roll20;
    monsterMaker;

    init() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request === "init") {
                if (sender.origin === "https://dicecloud.com") {
                    console.log("DiceCloud initiated");
                    this.diceCloud = sender;
                    chrome.tabs.sendMessage(this.diceCloud.tab.id, "ready");
                } else if (sender.origin === "https://app.roll20.net") {
                    console.log("Roll20 initiated");
                    this.roll20 = sender;
                } else if (sender.origin === "https://giffyglyph.com") {
                    console.log("MonsterMaker initiated");
                    this.monsterMaker = sender;
                    chrome.tabs.sendMessage(this.monsterMaker.tab.id, "ready");
                }
            } else {
                if (sender.origin === "https://dicecloud.com") {
                    if (this.roll20) {
                        console.log("Sending Message to Roll20", request, sendResponse);
                        chrome.tabs.sendMessage(this.roll20.tab.id, request);
                    } else {
                        console.warn("Attempted to send Message to Roll20 but it hasn't been initated.", request, sendResponse);
                        chrome.tabs.sendMessage(diceCloud.tab.id, "noRoll20");
                    }
                } else if (sender.origin === "https://giffyglyph.com") {
                    if (this.roll20) {
                        const template = TemplateStringBuilder.getTemplate(request);
                        console.log("Sending Message to Roll20", request, sendResponse, template);
                        chrome.tabs.sendMessage(this.roll20.tab.id, template);
                    } else {
                        console.warn("Attempted to send Message to Roll20 but it hasn't been initated.", request, sendResponse);
                        chrome.tabs.sendMessage(this.monsterMaker.tab.id, "noRoll20");
                    }
                } else if (sender.origin === "https://app.roll20.net") {
                    if (this.dicecloud) {
                        console.log("Sending Message to DiceCloud", request, sendResponse);
                        chrome.tabs.sendMessage(this.dicecloud.tab.id, request);
                    } else {
                        console.warn("Attempted to send Message to DiceCloud but it hasn't been initated.", request, sendResponse);
                    }
                }
            }
        });
    }
}

const rollTypes = {
    SIMPLE: 1,
    INFO: 2,
    ATTACK: 3,
}

const states = {
    NORMAL: 1,
    ADVANTAGE: 2,
    DISADVANTAGE: 3,
}
let rollState = states.NORMAL;
let gmRoll = false;
let menu;

const ElementType = {
    ABILITY: {
        parent: ".monster-abilities",
        childSelector: ".monster-ability",
        selector: 'dc20-ability',
    },
    SAVE: {
        parent: ".monster-saves p",
        childSelector: "span:last-child",
        selector: 'dc20-save',
    },
    SKILL: {
        parent: ".monster-skills p",
        childSelector: "span:last-child",
        selector: 'dc20-skill',
    },
    /*TRAIT: {
        parent: ".monster-trait",
        childSelector: "p",
        selector: 'dc20-trait',
    },*/
    ACTION: {
        parent: ".monster-action",
        childSelector: "p",
        selector: "dc20-action",
    }
}

function sendRoll(title, description, type, attackMod = null, attackDice = null, attackDamage = null, attackDamageType = null, saveDC = null, saveAbility = null, saveSuccess = null, saveFailure = null, saveFailureDice = null, saveFailureDamage = null, saveFailureDamageType = null, healDice = null, healDamage = null) {
    let diceRoll = '1d20';
    let advantage = '';
    if (rollState == states.ADVANTAGE) {
        diceRoll = '2d20kh1';
        advantage = '{{2d20kh1=1}}'
    } else if (rollState == states.DISADVANTAGE) {
        diceRoll = '2d20kl1';
        advantage = '{{2d20kl1=1}}'
    }

    let message = '';

    if (gmRoll) {
        message += '/w gm ';
    }

    switch (type) {
        case rollTypes.SIMPLE:
            message += `&{template:5e-shaped} {{title=${title}}} ${advantage} {{roll1=[[${diceRoll}${attackMod}]]}}`;
            break;
        case rollTypes.INFO: 
            message += `&{template:5e-shaped} {{title=${title}}} ${advantage} {{subheader=${description}}}`;
            break;
        case rollTypes.ATTACK:
            let attack = '';
            if (attackMod) {
                attack += `{{attack1=[[${diceRoll}${attackMod}]]}} `;
            }
            if (attackDice) {
                if (attackDamage) {
                    attack += `{{attack_damage=[[${attackDice}${attackDamage}]]}} {{attack_damage_crit=[[${attackDice}]]}} {{has_attack_damage=1}} `;
                } else {
                    attack += `{{attack_damage=[[${attackDice}]]}} {{attack_damage_crit=[[${attackDice}]]}} {{has_attack_damage=1}} `;
                }
            }
            if (attackDamageType) {
                attack += `{{attack_damage_type=${attackDamageType}}} `;
            }

            let save = '';
            if (saveDC) {
                save += `{{saving_throw_dc=${saveDC}}} `;
            }
            if (saveAbility) {
                save += `{{saving_throw_vs_ability=${saveAbility.toUpperCase()}}} `
            }
            if (saveFailure) {
                if (saveFailureDice) {
                    save += `{{has_saving_throw_damage=1}} `
                    if (saveFailureDamage) {
                        save += `{{saving_throw_damage=[[${saveFailureDice}${saveFailureDamage}]]}} `;
                    } else {
                        save += `{{saving_throw_damage=[[${saveFailureDice}]]}} `;
                    }
                } else {
                    // save += `{{saving_throw_failure=${saveFailure}}}`
                }
                if (saveFailureDamageType) {
                    save += `{{saving_throw_damage_type=${saveFailureDamageType}}} `;
                }
            }
            if (saveSuccess) {
                save += `{{saving_throw_success=${saveSuccess}}} `;
            }

            let heal = '';
            if (healDice) {
                if (healDamage) {
                    heal += `{{heal=[[${healDice}${healDamage}]]}} `;
                } else {
                    heal += `{{heal=[[${healDice}]]}} `;
                }
            }
            message += `&{template:5e-shaped} {{title=${title}}} ${advantage} {{subheader=${description}}} ${attack} ${save} ${heal}`;
            break;
    }

    chrome.runtime.sendMessage(message)
}

function createButtons(elementType, key, element) {
    const newElement = document.createElement('div');
    newElement.classList.add('dc20');
    newElement.classList.add(elementType.selector);

    if (["ABILITY"].includes(key)) {
        const elements = element.querySelectorAll(elementType.childSelector);
        elements.forEach(e => {
            const child = document.createElement('button');
            const title = e.querySelector('.label').innerHTML.trim();
            const modifier = /\(([+-−]\d+)\)/.exec(e.querySelector('.modifier').innerHTML.trim())[1].replace('−', '-');
            child.onclick = function() { sendRoll(title, null, rollTypes.SIMPLE, modifier); }
            child.append(e.cloneNode(true))
            newElement.append(child);
            e.classList.add('dc20-hidden');
        });
        element.append(newElement);
    } else if (["SAVE", "SKILL"].includes(key)) {
        const source = element.querySelector(elementType.childSelector);
        strings = source.innerHTML.trim().split(', ');
        strings.forEach(s => {
            let title = s.trim().match(/[a-zA-Z\/]+/);
            let modifier = s.trim().match(/[+-−][0-9]+/)[0].replace('−', '-');
            const child = document.createElement('button');
            child.onclick = function() { sendRoll(title, null, rollTypes.SIMPLE, modifier); }
            child.innerHTML = s;
            newElement.append(child);
        });
        source.classList.add('dc20-hidden');
        element.append(newElement);
    } else if (["TRAIT"].includes(key)) {
        const source = element.querySelector(elementType.childSelector);
        let title = source.querySelector('.name').innerHTML.trim();
        let detail = source.querySelector('.detail').innerHTML.trim();
        const child = document.createElement('button');
        child.onclick = function() { sendRoll(title, detail, rollTypes.INFO); }
        child.append(source.cloneNode(true));
        child.classList.add('dc20-noadvantage');
        source.classList.add('dc20-hidden');
        newElement.append(child);
        element.append(newElement);
    } else if (["ACTION"].includes(key)) {
        const source = element.querySelector(elementType.childSelector);
        const child = document.createElement('button');

        let title = source.querySelector('.name').innerHTML.trim();
        let detail = source.querySelector('.detail').innerHTML.trim();

        /**
         * Action Templates:
         * Attack: +3 to hit. Hit: 10 (1d10 + 4) slashing damage.
         * Save: DC 13 Strength saving throw. Success: 5 (1d6 + 2) thunder damage. Failure: 10 (1d10 + 4) fire damage.
         * Save: DC 13 Dexterity saving throw. Success: Yadayada. Failure: Half damage.
         */

        const attackModRegexp = /([+-−][0-9]+) to hit./;
        const attackDiceRegexp = /[hH]it: [0-9]+ \(([0-9]+d[0-9]+)( \+ [0-9]+)?\) [a-zA-Z]+ damage./;
        const attackDamageRegexp = /[hH]it: [0-9]+ \([0-9]+d[0-9]+ (\+ [0-9]+)\) [a-zA-Z]+ damage./; // Replace whitespace with nothing!
        const attackDamageTypeRegexp = /[hH]it: [0-9]+ \([0-9]+d[0-9]+( \+ [0-9]+)?\) ([a-zA-Z]+) damage./;

        const saveDCRegexp = /DC ([0-9]+) [a-zA-Z]+ saving throw./;
        const saveAbilityRegexp = /DC [0-9]+ ([a-zA-Z]+) saving throw./;

        const saveSuccessRegexp = /[sS]uccess: ([a-zA-Z0-9\(\)\+ ]+\.)/;

        const saveFailureRegexp = /[fF]ailure: ([a-zA-Z0-9\(\)\+ ]+\.)/;
        const saveFailureDiceRegexp = /[fF]ailure: [0-9]+ \(([0-9]+d[0-9]+)( \+ [0-9]+)?\) [a-zA-Z]+ damage./;
        const saveFailureDamageRegexp = /[fF]ailure: [0-9]+ \([0-9]+d[0-9]+ (\+ [0-9]+)\) [a-zA-Z]+ damage./; // Replace whitespace with nothing!
        const saveFailureDamageTypeRegexp = /[fF]ailure: [0-9]+ \([0-9]+d[0-9]+( \+ [0-9]+)?\) ([a-zA-Z]+) damage./;

        const healDiceRegexp = /[rR]egain [0-9]+ \(([0-9]+d[0-9]+)( \+ [0-9]+)?\) hitpoints./;
        const healDamageRegexp = /[rR]egain [0-9]+ \([0-9]+d[0-9]+ (\+ [0-9]+)\) hitpoints./; // Replace whitespace with nothing!

        let attackMod = detail.match(attackModRegexp);
        if (attackMod) {
            attackMod = attackMod[1].replace('−', '-');
        }
        let attackDice = detail.match(attackDiceRegexp);
        if (attackDice) {
            attackDice = attackDice[1];
        }
        let attackDamage = detail.match(attackDamageRegexp);
        if (attackDamage) {
            attackDamage = attackDamage[1].replace(' ', '');
        }
        let attackDamageType = detail.match(attackDamageTypeRegexp);
        if (attackDamageType) {
            attackDamageType = attackDamageType[2];
        }

        let saveDC = detail.match(saveDCRegexp);
        if (saveDC) {
            saveDC = saveDC[1];
        }
        let saveAbility = detail.match(saveAbilityRegexp);
        if (saveAbility) {
            saveAbility = saveAbility[1];
        }

        let saveSuccess = detail.match(saveSuccessRegexp);
        if (saveSuccess) {
            saveSuccess = saveSuccess[1];
        }

        let saveFailure = detail.match(saveFailureRegexp);
        if (saveFailure) {
            saveFailure = saveFailure[1];
        }
        let saveFailureDice = detail.match(saveFailureDiceRegexp);
        if (saveFailureDice) {
            saveFailureDice = saveFailureDice[1];
        }
        let saveFailureDamage = detail.match(saveFailureDamageRegexp);
        if (saveFailureDamage) {
            saveFailureDamage = saveFailureDamage[1].replace(' ', '');
        }
        let saveFailureDamageType = detail.match(saveFailureDamageTypeRegexp);
        if (saveFailureDamageType) {
            saveFailureDamageType = saveFailureDamageType[2];
        }

        let healDice = detail.match(healDiceRegexp);
        if (healDice) {
            healDice = healDice[1];
        }
        let healDamage = detail.match(healDamageRegexp);
        if (healDamage) {
            healDamage = healDamage[1].replace(' ', '');
        }

        child.onclick = function() { sendRoll(title, detail, rollTypes.ATTACK, attackMod, attackDice, attackDamage, attackDamageType, saveDC, saveAbility, saveSuccess, saveFailure, saveFailureDice, saveFailureDamage, saveFailureDamageType, healDice, healDamage); }
        child.append(source.cloneNode(true));
        source.classList.add('dc20-hidden');
        newElement.append(child);
        element.append(newElement);
    }
}

function removeOldHtml(element) {
    const oldHtml = element.querySelector(".dc20");
    if (oldHtml) {
        element.removeChild(oldHtml);
    }
}

function updateElements() {
    document.querySelectorAll('.dc20-hidden').forEach(e => {
        e.classList.remove('dc20-hidden');
    });
    for (const [key, elementType] of Object.entries(ElementType)) {
        const elements = document.querySelectorAll(elementType.parent);

        elements.forEach(element => {
            removeOldHtml(element);
            createButtons(elementType, key, element);
        });
    };
}

function updateMenu() {
    const body = document.body;
    if (gmRoll) {
        body.classList.add('dc20-gmroll');
    } else {
        body.classList.remove('dc20-gmroll');
    }
    switch(rollState) {
        case states.NORMAL:
            body.classList.remove('dc20-disadvantage');
            body.classList.remove('dc20-advantage');
            break;
        case states.DISADVANTAGE:
            body.classList.add('dc20-disadvantage');
            body.classList.remove('dc20-advantage');
            break;
        case states.ADVANTAGE:
            body.classList.remove('dc20-disadvantage');
            body.classList.add('dc20-advantage');
            break;
    }
}

function setRollState(state) {
    rollState = state;
    updateMenu();
}

function toggleGMRoll() {
    gmRoll = !gmRoll;
    updateMenu();
}

function toggleAdvantage() {
    switch(rollState) {
        case states.NORMAL:
        case states.DISADVANTAGE:
            setRollState(states.ADVANTAGE);
            break;
        case states.ADVANTAGE:
            setRollState(states.NORMAL);
            break;
    }
}

function toggleDisadvantage() {
    switch(rollState) {
        case states.NORMAL:
        case states.ADVANTAGE:
            setRollState(states.DISADVANTAGE);
            break;
        case states.DISADVANTAGE:
            setRollState(states.NORMAL);
            break;
    }
}

function getMenuElements() {
    menu = document.createElement('div');
    menu.classList.add('dc20-menu');
    menu.classList.add('dc20');

    const gmroll = document.createElement('button');
    gmroll.innerHTML = 'GM';
    gmroll.classList.add('dc20-gmroll');
    gmroll.classList.add('dc20-noadvantage');
    gmroll.onclick = function() { toggleGMRoll(); }

    const advantage = document.createElement('button');
    advantage.innerHTML = '˄';
    advantage.classList.add('dc20-advantage');
    advantage.classList.add('dc20-noadvantage');
    advantage.onclick = function() { toggleAdvantage(); }

    const disadvantage = document.createElement('button');
    disadvantage.innerHTML = '˅';
    disadvantage.classList.add('dc20-disadvantage');
    disadvantage.classList.add('dc20-noadvantage');
    disadvantage.onclick = function() { toggleDisadvantage(); }
    
    const refresh = document.createElement('button');
    refresh.innerHTML = '&#x21bb;';
    refresh.classList.add('dc20-refresh');
    refresh.classList.add('dc20-noadvantage');
    refresh.onclick = function() { updateElements(); }
    
    menu.append(gmroll);
    menu.append(advantage);
    menu.append(disadvantage);
    menu.append(refresh);
    return menu;
}

function ready() {
    console.log("DiceCloud20 Ready");

    document.body.append(getMenuElements());
    
    updateElements();
    /*setInterval(() => {
        updateElements();
    }, 15 * 1000);*/
}

function noRoll20() {
    alert("Roll20 has not been recognized by the extension. Please make sure it is open and refresh it.");
}

chrome.runtime.sendMessage("init");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch(request) {
        case "ready":
            ready();
            break;
        case "noRoll20":
            noRoll20();
            break;
    }
});
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

function sendRoll(title, description, type, attackMod = null, attackDice = null, attackDamage = null, attackDamageType = null, saveDC = null, saveAbility = null, saveSuccess = null, saveFailure = null, saveFailureDice = null, saveFailureDamage = null, saveFailureDamageType = null, healDice = null, healDamage = null, attack2Dice = null, attack2Damage = null, attack2DamageType = null, saveFailure2Dice = null, saveFailure2Damage = null, saveFailure2DamageType = null) {
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

            if (attack2Dice) {
                if (attack2Damage) {
                    attack += `{{attack_second_damage=[[${attack2Dice}${attack2Damage}]]}} {{attack_second_damage_crit=[[${attack2Dice}]]}} `;
                } else {
                    attack += `{{attack_second_damage=[[${attack2Dice}]]}} {{attack_second_damage_crit=[[${attack2Dice}]]}} `;
                }
            }
            if (attack2DamageType) {
                attack += `{{attack_second_damage_type=${attack2DamageType}}} `;
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
                    save += `{{has_saving_throw_damage=1}} {{saving_throw_damage_macro=Saving throw failure:}} `
                    if (saveFailureDamage) {
                        save += `{{saving_throw_damage=[[${saveFailureDice}${saveFailureDamage}]]}} `;
                    } else {
                        save += `{{saving_throw_damage=[[${saveFailureDice}]]}} `;
                    }
                    if (saveFailureDamageType) {
                        save += `{{saving_throw_damage_type=${saveFailureDamageType}}} `;
                    }
                }

                if (saveFailure2Dice) {
                    if (saveFailure2Damage) {
                        save += `{{saving_throw_second_damage=[[${saveFailure2Dice}${saveFailure2Damage}]]}} `;
                    } else {
                        save += `{{saving_throw_second_damage=[[${saveFailure2Dice}]]}} `;
                    }
                    if (saveFailure2DamageType) {
                        save += `{{saving_throw_second_damage_type=${saveFailure2DamageType}}} `;
                    }
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
            message += `&{template:5e-shaped} {{title=${title}}} ${advantage} {{subheader=${description}}} {{text_top= }} ${attack} ${save} ${heal}`;
            break;
    }

    chrome.runtime.sendMessage(message)
}

function formatAbility(abilities) {
    if (abilities.replace) {
        return abilities
            .replace('Str', 'Strength')
            .replace('Dex', 'Dexterity')
            .replace('Con', 'Constitution')
            .replace('Int', 'Intelligence')
            .replace('Wis', 'Wisdom')
            .replace('Cha', 'Charisma')
            .replaceAll('/', ' / ');
    }
    return abilities;
}

function formatTitle(key, string) {
    string = formatAbility(string);
    switch (key) {
        case 'SAVE':
            return string += ' Saving Throw';
        default:
            return string;
    }
}

function createButtons(elementType, key, element) {
    const newElement = document.createElement('div');
    newElement.classList.add('dc20');
    newElement.classList.add(elementType.selector);

    if (["ABILITY"].includes(key)) {
        const elements = element.querySelectorAll(elementType.childSelector);
        elements.forEach(e => {
            const child = document.createElement('button');
            const title = formatTitle(key, e.querySelector('.label').innerHTML.trim());
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
            let title = formatTitle(key, s.trim().match(/[a-zA-Z\/]+/)[0]);
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

        let title = source.querySelector('.name').innerHTML.trim().replace('.', '');
        let detail = source.querySelector('.detail').innerHTML.trim().replace('<i>', '').replace('</i>', '').replace('<b>', '').replace('</b>', '');

        /**
         * Action Templates:
         * Attack: ```+9 to hit```
         * Attack damage: ```Hit: 33 (1d10 + 5) slashing damage```
         * Second damage: ```Hit: 33 (1d10 + 5) slashing damage and  33 (1d10 + 5) piercing damage```
         * Saving Throw: ```DC 17 Strength saving throw```
         * On Failure: ```Failure: 33 (6d10) fire damage```
         * Second Failure: ```Failure: 33 (1d10 + 5) fire damage and  33 (1d10 + 5) thunder damage```
         * On Success: ```Success: Any text goes here, no rolls though```
         * Heals: ```Regain 33 (3d20 + 2) hitpoints```
         * 
         * Format for rolls can be either ```33 (1d10 + 5)``` or ```33 (1d10)```
         */

        const attackModRegexp = /([+-−][0-9]+) to hit/;
        const attackDiceRegexp = /[hH]it: [0-9]+ \(([0-9]+d[0-9]+)( \+ [0-9]+)?\) [a-zA-Z]+ damage/;
        const attackDamageRegexp = /[hH]it: [0-9]+ \([0-9]+d[0-9]+ (\+ [0-9]+)\) [a-zA-Z]+ damage/; // Replace whitespace with nothing!
        const attackDamageTypeRegexp = /[hH]it: [0-9]+ \([0-9]+d[0-9]+( \+ [0-9]+)?\) ([a-zA-Z]+) damage/;

        const attack2DiceRegexp = /[hH]it: [0-9]+ \([0-9]+d[0-9]+( \+ [0-9]+)?\) [a-zA-Z]+ damage and [0-9]+ \(([0-9]+d[0-9]+)( \+ [0-9]+)?\) [a-zA-Z]+ damage/;
        const attack2DamageRegexp = /[hH]it: [0-9]+ \([0-9]+d[0-9]+( \+ [0-9]+)?\) [a-zA-Z]+ damage and [0-9]+ \([0-9]+d[0-9]+ (\+ [0-9]+)\) [a-zA-Z]+ damage/; // Replace whitespace with nothing!
        const attack2DamageTypeRegexp = /[hH]it: [0-9]+ \([0-9]+d[0-9]+( \+ [0-9]+)?\) [a-zA-Z]+ damage and [0-9]+ \([0-9]+d[0-9]+( \+ [0-9]+)?\) ([a-zA-Z]+) damage/;

        const saveDCRegexp = /DC ([0-9]+) [a-zA-Z]+ saving throw/;
        const saveAbilityRegexp = /DC [0-9]+ ([a-zA-Z]+) saving throw/;

        const saveSuccessRegexp = /[sS]uccess: ([^\.]+)\./;

        const saveFailureRegexp = /[fF]ailure: ([^\.]+)\./;
        const saveFailureDiceRegexp = /[fF]ailure: [0-9]+ \(([0-9]+d[0-9]+)( \+ [0-9]+)?\) [a-zA-Z]+ damage/;
        const saveFailureDamageRegexp = /[fF]ailure: [0-9]+ \([0-9]+d[0-9]+ (\+ [0-9]+)\) [a-zA-Z]+ damage/; // Replace whitespace with nothing!
        const saveFailureDamageTypeRegexp = /[fF]ailure: [0-9]+ \([0-9]+d[0-9]+( \+ [0-9]+)?\) ([a-zA-Z]+) damage/;
        
        const saveFailure2DiceRegexp = /[fF]ailure: [0-9]+ \([0-9]+d[0-9]+( \+ [0-9]+)?\) [a-zA-Z]+ damage and [0-9]+ \(([0-9]+d[0-9]+)( \+ [0-9]+)?\) [a-zA-Z]+ damage/;
        const saveFailure2DamageRegexp = /[fF]ailure: [0-9]+ \([0-9]+d[0-9]+( \+ [0-9]+)?\) [a-zA-Z]+ damage and [0-9]+ \([0-9]+d[0-9]+ (\+ [0-9]+)\) [a-zA-Z]+ damage/; // Replace whitespace with nothing!
        const saveFailure2DamageTypeRegexp = /[fF]ailure: [0-9]+ \([0-9]+d[0-9]+( \+ [0-9]+)?\) [a-zA-Z]+ damage and [0-9]+ \([0-9]+d[0-9]+( \+ [0-9]+)?\) ([a-zA-Z]+) damage/;

        const healDiceRegexp = /[rR]egain [0-9]+ \(([0-9]+d[0-9]+)( \+ [0-9]+)?\) hitpoints/;
        const healDamageRegexp = /[rR]egain [0-9]+ \([0-9]+d[0-9]+ (\+ [0-9]+)\) hitpoints/; // Replace whitespace with nothing!

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

        let attack2Dice = detail.match(attack2DiceRegexp);
        if (attack2Dice) {
            attack2Dice = attack2Dice[2];
        }
        let attack2Damage = detail.match(attack2DamageRegexp);
        if (attack2Damage) {
            attack2Damage = attack2Damage[2].replace(' ', '');
        }
        let attack2DamageType = detail.match(attack2DamageTypeRegexp);
        if (attack2DamageType) {
            attack2DamageType = attack2DamageType[3];
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
        
        let saveFailure2Dice = detail.match(saveFailure2DiceRegexp);
        if (saveFailure2Dice) {
            saveFailure2Dice = saveFailure2Dice[2];
        }
        let saveFailure2Damage = detail.match(saveFailure2DamageRegexp);
        if (saveFailure2Damage) {
            saveFailure2Damage = saveFailure2Damage[2].replace(' ', '');
        }
        let saveFailure2DamageType = detail.match(saveFailure2DamageTypeRegexp);
        if (saveFailure2DamageType) {
            saveFailure2DamageType = saveFailure2DamageType[3];
        }

        let healDice = detail.match(healDiceRegexp);
        if (healDice) {
            healDice = healDice[1];
        }
        let healDamage = detail.match(healDamageRegexp);
        if (healDamage) {
            healDamage = healDamage[1].replace(' ', '');
        }

        child.onclick = function() { sendRoll(title, detail, rollTypes.ATTACK, attackMod, attackDice, attackDamage, attackDamageType, saveDC, saveAbility, saveSuccess, saveFailure, saveFailureDice, saveFailureDamage, saveFailureDamageType, healDice, healDamage, attack2Dice, attack2Damage, attack2DamageType, saveFailure2Dice, saveFailure2Damage, saveFailure2DamageType); }
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

    addActionLegend();
}

function addActionLegend() {
    const actions = document.querySelector('.repeatable-section[data-path=actions] #blueprint-action');
    const old = actions.querySelector('.dc20-legend');
    if (old) {
        actions.removeChild(old);
    }

    const actionList = {
        'Attack': ['+9 to hit.&nbsp;', '[attack] to hit.&nbsp;'],
        'Attack Damage': ['Hit: 33 (1d10 + 5) slashing damage.&nbsp;', 'Hit: [damage, d10] slashing damage.&nbsp;'],
        'Attack Multiple Damage Types': ['Hit: 30 (5d10 + 3) slashing damage and 14 (5d4 + 2) fire damage.&nbsp;', 'Hit: [damage, d10] slashing damage and [14, d4] fire damage.&nbsp;'],
        'Saving Throw': ['DC 17 Strength saving throw.&nbsp;', '[dc-primary] Strength saving throw.&nbsp;'],
        'Save Failure': ['Failure: 30 (5d10 + 3) fire damage.&nbsp;', 'Failure: [damage, d10] fire damage.&nbsp;'],
        'Save Failure Multiple Damage Types': ['Failure: 30 (5d10 + 3) fire damage and 14 (5d4 + 2) thunder damage.&nbsp;', 'Failure: [damage, d10] fire damage and [14, d4] thunder damage.&nbsp;'],
        'Save Success': ['Success: Any text goes here, no rolls though :(.&nbsp;'],
        'Heal': ['Regain 30 (2d20 + 9) hitpoints.&nbsp;', 'Regain [damage, d20] hitpoints.&nbsp;'],
    }

    const legend = document.createElement('div');
    legend.classList.add('repeatable-item');
    legend.classList.add('dc20-legend');

    const title = document.createElement('div');
    title.classList.add('dc20-title');
    title.innerHTML = 'DiceCloud20 Action Templates'
    legend.append(title);

    for (const [key, action] of Object.entries(actionList)) {
        const label = document.createElement('label');
        label.innerHTML = key;

        const description = document.createElement('div');
        description.classList.add('dc20-description');

        action.forEach(a => {
            const code = document.createElement('code');
            code.innerHTML = a;
            description.append(code);
        });
    
        const formGroup = document.createElement('div');
        formGroup.classList.add('form-group');
        formGroup.append(label);
        formGroup.append(description);
        legend.append(formGroup);
    }

    actions.append(legend);
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
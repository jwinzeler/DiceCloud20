let rollState = advantageStates.NORMAL;
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
    },
    REACTION: {
        parent: ".monster-reaction",
        childSelector: "p",
        selector: "dc20-reaction",
    }
}

function sendRoll(info) {
    const message = TemplateStringBuilder.getTemplate({
        advantage: rollState,
        isGmroll: gmRoll,
        ...info
    });
    chrome.runtime.sendMessage(message);
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

function createInitiativeButton(modifier) {
    const skills = document.querySelector('.monster-skills span:nth-child(2)');
    if (skills) {
        skills.innerHTML = skills.innerHTML.replace(`Initiative ${modifier}, `, '');
        skills.innerHTML = skills.innerHTML.replace(`Initiative ${modifier}`, '');
        if (skills.innerHTML === '') {
            skills.innerHTML = `Initiative ${modifier}`;
        } else {
            skills.innerHTML = `Initiative ${modifier}, ${skills.innerHTML}`;
        }
    } else {
        const label = document.createElement('span');
        label.classList.add('label');
        label.innerHTML = 'Skills';
        const skill = document.createElement('span');
        skill.innerHTML = `Initiative ${modifier}`;
        const p = document.createElement('p');
        p.append(label);
        p.append(skill);
        const monsterSkills = document.createElement('li');
        monsterSkills.classList.add('monster-skills');
        monsterSkills.append(p);
        
        const monsterSaves = document.querySelector('.monster-saves');
        if (monsterSaves) {
            monsterSaves.insertAdjacentElement('afterend', monsterSkills);
        } else {
            const monsterStats = document.querySelector('.monster-stats');
            if (monsterStats) {
                monsterStats.append(monsterSkills);
            }
        }
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
            child.onclick = function() { sendRoll({title, mainModifier: modifier}); }
            child.append(e.cloneNode(true))
            newElement.append(child);
            e.classList.add('dc20-hidden');

            if (title === 'Dexterity' && modifier) {
                createInitiativeButton(modifier);
            }
        });
        element.append(newElement);
    } else if (["SAVE", "SKILL"].includes(key)) {
        const source = element.querySelector(elementType.childSelector);
        strings = source.innerHTML.trim().split(', ');
        strings.forEach(s => {
            let title = formatTitle(key, s.trim().match(/[a-zA-Z\/]+/)[0]);
            let modifier = s.trim().match(/[+-−][0-9]+/)[0].replace('−', '-');
            const child = document.createElement('button');
            child.onclick = function() { sendRoll({
                title,
                mainModifier: modifier,
                isInitiative: title === 'Initiative' ? true : undefined,
            }); }
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
        child.onclick = function() { sendRoll({title, subheader: detail}); }
        child.append(source.cloneNode(true));
        child.classList.add('dc20-noadvantage');
        source.classList.add('dc20-hidden');
        newElement.append(child);
        element.append(newElement);
    } else if (["ACTION", "REACTION"].includes(key)) {
        const source = element.querySelector(elementType.childSelector);
        const child = document.createElement('button');

        let title = source.querySelector('.name').innerHTML.trim().replace('.', '');
        let subheader = source.querySelector('.detail').innerHTML.trim().replace('<i>', '').replace('</i>', '').replace('<b>', '').replace('</b>', '');

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

        let mainModifier = subheader.match(attackModRegexp);
        if (mainModifier) {
            mainModifier = mainModifier[1].replace('−', '-');
        }
        let attackDice = subheader.match(attackDiceRegexp);
        if (attackDice) {
            attackDice = attackDice[1];
        }
        let attackModifier = subheader.match(attackDamageRegexp);
        if (attackModifier) {
            attackModifier = attackModifier[1].replace(' ', '');
        }
        let attackType = subheader.match(attackDamageTypeRegexp);
        if (attackType) {
            attackType = attackType[2];
        }

        let attackSecondaryDice = subheader.match(attack2DiceRegexp);
        if (attackSecondaryDice) {
            attackSecondaryDice = attackSecondaryDice[2];
        }
        let attackSecondaryModifier = subheader.match(attack2DamageRegexp);
        if (attackSecondaryModifier) {
            attackSecondaryModifier = attackSecondaryModifier[2].replace(' ', '');
        }
        let attackSecondaryType = subheader.match(attack2DamageTypeRegexp);
        if (attackSecondaryType) {
            attackSecondaryType = attackSecondaryType[3];
        }

        let saveDC = subheader.match(saveDCRegexp);
        if (saveDC) {
            saveDC = saveDC[1];
        }
        let saveAbility = subheader.match(saveAbilityRegexp);
        if (saveAbility) {
            saveAbility = saveAbility[1];
        }

        let saveSuccess = subheader.match(saveSuccessRegexp);
        if (saveSuccess) {
            saveSuccess = saveSuccess[1];
        }

        let saveFailure = subheader.match(saveFailureRegexp);
        if (saveFailure) {
            saveFailure = saveFailure[1];
        }
        let saveFailureDice = subheader.match(saveFailureDiceRegexp);
        if (saveFailureDice) {
            saveFailureDice = saveFailureDice[1];
        }
        let saveFailureModifier = subheader.match(saveFailureDamageRegexp);
        if (saveFailureModifier) {
            saveFailureModifier = saveFailureModifier[1].replace(' ', '');
        }
        let saveFailureDamageType = subheader.match(saveFailureDamageTypeRegexp);
        if (saveFailureDamageType) {
            saveFailureDamageType = saveFailureDamageType[2];
        }
        
        let saveFailureSecondaryDice = subheader.match(saveFailure2DiceRegexp);
        if (saveFailureSecondaryDice) {
            saveFailureSecondaryDice = saveFailureSecondaryDice[2];
        }
        let saveFailureSecondaryModifier = subheader.match(saveFailure2DamageRegexp);
        if (saveFailureSecondaryModifier) {
            saveFailureSecondaryModifier = saveFailureSecondaryModifier[2].replace(' ', '');
        }
        let saveFailureSecondaryDamageType = subheader.match(saveFailure2DamageTypeRegexp);
        if (saveFailureSecondaryDamageType) {
            saveFailureSecondaryDamageType = saveFailureSecondaryDamageType[3];
        }

        let healDice = subheader.match(healDiceRegexp);
        if (healDice) {
            healDice = healDice[1];
        }
        let healModifier = subheader.match(healDamageRegexp);
        if (healModifier) {
            healModifier = healModifier[1].replace(' ', '');
        }

        subheader = subheader
            .replace(attackModRegexp, '')
            .replace(attack2DiceRegexp, '')
            .replace(attackDiceRegexp, '')
            .replace(saveDCRegexp, '')
            .replace(saveSuccessRegexp, '')
            .replace(saveFailureRegexp, '')
            .replace(healDiceRegexp, '')
            .replace(/<[^>]*>/g, '')
            .replaceAll('&nbsp;.', '')
            .replaceAll(' .', '')
            .trim();
        if (subheader === '.') {
            subheader = undefined;
        }

        child.onclick = function() { sendRoll({
            title,
            subheader,
            mainModifier,
            attackDice,
            attackModifier,
            attackType,
            attackSecondaryDice,
            attackSecondaryModifier,
            attackSecondaryType,
            saveDC,
            saveAbility,
            saveSuccess,
            saveFailureDice,
            saveFailureModifier,
            saveFailureDamageType,
            saveFailureSecondaryDice,
            saveFailureSecondaryModifier,
            saveFailureSecondaryDamageType,
            healDice,
            healModifier
        }); }
        
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
        case advantageStates.NORMAL:
            body.classList.remove('dc20-disadvantage');
            body.classList.remove('dc20-advantage');
            break;
        case advantageStates.DISADVANTAGE:
            body.classList.add('dc20-disadvantage');
            body.classList.remove('dc20-advantage');
            break;
        case advantageStates.ADVANTAGE:
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
        case advantageStates.NORMAL:
        case advantageStates.DISADVANTAGE:
            setRollState(advantageStates.ADVANTAGE);
            break;
        case advantageStates.ADVANTAGE:
            setRollState(advantageStates.NORMAL);
            break;
    }
}

function toggleDisadvantage() {
    switch(rollState) {
        case advantageStates.NORMAL:
        case advantageStates.ADVANTAGE:
            setRollState(advantageStates.DISADVANTAGE);
            break;
        case advantageStates.DISADVANTAGE:
            setRollState(advantageStates.NORMAL);
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
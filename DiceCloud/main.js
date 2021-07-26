const Button = {
    POST: 1,
    ADVANTAGE: 2,
    NORMAL: 3,
    DISADVANTAGE: 4,
}

const ElementType = {
    ABILITY: ".ability-mini-card",
    STAT: ".stat-card",
    SKILL: ".skill-row",
    ATTACK: ".attack",
    FEATURE: ".featureCard .top",
}

function getButtonConfig(info) {
    return {
        [ElementType.ABILITY]: {
            classes: ['dc20-ability'],
            [Button.POST]: {
                templateStats: {
                    title: info.title,
                    subheader: `${info.value} (${info.modifier})`,
                },
                create: true,
            },
            [Button.ADVANTAGE]: {
                templateStats: {
                    advantage: advantageStates.ADVANTAGE,
                    title: info.title,
                    mainModifier: info.modifier,
                },
                create: true,
            },
            [Button.NORMAL]: {
                templateStats: {
                    title: info.title,
                    mainModifier: info.modifier,
                },
                create: true,
            },
            [Button.DISADVANTAGE]: {
                templateStats: {
                    advantage: advantageStates.DISADVANTAGE,
                    title: info.title,
                    mainModifier: info.modifier,
                },
                create: true,
            },
        },
        [ElementType.STAT]: {
            classes: ['dc20-stat'],
            [Button.POST]: {
                templateStats: {
                    title: info.title,
                    subheader: info.value,
                },
                create: true,
            },
            [Button.ADVANTAGE]: {
                templateStats: {
                    advantage: advantageStates.ADVANTAGE,
                    isInitiative: info.isInitiative,
                    title: info.title,
                    mainModifier: info.value,
                },
                create: info.isInitiative,
            },
            [Button.NORMAL]: {
                templateStats: {
                    isInitiative: info.isInitiative,
                    title: info.title,
                    mainModifier: info.value,
                },
                create: info.isInitiative,
            },
            [Button.DISADVANTAGE]: {
                templateStats: {
                    advantage: advantageStates.DISADVANTAGE,
                    isInitiative: info.isInitiative,
                    title: info.title,
                    mainModifier: info.value,
                },
                create: info.isInitiative,
            },
        },
        [ElementType.SKILL]: {
            classes: ['dc20-skill'],
            [Button.POST]: {
                templateStats: {
                    title: `${info.title}${info.isSavingThrow ? ' Saving Throw' : ''}`,
                    subheader: info.value,
                },
                create: true,
            },
            [Button.ADVANTAGE]: {
                templateStats: {
                    advantage: advantageStates.ADVANTAGE,
                    title: `${info.title}${info.isSavingThrow ? ' Saving Throw' : ''}`,
                    mainModifier: info.value,
                },
                create: true,
            },
            [Button.NORMAL]: {
                templateStats: {
                    title: `${info.title}${info.isSavingThrow ? ' Saving Throw' : ''}`,
                    mainModifier: info.value,
                },
                create: true,
            },
            [Button.DISADVANTAGE]: {
                templateStats: {
                    advantage: advantageStates.DISADVANTAGE,
                    title: `${info.title}${info.isSavingThrow ? ' Saving Throw' : ''}`,
                    mainModifier: info.value,
                },
                create: true,
            },
        },
        [ElementType.ATTACK]: {
            classes: ['dc20-attack'],
            [Button.POST]: {
                message: '',
                create: false,
            },
            [Button.ADVANTAGE]: {
                templateStats: {
                    advantage: advantageStates.ADVANTAGE,
                    title: info.title,
                    mainModifier: info.value,
                    attackDice: info.dice,
                    attackModifier: info.modifier,
                    attackType: info.type
                },
                create: !info.requiresSavingThrow && !info.isHeal,
            },
            [Button.NORMAL]: {
                templateStats: {
                    title: info.title,
                    mainModifier: !info.requiresSavingThrow && !info.isHeal ? info.value : null,
                    attackDice: !info.requiresSavingThrow && !info.isHeal ? info.dice : null,
                    attackModifier: !info.requiresSavingThrow && !info.isHeal ? info.modifier : null,
                    attackType: !info.requiresSavingThrow && !info.isHeal ? info.type : null,
                    saveDC: info.requiresSavingThrow ? info.value : null,
                    saveAbility: info.requiresSavingThrow ? info.extra.toUpperCase() : null,
                    saveFailure: info.requiresSavingThrow ? true : null,
                    saveFailureDice: info.requiresSavingThrow ? info.dice : null,
                    saveFailureModifier: info.requiresSavingThrow ? info.modifier : null,
                    saveFailureDamageType: info.requiresSavingThrow ? info.type : null,
                    healDice: info.isHeal ? info.dice : null,
                    healModifier: info.isHeal ? info.modifier : null,
                },
                create: true,
            },
            [Button.DISADVANTAGE]: {
                templateStats: {
                    advantage: advantageStates.DISADVANTAGE,
                    title: info.title,
                    mainModifier: info.value,
                    attackDice: info.dice,
                    attackModifier: info.modifier,
                    attackType: info.type
                },
                create: !info.requiresSavingThrow && !info.isHeal,
            },
        },
        [ElementType.FEATURE]: {
            classes: ['dc20-feature'],
            [Button.POST]: {
                templateStats: {
                    title: info.title,
                    subheader: info.value ? info.value : null,
                    uses: info.uses && info.max ? info.uses : null,
                    maxUses: info.uses && info.max ? info.max : null,
                },
                create: true,
            },
            [Button.ADVANTAGE]: {
                message: ``,
                create: false,
            },
            [Button.NORMAL]: {
                message: ``,
                create: false,
            },
            [Button.DISADVANTAGE]: {
                message: ``,
                create: false,
            },
        },
    }
}

function getElementTypeInfo(elementType, element) {
    let info;
    switch(elementType) {
        case ElementType.ABILITY:
            info = {
                title: element.querySelector('.title').innerHTML.cleanWhiteSpace(),
                value: element.querySelector('.stat').innerHTML.cleanWhiteSpace(),
                modifier: element.querySelector('.modifier').innerHTML.cleanWhiteSpace(),
            };
            return info;
        case ElementType.STAT:
            info = {
                title: element.querySelector('.title').innerHTML.cleanWhiteSpace(),
            };
            info.isInitiative = info.title === 'Initiative';
            info.value = !info.isInitiative 
            ? element.querySelector('.numbers').innerHTML.cleanWhiteSpace()
            : element.querySelector('.numbers').querySelector('div').innerHTML.cleanWhiteSpace();
            return info;
        case ElementType.SKILL:
            info = {
                title: element.querySelector('div:last-child').innerHTML.cleanWhiteSpace(),
                value: element.querySelector('.skill-mod').innerHTML.cleanWhiteSpace(),
                isSavingThrow: element.parentElement.parentElement.parentElement.querySelector('.top').innerHTML.trim() === 'Saving Throws',
            };
            return info;
        case ElementType.ATTACK:
            info = {
                title: element.querySelector('.paper-font-body2').innerHTML.trim(),
                dice: element.querySelector('.flex.layout.vertical div:nth-child(2)').innerHTML.cleanWhiteSpace(),
                value: element.querySelector('.paper-font-headline').innerHTML.cleanWhiteSpace(),
            };
            info.type = info.dice.match(/(&nbsp;[a-z]+)$/)[0].replace('&nbsp;', '').upperCaseFirst();
            info.modifier = info.dice.replace(/(&nbsp;[a-z]+)$/, '').replace(' ', '').replace(/[0-9]+d[0-9]+/, '');
            info.dice = info.dice.replace(/(&nbsp;[a-z]+)$/, '').replace(' ', '').replace(/\+[0-9]+$/, '');

            let extra = element.querySelector('.flex.layout.vertical div:nth-child(3)');
            if (extra) {
                info.extra = extra.innerHTML.trim();
            } else {
                info.extra = '';
            }
            info.requiresSavingThrow = info.extra.includes('Saving Throw');
            info.isHeal = info.extra.includes('Heal');
            if (info.requiresSavingThrow) {
                info.extra = info.extra.replace(' Saving Throw', '');
                info.value = info.value.replace('+', '');
            }
            return info;
        case ElementType.FEATURE:
            info = {
                title: element.querySelector('.flex').innerHTML.trim(),
                uses: element.querySelector('div:nth-child(2)'),
                value: element.parentElement.querySelector('.bottom'),
            };
            if (info.value) {
                info.value = info.value.innerHTML.formatText();
            }
            if (info.uses) {
                info.uses = info.uses.innerHTML.cleanWhiteSpace();
                let uses = info.uses.match(/([0-9]+)\/([0-9]+)/);
                info.max = uses[2];
                info.uses = uses[1]
            }
            return info;
    }
}

String.prototype.formatText = function() {
    let string = this.trim();
    string = string.replace(/<\/?strong>/g, '**').replace(/<p>/g, '\n').replace(/<\/p>/g, '');
    return string;
}

String.prototype.cleanWhiteSpace = function() {
    let string = this.trim();
    string = string.replace(/\s{2,}/g, '').replace(/\*/g, '');
    return string;
}

String.prototype.upperCaseFirst = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}

function sendRoll(templateStats) {
    const message = TemplateStringBuilder.getTemplate(templateStats);
    chrome.runtime.sendMessage(message);
}

function getButton(templateStats, cclass, label) {
    let element = document.createElement('button');
    element.innerHTML = label;
    element.classList.add(cclass);
    element.onclick = function() { sendRoll(templateStats) };
    return element;
}

function addButton(element, config, cclass, label) {
    if (config.create) {
        element.append(getButton(config.templateStats, cclass, label));
    }
}

function getRollerHTML(elementType, element) {
    let info = getElementTypeInfo(elementType, element);
    let buttonConfig = getButtonConfig(info);

    let newElement = document.createElement('div');
    newElement.classList.add('dc20');
    buttonConfig[elementType].classes.forEach(c => {
        newElement.classList.add(c);
    });

    addButton(newElement, buttonConfig[elementType][Button.POST], 'dc20-post', '?');
    addButton(newElement, buttonConfig[elementType][Button.ADVANTAGE], 'dc20-advantage', '˄');
    addButton(newElement, buttonConfig[elementType][Button.NORMAL], 'dc20-normal', '-');
    addButton(newElement, buttonConfig[elementType][Button.DISADVANTAGE], 'dc20-disadvantage', '˅');

    return newElement;
}

function removeOldHtml(element) {
    let oldHtml = element.querySelector(".dc20");
    if (oldHtml) {
        element.removeChild(oldHtml);
    }
}

function updateElements() {
    for (const [key, elementType] of Object.entries(ElementType)) {
        let elements = document.querySelectorAll(elementType);

        elements.forEach(element => {
            removeOldHtml(element);
            element.append(getRollerHTML(elementType, element));
        });
    };
}

function ready() {
    console.log("DiceCloud20 Ready");

    let refresh = document.createElement('button');
    refresh.innerHTML = '&#x21bb;';
    refresh.classList.add('dc20-refresh');
    refresh.onclick = function() { updateElements(); }
    document.body.append(refresh);
    
    updateElements();
    setInterval(() => {
        updateElements();
    }, 15 * 1000);
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
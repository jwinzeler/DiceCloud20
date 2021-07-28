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
                    ...info
                },
                create: !!info.mainModifier,
            },
            [Button.NORMAL]: {
                templateStats: {
                    ...info
                },
                create: true,
            },
            [Button.DISADVANTAGE]: {
                templateStats: {
                    advantage: advantageStates.DISADVANTAGE,
                    ...info
                },
                create: !!info.mainModifier,
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
            const elements = {
                template: element.querySelector('.flex.layout.vertical div:nth-child(2)'),
                extra: element.querySelector('.flex.layout.vertical div:nth-child(3)'),
            };

            let title = '';
            if (elements.extra) {
                title = elements.extra.innerHTML.cleanWhiteSpace();
            }
            
            let matches = [];
            if (elements.template) {
                matches = actionRegex.exec(elements.template.innerHTML.cleanWhiteSpace());
            } else {
                matches = actionRegex.exec('');
            }

            return {
                title,
                subheader: matches[37],
                mainModifier: matches[2],
                attackDice: matches[4],
                attackModifier: matches[5],
                attackType: matches[6],
                attackSecondaryDice: matches[8],
                attackSecondaryModifier: matches[9],
                attackSecondaryType: matches[10],
                saveDC: matches[12],
                saveAbility: AbilityConverter.convertShortToLong(matches[13]),
                saveSuccess: matches[23],
                saveFailureDice: matches[15],
                saveFailureModifier: matches[16],
                saveFailureDamageType: matches[17],
                saveFailureSecondaryDice: matches[19],
                saveFailureSecondaryModifier: matches[20],
                saveFailureSecondaryDamageType: matches[21],
                healDice: matches[25],
                healModifier: matches[26],
                otherDice: matches[29],
                otherModifier: matches[30],
                otherType: matches[31],
                otherSecondaryDice: matches[33],
                otherSecondaryModifier: matches[34],
                otherSecondaryType: matches[35],
            };
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

function getActionDescription(config) {
    const stats = config[Button.NORMAL].templateStats;
    return ActionDescriptionBuilder.getDescriptionTable(stats);
}

function addExtraAttackElements(element, config) {
    const elements = {
        parent: element.querySelector('.flex.layout.vertical'),
        mod: element.querySelector('.paper-font-headline'),
        title: element.querySelector('.flex.layout.vertical div:nth-child(1)'),
        template: element.querySelector('.flex.layout.vertical div:nth-child(2)'),
        extra: element.querySelector('.flex.layout.vertical div:nth-child(3)'),
    };
    
    if (elements.title) {
        elements.title.classList.add('dc20-hidden');
    }
    if (elements.mod) {
        elements.mod.classList.add('dc20-hidden');
    }
    if (elements.template) {
        elements.template.classList.add('dc20-hidden');
    }
    if (elements.extra) {
        elements.extra.classList.add('dc20-action-title');
    }
    if (elements.parent) {
        description = getActionDescription(config);
        elements.parent.append(description);
    }
}

function addButton(element, config, cclass, label) {
    if (config.create) {
        element.append(getButton(config.templateStats, cclass, label));
    }
}

function getRollerHTML(elementType, element) {
    const info = getElementTypeInfo(elementType, element);
    const buttonConfig = getButtonConfig(info);
    const config = buttonConfig[elementType];

    let newElement = document.createElement('div');
    newElement.classList.add('dc20');
    config.classes.forEach(c => {
        newElement.classList.add(c);
    });

    if (elementType === ElementType.ATTACK) {
        addExtraAttackElements(element, config);
    }

    addButton(newElement, config[Button.POST], 'dc20-post', '?');
    addButton(newElement, config[Button.ADVANTAGE], 'dc20-advantage', '˄');
    addButton(newElement, config[Button.NORMAL], 'dc20-normal', '-');
    addButton(newElement, config[Button.DISADVANTAGE], 'dc20-disadvantage', '˅');

    return newElement;
}

function removeOldHtml(element) {
    let oldHtml = element.querySelector(".dc20");
    if (oldHtml) {
        oldHtml.remove();
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

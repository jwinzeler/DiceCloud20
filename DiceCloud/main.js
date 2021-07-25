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
                message: `&{template:5e-shaped} {{title=${info.title}: ${info.value} (${info.modifier})}}`,
                create: true,
            },
            [Button.ADVANTAGE]: {
                message: `&{template:5e-shaped} {{title=${info.title}}} {{roll1=[[2d20kh1${info.modifier}]]}} {{2d20kh1=1}}`,
                create: true,
            },
            [Button.NORMAL]: {
                message: `&{template:5e-shaped} {{title=${info.title}}} {{roll1=[[1d20${info.modifier}]]}}`,
                create: true,
            },
            [Button.DISADVANTAGE]: {
                message: `&{template:5e-shaped} {{title=${info.title}}} {{roll1=[[2d20kl1${info.modifier}]]}} {{2d20kl1=1}}`,
                create: true,
            },
        },
        [ElementType.STAT]: {
            classes: ['dc20-stat'],
            [Button.POST]: {
                message: `&{template:5e-shaped} {{title=${info.title}: ${info.value}}}`,
                create: true,
            },
            [Button.ADVANTAGE]: {
                message: `&{template:5e-shaped} {{title=${info.title}}} {{roll1=[[2d20kh1${info.value}&{tracker}]]}} {{2d20kh1=1}}`,
                create: info.isInitiative,
            },
            [Button.NORMAL]: {
                message: `&{template:5e-shaped} {{title=${info.title}}} {{roll1=[[1d20${info.value}&{tracker}]]}}`,
                create: info.isInitiative,
            },
            [Button.DISADVANTAGE]: {
                message: `&{template:5e-shaped} {{title=${info.title}}} {{roll1=[[2d20kl1${info.value}&{tracker}]]}} {{2d20kl1=1}}`,
                create: info.isInitiative,
            },
        },
        [ElementType.SKILL]: {
            classes: ['dc20-skill'],
            [Button.POST]: {
                message: `&{template:5e-shaped} {{title=${info.title}${info.isSavingThrow ? ' Saving Throw' : ''}: ${info.value}}}`,
                create: true,
            },
            [Button.ADVANTAGE]: {
                message: `&{template:5e-shaped} {{title=${info.title} ${info.isSavingThrow ? 'Saving Throw' : 'Check'}:}} {{roll1=[[2d20kh1${info.value}]]}} {{2d20kh1=1}}`,
                create: true,
            },
            [Button.NORMAL]: {
                message: `&{template:5e-shaped} {{title=${info.title} ${info.isSavingThrow ? 'Saving Throw' : 'Check'}:}} {{roll1=[[1d20${info.value}]]}}`,
                create: true,
            },
            [Button.DISADVANTAGE]: {
                message: `&{template:5e-shaped} {{title=${info.title} ${info.isSavingThrow ? 'Saving Throw' : 'Check'}:}} {{roll1=[[2d20kl1${info.value}]]}} {{2d20kl1=1}}`,
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
                message: `&{template:5e-shaped} {{title=${info.title}}} {{attack1=[[2d20kh1${info.value}]]}} {{2d20kh1=1}} {{attack_damage=[[${info.dice}]]}} {{attack_damage_crit=[[${info.crit}]]}} {{attack_damage_type=${info.type}}} {{has_attack_damage=1}}`,
                create: !info.requiresSavingThrow && !info.isHeal,
            },
            [Button.NORMAL]: {
                message: `&{template:5e-shaped} {{title=${info.title}}} ${info.requiresSavingThrow ? `{{saving_throw_dc=${info.value}}} {{saving_throw_vs_ability=${info.extra.toUpperCase()}}}` : info.isHeal ? `{{heal=[[${info.dice}]]}}` : `{{attack1=[[1d20${info.value}]]}} {{attack_damage_crit=[[${info.crit}]]}}`} ${info.isHeal ? '' : `{{attack_damage=[[${info.dice}]]}} {{attack_damage_type=${info.type}}} {{has_attack_damage=1}}`}`,
                create: true,
            },
            [Button.DISADVANTAGE]: {
                message: `&{template:5e-shaped} {{title=${info.title}}} {{attack1=[[2d20kl1${info.value}]]}} {{2d20kl1=1}} {{attack_damage=[[${info.dice}]]}} {{attack_damage_crit=[[${info.crit}]]}} {{attack_damage_type=${info.type}}} {{has_attack_damage=1}}`,
                create: !info.requiresSavingThrow && !info.isHeal,
            },
        },
        [ElementType.FEATURE]: {
            classes: ['dc20-feature'],
            [Button.POST]: {
                message: `&{template:5e-shaped} {{title=${info.title}}} ${info.uses ? `{{uses=${info.uses}}} {{uses_max=${info.max}}}` : ''} ${info.value ? `{{content=${info.value}}}` : ''}`,
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
            info.dice = info.dice.replace(/(&nbsp;[a-z]+)$/, '').replace(' ', '');
            info.crit = info.dice.replace(/\+[0-9]+$/, '');

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

function getButton(message, cclass, label) {
    let element = document.createElement('button');
    element.innerHTML = label;
    element.classList.add(cclass);
    element.onclick = function() {chrome.runtime.sendMessage(message)};
    return element;
}

function addButton(element, config, cclass, label) {
    if (config.create) {
        element.append(getButton(config.message, cclass, label));
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
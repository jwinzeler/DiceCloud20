class ActionDescriptionBuilder {
    static defaultConfig = {
        showSaveSuccess: true,
        showSaveFailureText: true,
        showSaveFailureTextIfDamage: true,
        otherDamageLabel: 'Other',
    }

    static getDescriptionTable(stats, config = {}) {
        config = {...ActionDescriptionBuilder.defaultConfig, ...config};
        stats = ActionDescriptionBuilder.cleanStats(stats);

        const attack = ActionDescriptionBuilder.getRowElement(stats, config, 'attack', {
            th: ActionDescriptionBuilder.getAttackRowHeader,
            td: ActionDescriptionBuilder.getAttackRowDescription,
        });

        const saveFailure = ActionDescriptionBuilder.getRowElement(stats, config, 'save-success', {
            th: ActionDescriptionBuilder.getSaveFailureRowHeader,
            td: ActionDescriptionBuilder.getSaveFailureRowDescription,
        });

        const saveSuccess = ActionDescriptionBuilder.getRowElement(stats, config, 'save-failure', {
            th: ActionDescriptionBuilder.getSaveSuccessRowHeader,
            td: ActionDescriptionBuilder.getSaveSuccessRowDescription,
        });

        const other = ActionDescriptionBuilder.getRowElement(stats, config, 'other', {
            th: ActionDescriptionBuilder.getOtherRowHeader,
            td: ActionDescriptionBuilder.getOtherRowDescription,
        });

        const heal = ActionDescriptionBuilder.getRowElement(stats, config, 'heal', {
            th: ActionDescriptionBuilder.getHealRowHeader,
            td: ActionDescriptionBuilder.getHealRowDescription,
        });

        return ActionDescriptionBuilder.getTableElement([
            attack,
            saveFailure,
            saveSuccess,
            other,
            heal
        ]);
    }

    static getAttackRowHeader(stats) {
        if (stats.mainModifier) {
            return `${stats.mainModifier} to hit`;
        }

        return '';
    }

    static getAttackRowDescription(stats) {
        let description = '';
        if (stats.attackDice || stats.attackModifier) {
            description += `${stats.attackDice}${stats.attackModifier}`

            if (stats.attackType) {
                description += ` ${stats.attackType}`;
            }
        }
        
        if (stats.attackSecondaryDice || stats.attackSecondaryModifier) {
            description += `<br/>${stats.attackSecondaryDice}${stats.attackSecondaryModifier}`;

            if (stats.attackSecondaryType) {
                description += ` ${stats.attackSecondaryType}`;
            }
        }

        return description;
    }

    static getSaveFailureRowHeader(stats) {
        if (stats.saveDC && stats.saveAbility) {
            return `DC${stats.saveDC} ${AbilityConverter.convertLongToShort(stats.saveAbility)}`;
        }

        return '';
    }


    static getSaveFailureRowDescription(stats, config) {
        let description = '';

        if (stats.saveFailureDice || stats.saveFailureModifier) {
            description += `${stats.saveFailureDice}${stats.saveFailureModifier}`

            if (stats.saveFailureDamageType) {
                description += ` ${stats.saveFailureDamageType}`;
            }
        }
        
        if (stats.saveFailureSecondaryDice || stats.saveFailureSecondaryModifier) {
            description += `<br/>${stats.saveFailureSecondaryDice}${stats.saveFailureSecondaryModifier}`;

            if (stats.saveFailureSecondaryDamageType) {
                description += ` ${stats.saveFailureSecondaryDamageType}`;
            }
        }

        if (config.showSaveFailureText) {
            if (stats.saveFailure) {
                if ((stats.showSaveFailureTextIfDamage && description.length > 0) || description.length === 0) {
                    if (description.length > 0) {
                        description += '<br/>';
                    }
        
                    description += `${stats.saveFailure}`;
                }
            }
        }

        return description;
    }

    static getSaveSuccessRowHeader(stats, config) {
        if (config.showSaveSuccess) {
            if (stats.saveSuccess) {            
                return `Success`;
            }
        }

        return '';
    }


    static getSaveSuccessRowDescription(stats, config) {
        if (config.showSaveSuccess) {
            if (stats.saveSuccess) {            
                return `${stats.saveSuccess}`;
            }
        }

        return '';
    }


    static getOtherRowHeader(stats) {
        if (stats.otherDice || stats.otherModifier || stats.otherSecondaryDice || stats.otherSecondaryModifier) {
            return 'Other'
        }

        return '';
    }


    static getOtherRowDescription(stats) {
        let description = '';
        if (stats.otherDice || stats.otherModifier) {
            description += `${stats.otherDice}${stats.otherModifier}`

            if (stats.otherType) {
                description += ` ${stats.otherType}`;
            }
        }
        
        if (stats.otherSecondaryDice || stats.otherSecondaryModifier) {
            description += `<br/>${stats.otherSecondaryDice}${stats.otherSecondaryModifier}`;

            if (stats.otherSecondaryType) {
                description += ` ${stats.otherSecondaryType}`;
            }
        }

        return description;
    }


    static getHealRowHeader(stats) {
        if (stats.healDice || stats.healModifier) {
            return `Heal`;
        }

        return ''
    }


    static getHealRowDescription(stats) {
        if (stats.healDice || stats.healModifier) {
            return `${stats.healDice}${stats.healModifier}`;
        }

        return ''
    }


    static cleanStats(stats) {
        for (let [key, stat] of Object.entries(stats)) {
            stats[key] = stat || '';
        }
        return stats;
    }

    static getRowElement(stats, config, rowName, textSources) {
        const th = document.createElement('th');
        th.innerHTML = textSources.th(stats, config);

        const td = document.createElement('td');
        td.innerHTML = textSources.td(stats, config);

        if (th.innerHTML.length > 0 || td.innerHTML.length > 0) {
            const row = document.createElement('tr');
            row.classList.add(`dc-20-action-table-${rowName}`);
            row.append(th);
            row.append(td);
    
            return row;
        }

        return '';
    }

    static getTableElement(rows) {
        const table = document.createElement('table');
        table.classList.add('dc20');
        table.classList.add('dc20-action-table');

        rows.forEach(row => {
            table.append(row);
        });

        const wrapper = document.createElement('div');
        wrapper.classList.add('dc20');
        wrapper.classList.add('dc20-action-description');
        wrapper.append(table);

        return wrapper;
    }
}
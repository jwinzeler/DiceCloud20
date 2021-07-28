class ActionDescriptionBuilder {
    static getDescriptionTable(stats) {
        stats = ActionDescriptionBuilder.cleanStats(stats);

        const attack = ActionDescriptionBuilder.getRowElement(stats, 'attack', {
            th: ActionDescriptionBuilder.getAttackRowHeader,
            td: ActionDescriptionBuilder.getAttackRowDescription,
        });

        const save = ActionDescriptionBuilder.getRowElement(stats, 'save', {
            th: ActionDescriptionBuilder.getSaveRowHeader,
            td: ActionDescriptionBuilder.getSaveRowDescription,
        });

        const other = ActionDescriptionBuilder.getRowElement(stats, 'other', {
            th: ActionDescriptionBuilder.getOtherRowHeader,
            td: ActionDescriptionBuilder.getOtherRowDescription,
        });

        const heal = ActionDescriptionBuilder.getRowElement(stats, 'heal', {
            th: ActionDescriptionBuilder.getHealRowHeader,
            td: ActionDescriptionBuilder.getHealRowDescription,
        });

        return ActionDescriptionBuilder.getTableElement([
            attack,
            save,
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

    static getSaveRowHeader(stats) {
        if (stats.saveDC && stats.saveAbility) {
            return `DC${stats.saveDC} ${AbilityConverter.convertLongToShort(stats.saveAbility)}`;
        }

        return '';
    }


    static getSaveRowDescription(stats) {
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

        return description;
    }


    static getOtherRowHeader(stats) {
        if (stats.otherDice || stats.otherModifier || stats.otherSecondaryDice || stats.otherSecondaryModifier) {
            return 'Deal'
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

    static getRowElement(stats, rowName, textSources) {
        const th = document.createElement('th');
        th.innerHTML = textSources.th(stats);

        const td = document.createElement('td');
        td.innerHTML = textSources.td(stats);

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
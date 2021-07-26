class TemplateStringBuilder {
    static getTemplate(stats) {
        let template = TemplateStringBuilder.getGMRoll(stats);
        template += TemplateStringBuilder.getTemplateStart();

        template += TemplateStringBuilder.getTitle(stats);
        template += TemplateStringBuilder.getSubheader(stats);

        template += TemplateStringBuilder.getUses(stats);

        template += TemplateStringBuilder.getMainRoll(stats);
        template += TemplateStringBuilder.getHasAttack(stats);

        template += TemplateStringBuilder.getPrimaryAttackDamage(stats);
        template += TemplateStringBuilder.getPrimaryAttackDamageType(stats);

        template += TemplateStringBuilder.getSecondaryAttackDamage(stats);
        template += TemplateStringBuilder.getSecondaryAttackDamageType(stats);

        template += TemplateStringBuilder.getSaveDC(stats);
        template += TemplateStringBuilder.getSaveAbility(stats);
        template += TemplateStringBuilder.getSaveSuccess(stats);
        template += TemplateStringBuilder.getHasSaveFailureDamage(stats);

        template += TemplateStringBuilder.getPrimarySaveFailure(stats);
        template += TemplateStringBuilder.getPrimarySaveFailureType(stats);

        template += TemplateStringBuilder.getSecondarySaveFailure(stats);
        template += TemplateStringBuilder.getSecondarySaveFailureType(stats);

        template += TemplateStringBuilder.getHeal(stats);

        return template;
    }

    static getGMRoll(stats) {
        if (stats.isGmroll) {
            return '/w gm ';
        }

        return '';
    }

    static getTemplateStart() {
        return '&{template:5e-shaped}';
    }

    static getTitle(stats) {
        if (stats.title) {
            return `{{title=${stats.title}}}`;
        }

        return '';
    }

    static getSubheader(stats) {
        if (stats.subheader) {
            return `{{subheader=${stats.subheader}}}`;
        }

        return '';
    }

    static getUses(stats) {
        if (stats.uses && stats.maxUses) {
            return `{{uses=${stats.uses}}}{{uses_max=${stats.maxUses}}}`;
        }

        return '';
    }

    static getMainRoll(stats) {
        let advantage = TemplateStringBuilder.getAdvantageInfo(stats);
        let initiative = TemplateStringBuilder.getInitiativeInfo(stats);

        if (stats.mainModifier && (stats.attackDice || stats.attackModifier)) {
            return `{{attack1=[[${advantage.roll}${stats.mainModifier}${initiative}]]}}${advantage.string}`;
        } else if (stats.mainModifier) {
            return `{{roll1=[[${advantage.roll}${stats.mainModifier}${initiative}]]}}${advantage.string}`;
        }

        return '';
    }

    static getAdvantageInfo(stats) {
        if (stats.advantage === advantageStates.ADVANTAGE) {
            return {roll: '2d20kh1', string: '{{2d20kh1=1}}'};
        } else if (stats.advantage === advantageStates.DISADVANTAGE) {
            return {roll: '2d20kl1', string: '{{2d20kl1=1}}'};
        }

        return {roll: '1d20', string: ''};
    }

    static getInitiativeInfo(stats) {
        if (stats.isInitiative) {
            return '&{tracker}';
        }
        
        return '';
    }

    static getHasAttack(stats) {
        if (stats.attackDice || stats.attackModifier) {
            return '{{has_attack_damage=1}}';
        }

        return '';
    }

    static getPrimaryAttackDamage(stats) {
        if (stats.attackDice && stats.attackModifier) {
            return `{{attack_damage=[[${stats.attackDice}${stats.attackModifier}]]}}{{attack_damage_crit=[[${stats.attackDice}]]}}`;
        } else if (stats.attackDice) {
            return `{{attack_damage=[[${stats.attackDice}]]}}{{attack_damage_crit=[[${stats.attackDice}]]}}`;
        } else if (stats.attackModifier) {
            return `{{attack_damage=[[${stats.attackModifier}]]}}`;
        }

        return '';
    }

    static getPrimaryAttackDamageType(stats) {
        if (stats.attackType) {
            return `{{attack_damage_type=${stats.attackType}}}`;
        }

        return '';
    }

    static getSecondaryAttackDamage(stats) {
        if (stats.attackSecondaryDice && stats.attackSecondaryModifier) {
            return `{{attack_second_damage=[[${stats.attackSecondaryDice}${stats.attackSecondaryModifier}]]}}{{attack_second_damage_crit=[[${stats.attackSecondaryDice}]]}}`;
        } else if (stats.attackSecondaryDice) {
            return `{{attack_second_damage=[[${stats.attackSecondaryDice}]]}}{{attack_second_damage_crit=[[${stats.attackSecondaryDice}]]}}`;
        } else if (stats.attackSecondaryModifier) {
            return `{{attack_second_damage=[[${stats.attackSecondaryModifier}]]}}`;
        }

        return '';
    }

    static getSecondaryAttackDamageType(stats) {
        if (stats.attackSecondaryType) {
            return `{{attack_second_damage_type=${stats.attackSecondaryType}}}`;
        }

        return '';
    }

    static getSaveDC(stats) {
        if (stats.saveDC) {
            return `{{saving_throw_dc=${stats.saveDC}}}`;
        }

        return '';
    }

    static getSaveAbility(stats) {
        if (stats.saveAbility) {
            return `{{saving_throw_vs_ability=${stats.saveAbility.toUpperCase()}}}`;
        }

        return '';
    }

    static getSaveSuccess(stats) {
        if (stats.saveSuccess) {
            return `{{saving_throw_success=${stats.saveSuccess}}}`;
        }

        return '';
    }

    static getHasSaveFailureDamage(stats) {
        if (stats.saveFailureDice) {
            return '{{has_saving_throw_damage=1}}{{saving_throw_damage_macro=Saving throw failure:}}';
        }

        return '';
    }

    static getPrimarySaveFailure(stats) {
        if (stats.saveFailureDice && stats.saveFailureModifier) {
            return `{{saving_throw_damage=[[${stats.saveFailureDice}${stats.saveFailureModifier}]]}}`;
        } else if (stats.saveFailureDice) {
            return `{{saving_throw_damage=[[${stats.saveFailureDice}]]}}`;
        } else if (stats.saveFaiureModifier) {
            return `{{saving_throw_damage=[[${stats.saveFailureModifier}]]}}`;
        }

        return '';
    }

    static getPrimarySaveFailureType(stats) {
        if (stats.saveFailureDamageType) {
            return `{{saving_throw_damage_type=${stats.saveFailureDamageType}}}`;
        }

        return '';
    }

    static getSecondarySaveFailure(stats) {
        if (stats.saveFailureSecondaryDice && stats.saveFailureSecondaryModifier) {
            return `{{saving_throw_second_damage=[[${stats.saveFailureSecondaryDice}${stats.saveFailureSecondaryModifier}]]}}`;
        } else if (stats.saveFailureSecondaryDice) {
            return `{{saving_throw_second_damage=[[${stats.saveFailureSecondaryDice}]]}}`;
        } else if (stats.saveFailureSecondaryModifier) {
            return `{{saving_throw_second_damage=[[${stats.saveFailureSecondaryModifier}]]}}`;
        }

        return '';
    }

    static getSecondarySaveFailureType(stats) {
        if (stats.saveFailureSecondaryDamageType) {
            return `{{saving_throw_second_damage_type=${stats.saveFailureSecondaryDamageType}}}`;
        }

        return '';
    }

    static getHeal(stats) {
        if (stats.healDice && stats.healModifier) {
            return `{{heal=[[${stats.healDice}${stats.healModifier}]]}}`;
        } else if (stats.healDice) {
            return `{{heal=[[${stats.healDice}]]}}`;
        } else if (stats.healModifier) {
            return `{{heal=[[${stats.healModifier}]]}}`;
        }

        return '';
    }
}

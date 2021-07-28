class AbilityConverter {
    static shortToLong = {
        'str': 'strength',
        'dex': 'dexterity',
        'con': 'constitution',
        'int': 'intelligence',
        'wis': 'wisdom',
        'cha': 'charisma'
    }

    static longToShort = {
        'strength': 'str',
        'dexterity': 'dex',
        'constitution': 'con',
        'intelligence': 'int',
        'wisdom': 'wis',
        'charisma': 'cha'
    }

    static convertShortToLong(ability) {
        if (ability) {
            let long = AbilityConverter.shortToLong[ability.toLowerCase()];
    
            if (long) {
                long = long.upperCaseFirst();
            }

            return long || ability;
        }

        return ability;
    }

    static convertLongToShort(ability) {
        if (ability) {
            let short = AbilityConverter.longToShort[ability.toLowerCase()];

            if (short) {
                short = short.upperCaseFirst();
            }

            return short || ability;
        }

        return ability;
    }
}
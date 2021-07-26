class TemplateStats {
    advantage; // advantageStates
    gmroll; // boolean

    title; // string any
    subheader; // string any

    mainModifier; // string \+[0-9]+

    attackDice; // string [0-9]+d[0-9]+
    attackModifier; // string \+[0-9]+
    attackType; // string any

    attackSecondaryDice; // string [0-9]+d[0-9]+
    attackSecondaryModifier; // string \+[0-9]+
    attackSecondaryType; // string any

    saveDC; // number
    saveAbility; // string strength, dexterity, constitution, intelligence, wisdom, charisma
    saveSuccess; // string any

    saveFailureDice; // string [0-9]+d[0-9]+
    saveFailureModifier; // string \+[0-9]+
    saveFailureDamageType; // string any

    saveFailureSecondaryDice; // string [0-9]+d[0-9]+
    saveFailureSecondaryModifier; // string \+[0-9]+
    saveFailureSecondaryDamageType; // string any

    healDice; // string [0-9]+d[0-9]+
    healModifier; // string \+[0-9]+
}

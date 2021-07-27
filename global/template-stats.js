class TemplateStats {
    advantage; // advantageStates
    isGmroll; // boolean
    isInitiative; // boolean

    title; // string any
    subheader; // string any
    
    uses; // number
    maxUses; // number

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

    otherDice; // string [0-9]+d[0-9]+
    otherModifier; // string \+[0-9]+
    otherType; // string any

    otherSecondaryDice; // string [0-9]+d[0-9]+
    otherSecondaryModifier; // string \+[0-9]+
    otherSecondaryType; // string any

    healDice; // string [0-9]+d[0-9]+
    healModifier; // string \+[0-9]+
}

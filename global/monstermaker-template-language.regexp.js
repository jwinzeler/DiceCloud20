/**
 * Capture Groups:
 * 1: Dice
 * 2: Modifier: remove whitespace!
 */
const diceRegexp = /[0-9]+ \(([0-9]+d[0-9]+)( [+-] [0-9]+)?\)/

/**
 * Capture Groups:
 * 1, 2: diceRegexp groups
 * 3: Type
 */
const damageRegexp = new RegExp(`${diceRegexp.source} ([a-zA-Z]+) damage`);

/**
 * Capture Groups:
 * 1: mainModifier
 */
const mainModifierRegexp = /([+-][0-9]+) to hit[\.]?/i;

/**
 * Capture Groups:
 * 1, 2, 3: damageRegexp groups first damage
 * 5, 6, 7: damageRegexp groups second damage
 */
const attackRegexp = new RegExp(`hit: ${damageRegexp.source}( and ${damageRegexp.source})?[\.]?`, 'i');

/**
 * Capture Groups:
 * 1: saveDC
 * 2: saveAbility
 */
const saveRegexp = /DC ([0-9]+) ([a-z]+) saving throw[\.]?/i;

/**
 * Capture Groups:
 * 1: saveSuccess
 */
const saveSuccessRegexp = /success: ([^\.]+)\./i;

/**
 * Capture Groups:
 * 1, 2, 3: damageRegexp groups first damage
 * 5, 6, 7: damageRegexp groups second damage
 */
const saveFailureRegexp = new RegExp(`failure: ${damageRegexp.source}( and ${damageRegexp.source})?[\.]?`, 'i');

/**
 * Capture Groups:
 * 1: saveFailureExtra
 */
const saveFailureExtraRegexp = /failure text: ([^\.]+)\./i;

/**
 * Capture Groups:
 * 1, 2, 3: damageRegexp groups first damage
 * 5, 6, 7: damageRegexp groups second damage
 */
const otherRegexp = new RegExp(`other: ${damageRegexp.source}( and ${damageRegexp.source})?[\.]?`, 'i');

/**
 * Capture Groups:
 * 1, 2: diceRegexp groups
 */
const healRegexp = new RegExp(`regain ${diceRegexp.source} hitpoints[\.]?`, 'i');
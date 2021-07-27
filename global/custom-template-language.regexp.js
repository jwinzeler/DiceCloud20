/**
 * Matches to hit modifiers for attacks, for example:
 * +12
 * +5
 * +0
 * -1
 * Capture Groups:
 * 1: To hit modifier e.g. +5
 */
const modifierRegex = /([+-]\d+)/;

/**
 * Matches a save DC and ability, for example:
 * 13str
 * 5dex
 * 100con
 * Capture Groups:
 * 1: Save DC e.g. 15
 * 2: Save Abiltiy e.g. str, con, dex
 */
const saveDCRegex = /(\d+)([a-zA-Z]{3})/;

/**
 * Matches any combination of dice, modifiers and damage type, for example:
 * 2d6+5piercing
 * 2fire
 * 1d4slashing
 * 10d100
 * 1d4-3
 * Capture Groups:
 * 1: dice e.g. 2d6
 * 2: modifier e.g. +5, 10, -5
 * 3: type e.g. fire, piercing, banana
 */
const damageRegex = /(\d+d\d+)*([+-]?\d+)*([a-z]*)/;

/**
 * Matches an entire attack roll, for example:
 * [modifierRegex:damageRegex:damageRegex]
 * [modifierRegex:damageRegex]
 * [modifierRegex]
 * [modifierRegex:]
 * [modifierRegex::]
 * Capture Groups:
 * 1: modifierRegex group
 * 2: first damage string
 * 3, 4, 5: damageRegex groups for first damage
 * 6: second damage string
 * 7, 8, 9: damageRegex groups for second damage
 */
const attackRegex = new RegExp(`\\[${modifierRegex.source}(:${damageRegex.source})?(:${damageRegex.source})?\\]`);

/**
 * Matches an entire save roll, for example:
 * [saveDCRegex:damageRegex:damageRegex?Anything to be displayed on save success]
 * [saveDCRegex:damageRegex:damageRegex]
 * [saveDCRegex:damageRegex?Anything to be displayed on save success]
 * [saveDCRegex:damageRegex]
 * [saveDCRegex?Anything to be displayed on save success]
 * [saveDCRegex]
 * [saveDCRegex:]
 * [saveDCRegex::]
 * Capture Groups:
 * 1, 2: saveDCRegex groups
 * 3: first damage string
 * 4, 5, 6 damageRegex groups for first damage
 * 7: second damage string
 * 8, 9, 10: damageRegex groups for second damage
 * 11: save success string
 * 12: save success
 */
const saveRegex = new RegExp(`\\[${saveDCRegex.source}(:${damageRegex.source})?(:${damageRegex.source})?(\\?([^\\]]+))?\\]`);

/**
 * Matches an entire heal roll, for example:
 * [Heal:2d6+5]
 * [heal:2]
 * [heal:1d4]
 * [Heal:10d100]
 * [Heal:1d4-3]
 * Capture Groups:
 * 1: dice e.g. 2d6
 * 2: modifier e.g. +5, 10, -5
 */
const healRegex = /\[[hH]eal:(\d+d\d+)*([+-]?\d+)*\]/;

/**
 * Matches any extra damage that does not require a hit or save, for example:
 * [damageRegex:damageRegex]
 * [damageRegex]
 * Capture Groups:
 * 1: first damage string
 * 2, 3, 4: damageRegex groups for first damage
 * 5: second damage string
 * 6, 7, 8: damageRegex groups for second damage
 */
const fixedRegex = new RegExp(`\\[(${damageRegex.source})+(:${damageRegex.source})?\\]`);

/**
 * Matches any text inside brackets, for example:
 * [Hey, I'm a piece of text!]
 * Capture Groups:
 * 1: Text inside brackets
 */
const subheaderRegex = /\[([^\]]+)\]/;

/**
 * Matches an entire action, for example:
 * [attackRegex][saveRegex]
 * [attackRegex]
 * [saveRegex]
 * Capture Groups:
 * 1: attackRegex string
 * 2, 3, 4, 5, 6, 7, 8, 9, 10: attackRegex groups
 * 11: saveRegex string
 * 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23: saveRegex groups
 * 24: healRegex string
 * 25, 26: healRegex groups
 * 27: fixedRegex string
 * 28, 29, 30, 31, 32, 33, 34, 35: fixedRegex groups
 * 36: subheaderRegex string
 * 37: subheaderRegex group
 */
const actionRegex = new RegExp(`(${attackRegex.source})?(${saveRegex.source})?(${healRegex.source})?(${fixedRegex.source})?(${subheaderRegex.source})?`);

var scales = require('./dict/scales.json')
var aliases = require('./dict/aliases.json')
var dictionary = require('./dictionary')

/**
 * Build a scale using a name and a tonic
 *
 * It uses a dictionary of scales (see dict directory)
 *
 * Can be partially applied (see example)
 *
 * @name fromName
 * @function
 * @param {String} name - the name of the scale
 * @param {String|Array} tonic - the tonic of the scale
 *
 * @example
 * scale.fromName('bebop locrian', 'C') // => [ 'C', 'Db', 'Eb', 'F', 'Gb', 'G', 'Ab', 'Bb' ]
 * var kumoi = scale.fromName('kumoi')
 * kumoi('G') // => ['G', 'A', 'Bb', 'D', 'E']
 */
module.exports = dictionary(scales, aliases)

'use strict'

var scales = require('./dict/scales.json')
var aliases = require('./dict/aliases.json')

/**
 * Get all scale names available
 *
 * @name names
 * @function
 * @param {Boolean} withAliases - set to `true` to get aliases names
 * @return {Array<String>} the list of all scale names
 *
 * @example
 * scale.names() // => ['major', 'minor', ...]
 */
module.exports = function (withAliases) {
  var names = Object.keys(scales)
  return withAliases ? names.concat(Object.keys(aliases)) : names
}

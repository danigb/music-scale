'use strict'

var scales = require('./dict/scales.json')
var aliases = require('./dict/aliases.json')

function names (withAliases) {
  var names = Object.keys(scales)
  return withAliases ? names.concat(Object.keys(aliases)) : names
}

module.exports = names

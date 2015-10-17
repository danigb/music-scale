'use strict'

var curry = require('curry')
var pitchSet = require('./pitchSet')
var transpose = require('pitch-transpose')

function mapValues (hash, fn) {
  return Object.keys(hash).reduce(function (data, name) {
    data[name] = fn(hash[name])
    return data
  }, {})
}

/**
 * Create a scale builder function from a hash of data
 *
 * A scale builder is a function that given a names and a tonic, returns
 * a scale (array). It can be partially applied.
 *
 * @param {Hash} data - the data (maps names to intervals or notes)
 * @param {Hash} aliases - (Optional) maps names to names in the data hash
 * @return {Function} a function to create scales
 *
 * @example
 * var scales = dictionary({ major: '1 2 3 4 5 6 7', minor: '1 2 3b 4 5 6b 7b' }, {eolian: 'minor'})
 * scales('major', 'C') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
 * scales('aeolian', 'A') // => ['A', 'B', 'C', 'D', 'E', 'F', 'G']
 * var minor = scales('minor')
 * minor('D') // => ['D', 'E', 'F', 'G', 'A', 'Bb', 'C']
 */
function dictionary (hash, alias) {
  var data = mapValues(hash, function (src) {
    return pitchSet(src)
  })
  alias = alias || {}

  return curry(function (name, tonic) {
    var intervals = data[name] || data[alias[name]] || []
    return intervals.map(transpose(tonic))
  })
}

module.exports = dictionary

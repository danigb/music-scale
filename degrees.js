'use strict'

var gamut = require('./gamut')
var scale = require('./scale')

function find (pitchNum, array) {
  for (var i = 0, len = array.length; i < len; i++) {
    if (array[i][0] === pitchNum) return array[i]
  }
  return null
}

/**
 * Get the degrees of a scale
 *
 * The resulting array will contain the notes in the same order as degrees.
 * If a given degree is not present in the scale, the result will contain a
 * null in that position.
 *
 * @param {Array|String} degrees - the degrees numbers
 * @param {Array|String} notes - the scale notes
 * @return {Array} the notes of the given degrees (or null if not present)
 *
 * @example
 * scale.degrees('1 3 5', 'C D E F G A B') // => [ 'C', 'E', 'G' ]
 * scale.degrees('1 5 2 6', 'C D E F G A B') // => [ 'C', 'G', 'D', 'A' ]
 * scale.degrees('1 2 6', 'C D E F G') // => [ 'C', 'D', null ]
 */
function degrees (degrees, notes) {
  var tonic = gamut.asArray(notes)[0]
  var set = gamut.set(notes)
  var numbers = gamut.asArray(degrees).map(function (i) { return +i - 1 })
  var selected = numbers.map(function (num) {
    return find(num, set)
  })
  return scale(selected, tonic)
}

module.exports = degrees

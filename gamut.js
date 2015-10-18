'use strict'

var asPitch = require('pitch-parser')
var asInterval = require('interval-parser')
var operator = require('pitch-op')

// separator pattern to convert a list string to an array
var SEP = /\s*\|\s*|\s*,\s*|\s+/
var isArray = Array.isArray
function asPitchArray (i) { return isArray(i) ? i : (asPitch(i) || asInterval(i)) }
function semitones (i) { return i[0] + i[1] + 12 * i[2] }
function comparator (a, b) { return semitones(a) - semitones(b) }

/**
 * Gamut
 */
function gamut (operations, source) {
  if (arguments.length > 1) return gamut(operations)(source)

  var ops = operations.reverse()
  var len = ops.length
  return function (value) {
    var arr = asArray(value)
    for (var i = 0; i < len; i++) {
      arr = ops[i].call(null, arr)
    }
    return arr
  }
}

/**
 * Get an array from a source. The source can be a string separated by
 * spaces, commas or bars (`|`), an array or an object.
 *
 * This function does not perform any transformation to the items of the array.
 * This function __always__ return an array, even if its empty
 *
 * @param {String|Array|Object} source - the source
 * @return {Array} the source converted to an array
 *
 * @example
 * gamut.asArray('c d e') // => [ 'c', 'd', 'e' ]
 * gamut.asArray('CMaj7 | Dm7 G7') // => [ 'CMaj7', 'Dm7', 'G7' ]
 * gamut.asArray('1, 2, 3') // => ['1', '2', '3']
 * gamut.asArray([1, 'a', 3]) // => [1, 'a', 3]
 * gamut.asArray(object) // => [ object ]
 * gamut.asArray(null) // => [ ]
 */
function asArray (source) {
  if (isArray(source)) return source
  else if (typeof source === 'string') return source.split(SEP)
  else return [ source ]
}
gamut.asArray = asArray

/**
 * Get a gamut mapped to a function
 *
 * Is important to notice that the function will receive pitches in a-pitch format.
 *
 * This function can be partially applied
 *
 * @param {Function} fn - the function to map the gamut with
 * @param {String|Array} source - the gamut
 * @return {Array} the mapped gamut
 *
 * @example
 * var addOctave = function(p) { return [p[0], p[1], p[2] + 1]}
 * gamut.map(addOctave, [ [0, 0, 0], [1, 0, 0] ]) // => [ [0, 0, 1], [1, 0, 1]]
 * var octaveUp = gamut.map(addOctave)
 * octaveUp([ [0, 0, 0], [1, 0, 0] ]) // => [ [0, 0, 1], [1, 0, 1]]
 */
function map (fn, src) {
  if (arguments.length > 1) return map(fn)(src)
  return function (src) { return gamut.asArray(src).map(fn) }
}
gamut.map = map

/**
 * Convert a list of notes or intervals to a-pitch format
 *
 * @param {String|Array} source - the gamut
 * @return {Array} the gamut with notes or intervals in a-pitch format
 *
 * @example
 * gamut.parse('C D E') // => [ [0, 0, null], [1, 0, null], [2, 0, null] ]
 * gamut.parse('1P 3M 5P') // => [ [0, 0, 0], [2, 0, 0], [4, 0, 0] ]
 */
function parse (source) {
  return gamut.asArray(source).map(asPitchArray)
}
gamut.parse = parse

function decorate (builder, parser, fn) {
  return function () {
    var len = arguments.length
    if (len === 0) return []
    var args = Array.prototype.slice.call(arguments)
    args[len - 1] = parser(args[len - 1])
    return builder(fn.apply(null, args))
  }
}

var toNotes = map(function (p) { return typeof p === 'string' ? p : asPitch(p) })
/**
 * Get notes from a gamut, or decorate a function to return notes
 *
 * @example
 * gamut.notes('1P 2M 3M') // => ['C0', 'D0', 'E0']
 * var transpose = gamut.notes(gamut.add)
 * transpose('2M', 'C D E') // => [ 'D', 'E', 'F#' ]
 */
function notes (src) {
  return typeof src === 'function' ? decorate(toNotes, parse, src) : toNotes(parse(src))
}
gamut.notes = notes

var toIntervals = map(function (i) { return typeof i === 'string' ? i : asInterval(i) })
/**
 * Get the gamut as intervals or decorate a function to return intervals
 *
 * @example
 * gamut.intervals('C D E') // => []
 * var addIntervals = gamut.intervals(gamut.add)
 * addIntervals('2M', '1P 5P') // => ['2M', '6M']
 */
function intervals (src) {
  return typeof src === 'function' ? decorate(toIntervals, parse, src) : toIntervals(parse(src))
}
gamut.intervals = intervals

var toPitchClasses = map(function (p) { return [p[0], p[1], null] })
/**
 * Get the pitch classes of a gamut
 *
 */
function pitchClass (src) {
  if (typeof src !== 'function') return toNotes(toPitchClasses(parse(src)))
}
gamut.pitchClass = pitchClass

/**
 * Add interval to a gamut
 *
 * Like all the functions from gamut, this works with a-pitch format arrays.
 * Probably you will want to decorate this function with `gamut.notes` or
 * `gamut.intervals` (see example)
 *
 * @name add
 * @param {String} interval - the interval to add
 * @param {String|Array} source - the gamut
 * @return {Array} the gamut added an interval
 *
 * @example
 * gamut.add([1, 0, 0], [ [1, 0, 0], [2, 0, 0]]) // => [ [2, 0, 0], [3, 1, 0] ]
 * var transpose = gamut.notes(gamut.add)
 * transpose('2M', 'C D E') // => [ 'D', 'E', 'F#' ]
 * var addIntervals = gamut.intevals(gamut.add)
 * addIntervals('2M', '1P 2M 3M') // => [ '2M', '3M', '4A' ]
 */
function add (interval, source) {
  var i = asPitchArray(interval)
  return source.map(function (pitch) {
    return pitch ? operator.add(pitch, i) : null
  })
}
gamut.add = add

// simplify a list of intervals
var simplify = map(function (i) { return i ? [i[0], i[1], 0] : null })
// set all intervals relative to first
function normalize (arr) {
  var first = [arr[0][0], arr[0][1], null]
  return arr.map(function (i) { return i ? operator.subtract(first, i) : null })
}
/**
 * Get a set
 */
function set (source) {
  return simplify(normalize(parse(source)))
}
gamut.set = set

module.exports = gamut

'use strict'

var isArray = Array.isArray
var asPitch = require('pitch-parser')
var asInterval = require('interval-parser')
var transpose = require('pitch-transpose')
var op = require('pitch-op')
var curry = require('curry')

function parse (i) { return isArray(i) ? i : (asPitch.parse(i) || asInterval.parse(i)) }
function simplify (i) { return [i[0], i[1], 0] }
function normalize (arr) {
  var first = [arr[0][0], arr[0][1], null]
  return arr.map(function (i) { return op.subtract(first, i) })
}

/**
 * Build a scale from a source and a tonic
 *
 * A source can be a list of intervals or notes. The tonic must be
 * a pitch (with or without octave)
 *
 * This function is currified, so you can partially apply the function passing
 * one parameter instead of two
 *
 * @param {Array} source - the list of intervals or notes
 * @param {String} tonic - the tonic of the scale
 * @return {Array} the list of notes
 *
 * @example
 * scale('1 2 3 5 6', 'G') // => ['G', 'A', 'B', 'D', 'E']
 * var dorian = scale('D E F G A B C')
 * dorian('C4')
 */
function scale (src, tonic) {
  var array
  if (isArray(src)) array = src
  else if (typeof src === 'string') array = src.split(/\s+/)
  else return null
  if (array.length === 0) return []

  var simplified = array.map(parse).map(simplify)
  var normalized = simplified[0][0] > 0 ? normalize(simplified) : simplified
  return normalized.map(transpose(tonic))
}

/**
 * Build a scale using a name from a dictionary
 *
 * Normally you'll want to use this function partially applied (see example)
 *
 * @param {Hash} dictionary - a dictionary to map names to intervals (or notes)
 * @param {Hash} aliases - an (optional, can be null) dictionary that maps names to names
 * @param {String} name - the scale name you want to build
 * @param {String} tonic - the scale tonic
 *
 * @example
 * var data = require('music-scale/scales.json')
 * var aliases = require('music-scale/aliases.json')
 * var scales = scale.fromName(data, aliases)
 * scales('kumoi', 'G') // => ['G', 'A', 'Bb', 'D', 'E']
 */
function fromName (dictionary, alias, name, tonic) {
  alias = alias || []
  var ivls = dictionary[name] || dictionary[alias[name]]
  if (!ivls) return null
  return scale(ivls, tonic)
}

scale.fromName = curry(fromName)

var lib = curry(scale)
lib.fromName = curry(fromName)
module.exports = lib

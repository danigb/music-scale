'use strict'

var asPitch = require('pitch-parser')
var asInterval = require('interval-parser')
var op = require('pitch-op')
var isArray = Array.isArray

function parse (i) { return isArray(i) ? i : (asPitch.parse(i) || asInterval.parse(i)) }
function simplify (i) { return i ? [i[0], i[1], 0] : null }
function normalize (arr) {
  var first = [arr[0][0], arr[0][1], null]
  return arr.map(function (i) { return op.subtract(first, i) })
}

/*
 * Get a pitch set from a list of notes or intervals
 * @api private
 */
function pitchSet (src) {
  var array
  if (isArray(src)) array = src
  else if (typeof src === 'string') array = src.split(/\s+/)
  else return null
  if (array.length === 0) return []

  var simplified = array.map(parse).map(simplify)
  var normalized = simplified[0][0] > 0 ? normalize(simplified) : simplified
  return normalized
}

module.exports = pitchSet

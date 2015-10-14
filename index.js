'use strict'

var isArray = Array.isArray
var asPitch = require('pitch-parser')
var asInterval = require('interval-parser')
var transpose = require('pitch-transpose')

function parse (i) { return isArray(i) ? i : (asPitch.parse(i) || asInterval.parse(i)) }
function simplify (i) { return [i[0], i[1], 0] }

/**
 * Build a scale
 */
function scale (src, tonic) {
  src = isArray(src) ? src : src.split(' ')
  var pc = src.map(parse).map(simplify)
  return pc.map(transpose(tonic))
}

function curry (fn) {
  return function (s, t) {
    switch (arguments.length) {
      case 0: return curry(fn)
      case 1: return function (t) { return scale(s, t) }
      default: return fn(s, t)
    }
  }
}

module.exports = curry(scale)

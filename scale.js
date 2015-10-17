'use strict'

var curry = require('curry')
var transpose = require('pitch-transpose')
var pitchSet = require('./pitchSet')

/**
 * Build a scale from a source and a tonic
 *
 * A source can be a list of intervals or notes. The tonic must be
 * a pitch (with or without octave)
 *
 * This function is currified, so you can partially apply the function passing
 * one parameter instead of two (see example)
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
  return pitchSet(src).map(transpose(tonic))
}

module.exports = curry(scale)

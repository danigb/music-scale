'use strict'

var curry = require('curry')
var gamut = require('music-gamut')
var transpose = gamut.asNotes(gamut.add)

/**
 * Build a scale from a source and a tonic. A scale is an array of notes (or
 * intervals if tonic is null) ordered by frequency
 *
 * A source can be a list of intervals or notes. The tonic must be
 * a pitch (with or without octave) or null to get the scale intervals
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
  var intervals = gamut.set(src)
  return tonic ? transpose(tonic, intervals) : gamut.asIntervals(intervals)
}

module.exports = curry(scale)

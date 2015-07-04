'use strict'

function Chromatic (root, octave, length, descending) {
  if (!root) throw Error('Give me a root, please')
  root = root.charAt(0).toUpperCase() + root.slice(1).toLowerCase()
  length = length || 12
  descending = descending === true ? 1 : 0
  return Chromatic.SCALES.reduce(function (all, notes) {
    var scale = find(root, notes)
    if (scale) all.push(octavize(forceLength(reverse(scale, descending), length), octave))
    return all
  }, [])
}

Chromatic.SCALES = [
  'C Db D Eb E F Gb G Ab A Bb B'.split(' '),
  'Cb Dbb Db Ebb Eb Fb Gbb Gb Abb Ab Bbb Bb'.split(' '),
  'C C# D D# E F F# G G# A A# B'.split(' '),
  'C# C## D# D## E# F# F## G# G## A# A## B#'.split(' ')
]

Chromatic.NAMES = (function () {
  var names = []
  Chromatic.SCALES.forEach(function (scale) {
    scale.forEach(function (note) {
      if (names.indexOf(note) === -1) names.push(note)
    })
  })
  return names
})().sort()

function find (root, notes) {
  var index = notes.indexOf(root)
  return index < 0 ? null : rotate(notes, index)
}

function reverse (scale, reverse) {
  return reverse ? rotate(scale.reverse(), scale.length - 1) : scale
}

function octavize (scale, octave) {
  if (!octave) return scale
  octave = +octave
  return scale.map(function (note, index) {
    if (index !== 0 && note[0] === 'C' && scale[index - 1][0] !== 'C') octave++
    return note + octave
  })
}

function forceLength (scale, length) {
  var original = scale.length
  var result = []
  for (var i = 0; i < length; i++) {
    result.push(scale[i % original])
  }
  return result
}

function rotate (arr, positions) {
  return arr.slice(positions, 12).concat(arr.slice(0, positions))
}

module.exports = Chromatic

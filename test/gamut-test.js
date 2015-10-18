var vows = require('vows')
var assert = require('assert')
var gamut = require('../gamut')

vows.describe('gamut').addBatch({
  'map': function () {
    var addOctave = function (p) { return [p[0], p[1], p[2] + 1] }
    var src = [ [0, 0, 0], [1, 0, 0] ]
    assert.deepEqual(gamut.map(addOctave, src), [ [ 0, 0, 1 ], [ 1, 0, 1 ] ])
    var octaveUp = gamut.map(addOctave)
    assert.deepEqual(octaveUp(src), [ [ 0, 0, 1 ], [ 1, 0, 1 ] ])
  },
  'add': function () {
    var src = [ [0, 0, 0], [1, 0, 0], [2, 0, 0] ]
    assert.deepEqual(gamut.add('2M', src), [ [ 1, 0, 0 ], [ 2, 0, 0 ], [ 3, 1, 0 ] ])
  },
  'notes': function () {
    var transpose = gamut.notes(gamut.add)
    assert.deepEqual(transpose('2M', 'C D E'), [ 'D', 'E', 'F#' ])
  },
  'set': {
    'set to octave 0': function () {
      assert.deepEqual(gamut.notes(gamut.set('1 2 3')), ['C0', 'D0', 'E0'])
      assert.deepEqual(gamut.notes(gamut.set('8 9 10')), ['C0', 'D0', 'E0'])
      assert.deepEqual(gamut.notes(gamut.set('C2 D3 E4')), ['C0', 'D0', 'E0'])
    },
    'remove duplicates': function () {
      assert.deepEqual(gamut.notes(gamut.set('1 1 2 2 3 3')), ['C0', 'D0', 'E0'])
    },
    'order by frequency': function () {
      assert.deepEqual(gamut.notes(gamut.set('1 3 2')), ['C0', 'D0', 'E0'])
    }
  },
  'classes': {
    'get pitch classes': function () {
      assert.deepEqual(gamut.pitchClass('C2 D3 E4 C5'), ['C', 'D', 'E', 'C'])
    }
  },
  'intervals': {
    'decorate function': function () {
      var add = gamut.intervals(gamut.add)
      assert.deepEqual(add('2M', 'C D E'), [ '2M', '3M', '4A' ])
    },
    'get intervals': function () {
      assert.deepEqual(gamut.intervals('C D E'), [ '1P', '2M', '3M' ])
    }
  },
  'uniq': {
    'remove duplicates': function () {
      assert.deepEqual(gamut.notes(gamut.uniq('C D C e g d c c4')), ['C', 'D', 'E', 'G', 'C4'])
    }
  }
}).export(module)

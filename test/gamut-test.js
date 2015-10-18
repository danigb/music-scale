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
    'intervalSet': function () {
      assert.deepEqual(gamut.intervals(gamut.set('C2 D3 E4')), ['1P', '2M', '3M'])
    },
    'pitchSet': function () {
      assert.deepEqual(gamut.pitchClass(gamut.set('C2 D3 E4')), ['C', 'D', 'E'])
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
  }
}).export(module)

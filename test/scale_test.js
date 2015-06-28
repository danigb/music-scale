var vows = require('vows')
var assert = require('assert')
var Scale = require('../')

vows.describe('Binary Scales').addBatch({
  'constructor': {
    'name': function () {
      var s = new Scale('major')
      assert.equal(s.decimal, 2773)
      assert.equal(s.binary, '101011010101')
    },
    'binary string': function () {
      var s = new Scale('101011010101')
      assert.equal(s.decimal, 2773)
      assert.equal(s.binary, '101011010101')
    },
    'integer': function () {
      var s = new Scale(2773)
      assert.equal(s.decimal, 2773)
      assert.equal(s.binary, '101011010101')
    }
  },

  'rotations': {
    topic: function () { return new Scale('1100') },

    'rotations': function (s) {
      var rotations = s.rotations()
      assert.equal(rotations.length, 2)
      assert.deepEqual(rotations, ['1100', '1001'])
    },
    'rotate': function (s) {
      assert.equal(s.rotate(0).binary, '1100')
      assert.equal(s.rotate(1).binary, '1001')
    },

    'major scale rotations': function () {
      var major = new Scale(2773)
      assert.equal(major.rotations().length, 7)
      assert.deepEqual(major.rotations(), [
        '101011010101', // ionian
        '101101010110', // dorian
        '110101011010', // phrygian
        '101010110101', // lydian
        '101011010110', // mixolydian
        '101101011010', // aeolian
        '110101101010'  // locrian
      ])
    }

  },

  'coscale': function () {
    var major = new Scale(2773)
    assert.equal(major.coscale().binary, '101001010100')
  },

  'reflection': function () {
    var major = new Scale(2773)
    assert.equal(major.reflection().binary, '101010110101')
  },

  'intervals': {
    'major': function () {
      var s = new Scale(2773)
      assert.deepEqual(s.intervals(), ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'])
    }
  }
}).export(module)

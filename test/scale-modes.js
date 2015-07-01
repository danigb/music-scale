var vows = require('vows')
var assert = require('assert')
var Scale = require('../')

vows.describe('Scale modes').addBatch({
  'basic rotation': {
    topic: function () { return new Scale('1100') },

    'modes': function (s) {
      var modes = new Scale('1100').modes()
      assert.equal(modes.length, 2)
      assert.deepEqual(modes, ['1100', '1001'])
    },

    'mode': function (s) {
      assert.equal(s.mode(1).binary, '1100')
      assert.equal(s.mode(2).binary, '1001')
    }
  },

  'major scale modes': function () {
    var major = new Scale(2773)
    assert.equal(major.modes().length, 7)
    assert.deepEqual(major.modes(), [
      '101011010101', // ionian
      '101101010110', // dorian
      '110101011010', // phrygian
      '101010110101', // lydian
      '101011010110', // mixolydian
      '101101011010', // aeolian
      '110101101010'  // locrian
    ])
  }
}).export(module)

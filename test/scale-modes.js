var vows = require('vows')
var assert = require('assert')
var Scale = require('../')

function binaryOf (scale) { return scale.binary }

vows.describe('Scale modes').addBatch({
  'basic rotation': {
    topic: function () { return new Scale('110000000000') },

    'modes': function (s) {
      var modes = s.modes().map(binaryOf)
      assert.equal(modes.length, 2)
      assert.deepEqual(modes, ['110000000000', '100000000001'])
    },

    'mode': function (s) {
      assert.equal(s.mode(1).binary, '110000000000')
      assert.equal(s.mode(2).binary, '100000000001')
    }
  },

  'is mode of': function () {
    var scale = new Scale(2773)
    scale.modes().forEach(function (mode) {
      assert.equal(scale.isModeOf(mode), true)
    })
    assert.equal(scale.isModeOf(new Scale(2902)), true) // dorian
    assert.equal(scale.isModeOf(new Scale(2901)), false) // melodic minor
  },

  'cannonical mode': function () {
    var scale = new Scale(2773)
    assert.equal(scale.cannonicalMode().decimal, 2741) // lydian
  },

  'major scale modes': function () {
    var modes = new Scale(2773).modes().map(binaryOf)
    assert.equal(modes.length, 7)
    assert.deepEqual(modes, [
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

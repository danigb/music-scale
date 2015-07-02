var vows = require('vows')
var assert = require('assert')
var Scale = require('../common.js')

function binaryOf (scale) { return scale.binary }

vows.describe('Scale modes').addBatch({
  'basic rotation': {
    topic: function () { return Scale.get('110000000000') },

    'modes': function (s) {
      var modes = s.modes().map(binaryOf)
      assert.equal(modes.length, 2)
      assert.deepEqual(modes, ['110000000000', '100000000001'])
    },

    'mode': function (s) {
      assert.equal(s.mode(1).binary, '110000000000')
      assert(s.mode(1) === s, 'is the same!')
      assert.equal(s.mode(2).binary, '100000000001')
    }
  },

  'is mode of': function () {
    var scale = Scale.get('major')
    scale.modes().forEach(function (mode) {
      assert.equal(scale.isModeOf(mode), true)
    })
    assert.equal(scale.isModeOf(Scale.get(2902)), true) // dorian
    assert.equal(scale.isModeOf(Scale.get(2901)), false) // melodic minor
  },

  'cannonical mode': function () {
    var scale = Scale.get('major')
    assert.equal(scale.cannonicalMode().decimal, 2741) // lydian
  },

  'major scale modes': function () {
    var s = Scale.get('major')
    var modes = s.modes()
    assert.equal(modes.length, 7)
    assert.equal(modes[0].name(), 'major')
    assert.equal(modes[1].name(), 'dorian')
    assert.equal(modes[2].name(), 'phrygian')
    assert.equal(modes[3].name(), 'lydian')
    assert.equal(modes[4].name(), 'mixolydian')
    assert.equal(modes[5].name(), 'aeolian')
    assert.equal(modes[6].name(), 'locrian')
  }
}).export(module)

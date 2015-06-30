var vows = require('vows')
var assert = require('assert')
var Scale = require('../')

Scale.use(require('../lib/scales.json'))

vows.describe('Scale names').addBatch({
  'basic scales': {
    'major': function () {
      var s = new Scale('major')
      assert.equal(s.decimal, 2773)
      assert.equal(s.binary, '101011010101')
      assert.equal(s.name(), 'major')
    },
    'melodic minor': function () {
      var s = new Scale('melodic')
      assert.equal(s.decimal, 2901)
      assert.equal(s.binary, '101101010101')
      assert.equal(s.name(), 'melodic')
    },
    'harmonic minor': function () {
      var s = new Scale('harmonic')
      assert.equal(s.decimal, 2905)
      assert.equal(s.binary, '101101011001')
      assert.equal(s.name(), 'harmonic')
    }
  },
  'modes': {
    'major': function () {
      var s = new Scale('major')
      var names = s.modes().map(function (scale) { return new Scale(scale).name() })
      assert.deepEqual(names, ['major', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'])
    },
    'melodic minor': function () {
      var s = new Scale('melodic minor')
      var names = s.modes().map(function (scale) { return new Scale(scale).name() })
      assert.deepEqual(names, ['melodic minor', 'melodic minor second mode', 'lydian augmented', 'lydian dominant',
        'melodic minor fifth mode', 'locrian #2', 'altered'])
    },
    'harmonic minor': function () {
      var s = new Scale('harmonic minor')
      var names = s.modes().map(function (scale) { return new Scale(scale).name() })
      assert.deepEqual(names, ['harmonic minor', 'locrian 6', 'ionian augmented',
        'dorian #4', 'phrygian major', 'lydian #2', 'super locrian bb7'])
    }
  }
}).export(module)

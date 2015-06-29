var vows = require('vows')
var assert = require('assert')
var Scale = require('../')

Scale.use(require('../scales.json'))

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
  }
}).export(module)

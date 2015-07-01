var vows = require('vows')
var assert = require('assert')
var Scale = require('../')

Scale.use(Scale.basicNames)

vows.describe('Scale names').addBatch({
  'create scales': {
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
  'name method': {
    'name present': function () {
      assert.equal(Scale(2773).name(), 'major')
      assert.equal(Scale(2901).name(), 'melodic minor')
      assert.equal(Scale(2905).name(), 'harmonic minor')
    },
    'name unknown': function () {
      assert.equal(Scale('100000000001').name(), '')
    }
  }
}).export(module)

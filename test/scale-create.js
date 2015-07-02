var vows = require('vows')
var assert = require('assert')
var Scale = require('../')

vows.describe('Scale creation').addBatch({
  'Scale.get': {
    'get by number': function () {
      var s = Scale.get(2773)
      assert.equal(s.decimal, 2773)
      assert.equal(s.binary, '101011010101')
    },
    'same instances': function () {
      var s1 = Scale.get(2773)
      var s2 = Scale.get(2773)
      assert(s1 === s2)
    },
    'binary string': function () {
      var s = Scale.get('101011010101')
      assert.equal(s.decimal, 2773)
      assert.equal(s.binary, '101011010101')
    },
    'scale name': function () {
      var s = Scale.get('major')
      assert.equal(s.decimal, 2773)
    }
  },
  'Constructor': {
    'validation': {
      'must have 12 digits': function () {
        var error = function () { return new Scale(Scale.MIN - 1) }
        assert.throws(error, /number not valid/)
      },
      'should have root': function () {
        var error = function () { return new Scale(Scale.MAX + 1) }
        assert.throws(error, /number not valid/)
      }
    },
    'can give names to a scale': {
      'custom names': function () {
        assert.equal(new Scale(2773, ['my scale']).name(), 'my scale')
      },
      'multiple names': function () {
        var s = new Scale(2773, ['blah', 'ionian', 'major'])
        assert.equal(s.name(), 'blah')
        assert.deepEqual(s.names(), ['blah', 'ionian', 'major'])
      }
    },
    'integer': function () {
      var s = new Scale(2773)
      assert.equal(s.decimal, 2773)
      assert.equal(s.binary, '101011010101')
    }
  }
}).export(module)

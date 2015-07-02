var vows = require('vows')
var assert = require('assert')
var Scale = require('../')

vows.describe('Scale numbers').addBatch({
  'scale from numbers': {
    'commonest scales': function () {
      assert.equal(Scale.fromNumbers([1, 2, 3, 5, 6]).binary, '101010010100')
      assert.equal(Scale.fromNumbers([1, 'b3', 4, 5, 'b7', 7]).binary, '100101010011')
    }
  },
  'scale numbers': {
    'major mode': function () {
      var major = Scale.get(2773)
      assert.deepEqual(major.numbers(), ['1', '2', '3', '4', '5', '6', '7'])
    }
  }
}).export(module)

var vows = require('vows')
var assert = require('assert')
var scale = require('../')

vows.describe('scale').addBatch({
  'build scale': {
    'build scale from intervals': function () {
      assert.deepEqual(scale('1 2 3 4', 'C'), ['C', 'D', 'E', 'F'])
    },
    'build scale from notes': function () {
      assert.deepEqual(scale('C2 D E F G A B', 'D5'))
    },
    'partial scale': function () {
      var major = scale('1 3 5')
      assert.deepEqual(major('D'), ['D', 'F#', 'A'])
    }
  }
}).export(module)

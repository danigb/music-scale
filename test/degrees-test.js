var vows = require('vows')
var assert = require('assert')
var degrees = require('../degrees')

vows.describe('degrees').addBatch({
  'get specified only': function () {
    assert.deepEqual(degrees('1 3 5', 'C D E F G A B'), [ 'C', 'E', 'G' ])
    assert.deepEqual(degrees('1 3 6', 'C D E F G B'), [ 'C', 'E', null ])
  },
  'different order': function () {
    assert.deepEqual(degrees('1 5 3', 'C D E F G A B'), [ 'C', 'G', 'E' ])
    assert.deepEqual(degrees('1 5 2 6', 'C D E F G A B'), [ 'C', 'G', 'D', 'A' ])
  }
}).export(module)

var vows = require('vows')
var assert = require('assert')
var fromName = require('../fromName')

vows.describe('fromName').addBatch({
  'all scales': function () {
    assert.deepEqual(fromName('bebop locrian', 'C'), [ 'C', 'Db', 'Eb', 'F', 'Gb', 'G', 'Ab', 'Bb' ])
  },
  'parially applied': function () {
    var kumoi = fromName('kumoi')
    assert.deepEqual(kumoi('G'), ['G', 'A', 'Bb', 'D', 'E'])
  }
}).export(module)

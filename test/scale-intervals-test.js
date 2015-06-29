var vows = require('vows')
var assert = require('assert')
var Scale = require('../')

vows.describe('Scale intervals').addBatch({
  'major': function () {
    var s = new Scale(2773)
    assert.deepEqual(s.intervals(), ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'])
  }
}).export(module)

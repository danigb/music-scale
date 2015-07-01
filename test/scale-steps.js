var vows = require('vows')
var assert = require('assert')
var Scale = require('../')

vows.describe('Scale steps').addBatch({
  'get scale steps': function () {
    var s = new Scale(2773)
    assert.deepEqual(s.steps(), [2, 2, 1, 2, 2, 2, 1])
  }
}).export(module)

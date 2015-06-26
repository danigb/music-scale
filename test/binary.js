var vows = require('vows')
var assert = require('assert')
var escalas = require('../')

vows.describe('Binary Scales').addBatch({
  'testing': function () {
    assert.deepEqual(escalas.build(2773, 'C'), ['c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4'])
  }
}).export(module)

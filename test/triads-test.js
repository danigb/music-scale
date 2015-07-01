var vows = require('vows')
var assert = require('assert')
var Scale = require('../')
var Note = require('note-pitch')

function simple (scale) {
  scale = scale.intervals ? scale : new Scale(scale)
  return Note.transpose('C', scale.intervals()).join(' ').replace(/4/g, '')
}

vows.describe('Triads tests').addBatch({
  'major triad': function() {
    var t = new Scale('100010010000')
    assert.deepEqual(simple(t), 'c e g')
    assert.deepEqual(t.modes().map(simple), ['c e g', 'c eb ab', 'c f a'])
  }
}).export(module)


var vows = require('vows')
var equal = require('assert').equal
var throws = require('assert').throws
var Chromatic = require('./chromatic.js')

function spell (scales, var1, var2) {
  equal(scales[0].join(' '), var1)
  if (var2) equal(scales[1].join(' '), var2)
}

vows.describe('Chromatic').addBatch({
  'scale length': function () {
    spell(Chromatic('C', null, 4), 'C Db D Eb')
    spell(Chromatic('C', null, 13), 'C Db D Eb E F Gb G Ab A Bb B C')
    spell(Chromatic('C', null, 30), 'C Db D Eb E F Gb G Ab A Bb B C Db D Eb E F Gb G Ab A Bb B C Db D Eb E F')
  },
  'note names': function () {
    equal(Chromatic.NAMES.join(' '), 'A A# A## Ab Abb B B# Bb Bbb C C# C## Cb D D# D## Db Dbb E E# Eb Ebb F F# F## Fb G G# G## Gb Gbb')
  },
  'scales per note': function () {
    equal(Chromatic.NAMES.map(function (note) {
      return Chromatic(note).length
    }).join(' '), '2 2 1 2 1 2 1 2 1 2 2 1 1 2 2 1 2 1 2 1 2 1 2 2 1 1 2 2 1 2 1')
  },
  'ascending scales': function () {
    spell(Chromatic('C'), 'C Db D Eb E F Gb G Ab A Bb B', 'C C# D D# E F F# G G# A A# B')
    spell(Chromatic('Db'), 'Db D Eb E F Gb G Ab A Bb B C', 'Db Ebb Eb Fb Gbb Gb Abb Ab Bbb Bb Cb Dbb')
    spell(Chromatic('B'), '')
    spell(Chromatic('C#'), '')
    spell(Chromatic('F#'), 'F# G G# A A# B C C# D D# E F')
    spell(Chromatic('Db'), '')
    spell(Chromatic('Cb'), '')
    spell(Chromatic('C##'), '')
  },
  'descending': function () {
    spell(Chromatic('C', null, 13, true), 'C B Bb A Ab G Gb F E Eb D Db C')
  },
  'with octaves': function () {
    spell(Chromatic('C', 2), 'C2 Db2 D2 Eb2 E2 F2 Gb2 G2 Ab2 A2 Bb2 B2')
    spell(Chromatic('A', 2, 8), 'A2 Bb2 B2 C3 Db3 D3 Eb3 E3')
    spell(Chromatic('F#', 4), 'F#4 G4 G#4 A4 A#4 B4 C5 C#5 D5 D#5 E5 F5')
  },
  'normalize root': function () {
    spell(Chromatic('g'), 'G Ab A Bb B C Db D Eb E F Gb')
    spell(Chromatic('dB'), 'Db D Eb E F Gb G Ab A Bb B C')
    spell(Chromatic('b#'), 'B# C# C## D# D## E# F# F## G# G## A# A##')
  },
  'bad notes': function () {
    equal(Chromatic('H').length, 0)
    equal(Chromatic('C###').length, 0)
    throws(function () { Chromatic('') }, /root, please/)
    throws(function () { Chromatic() }, /root, please/)
  }
}).export(module)

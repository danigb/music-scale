var Scale = require('music-scale/all')
var Chromatic = require('chromatic')

var types = ['one note', 'interval', 'triad', 'cuatriad', 'pentatonic',
'hexatonic', 'heptatonic', 'octatonic', '9 notes', '10 notes', '11 notes', '12 notes']

var NAMES = Scale.Names.names()
var all = [].concat(NAMES)

function isValidPattern (pattern) {
  return pattern &&               // present
    !/^\s*$/.test(pattern) &&     // not empty
    !/^\d$/.test(pattern)         // if number, at least 2 digits
}

function notes (root, binary, len) {
  var x, i
  return Chromatic(root, 4, len).map(function (chroma) {
    var notes = []
    for (x = 0; x < len; x++) {
      i = x % 12
      if (binary[i] === '1') notes.push(chroma[x])
    }
    return notes
  })
}

var ALTS = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0]

function modeToObject (mode) {
  var name = mode.name() || '' + mode.decimal
  var digits = mode.binary.split('').map(function (digit, index) {
    return { digit: digit, one: digit === '1', alt: ALTS[index] === 1 }
  })
  return { decimal: mode.decimal, binary: digits, name: name, cannonical: mode === mode.cannonicalMode() }
}

function scaleData (name, root, scale) {
  if (!scale) return null
  var s = { decimal: scale.decimal, binary: scale.binary }
  if (/^\d+$/.test(name) && scale.name()) name = scale.name()
  s.name = name
  s.type = types[scale.length - 1]
  s.altnames = scale.names().filter(function (altName) {
    return altName !== name
  }).join(', ')
  s.modes = scale.modes().map(modeToObject)
  s.cannonicalName = scale.cannonicalMode().name() || '' + scale.cannonicalMode().decimal

  s.notes = notes(root, scale.binary, 13)
  s.spell = s.notes[0].join(',')
  return s
}

module.exports = {
  names: function () {
    return all
  },
  search: function (pattern) {
    if (!isValidPattern(pattern)) {
      return NAMES
    } else {
      if (/^[01]+$/.test(pattern)) pattern = '[' + pattern
      return all.filter(function (name) {
        return name.indexOf(pattern) >= 0
      })
    }
  },
  get: function (name, root) {
    return scaleData(name, root, Scale.get(name))
  },
  build: function () {
    Scale.all().forEach(function (scale) {
      if (scale.name()) return
      all.push('' + scale.decimal + ' [' + scale.binary + '] ' + types[scale.length - 1])
    })
  }
}

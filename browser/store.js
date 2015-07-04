var Scale = require('music-scale/all')
var Note = require('note-pitch')

var types = ['one note', 'interval', 'triad', 'cuatriad', 'pentatonic',
'hexatonic', 'heptatonic', 'octatonic', '9 notes', '10 notes', '11 notes', '12 notes']

var NAMES = Scale.Names.names()
var all = [].concat(NAMES)

function isValidPattern (pattern) {
  return pattern &&               // present
    !/^\s*$/.test(pattern) &&     // not empty
    !/^\d$/.test(pattern)         // if number, at least 2 digits
}

function scaleData (name, scale) {
  if (!scale) return null
  var s = { name: name, decimal: scale.decimal, binary: scale.binary }
  s.type = types[scale.length - 1]
  s.altnames = scale.names().filter(function (altName) {
    return altName !== name
  }).join(', ')
  s.modes = scale.modes().map(function (mode) {
    return { binary: mode.binary, name: mode.name() }
  })
  s.cannonicalName = scale.cannonicalMode().name() || '' + scale.cannonicalMode().decimal
  s.notes = Note.transpose('C', scale.intervals())
  s.spell = s.notes.join(',')
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
  get: function (name) {
    if (/^\d{4}\s/.test(name)) name = +name.split(' ')[0]
    return scaleData(name, Scale.get(name))
  },
  build: function () {
    Scale.all().forEach(function (scale) {
      if (scale.name()) return
      all.push('' + scale.decimal + ' [' + scale.binary + '] ' + types[scale.length - 1])
    })
  }
}

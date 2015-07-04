var riot = require('riot')
var Scale = require('music-scale/all')
var browser = require('./browser.tag')
require('./search.tag')

var types = ['one note', 'interval', 'triad', 'cuatriad', 'pentatonic',
'hexatonic', 'heptatonic', 'octatonic', '9 notes', '10 notes', '11 notes', '12 notes']
var NAMES = Scale.Names.names()

var ScalesStore = {
  names: function () {
    return NAMES
  },
  search: function (pattern) {
    pattern = pattern || ''
    if (/^\d{4}$/.test(pattern)) {
      var value = +pattern
      if (value >= Scale.MIN && value <= Scale.MAX) {
        return [ pattern ]
      }
    }
    return NAMES.filter(function (name) {
      return pattern.length === 0 || name.indexOf(pattern) >= 0
    })
  },
  get: function (name) {
    var scale = Scale.get(name)
    return scale ? {
      name: name,
      type: types[scale.length - 1],
      decimal: scale.decimal,
      binary: scale.binary,
      altNames: scale.names().filter(function (altName) {
        return altName !== name
      }).join(', '),
      modes: scale.modes().map(function (mode) {
        return { binary: mode.binary, name: mode.name() }
      }),
      cannonicalName: scale.cannonicalMode().name()
    } : null
  }
}

var App = function () {
  this.events = riot.observable({})
  this.scales = ScalesStore
}

riot.mount(browser, { app: new App() })

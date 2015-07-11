(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

var riot = require('riot')

module.exports = App

var ROOTS = 'c db d eb e f f# gb g ab a bb b'.split(' ').map(function (root) {
  return root.replace(/^./, function (match) { return match.toUpperCase() })
})

function App (state) {
  this.state = state
  this.events = riot.observable({})
  this.scales = require('./scales.js')
  this.render = require('./render.js')
  this.route = require('./router.js')(this)
  this.play = require('./player.js')
}

App.prototype.getRoots = function () {
  var selected = this.state.root
  return ROOTS.map(function (name) {
    return { name: name, selected: name === selected }
  })
}

App.prototype.setRoot = function (root) {
  this.state.root = root
  this.events.trigger('select')
}

App.prototype.setPattern = function (pattern) {
  this.state.pattern = pattern
  this.events.trigger('search')
}

App.prototype.select = function (name) {
  this.state.selected = name
  this.events.trigger('select')
}

App.prototype.getSelected = function () {
  return this.scales.get(this.state.selected, this.state.root)
}
App.prototype.getResults = function () {
  return this.scales.search(this.state.pattern)
}

},{"./player.js":3,"./render.js":4,"./router.js":5,"./scales.js":6,"riot":16}],2:[function(require,module,exports){
var riot = require('riot')
var App = require('./app.js')

// Tags
var browser = require('./tags/browser.tag')
require('./tags/search.tag')
require('./tags/scale.tag')
require('./tags/roots.tag')

var app = new App({
  pattern: '',
  selected: 'major',
  root: 'C'
})

riot.mount(browser, { app: app })

var route = window.location.hash || '2773/major'
window.location.hash = ''
app.route(route)

setTimeout(function () {
  app.scales.build()
}, 500)

},{"./app.js":1,"./tags/browser.tag":7,"./tags/roots.tag":8,"./tags/scale.tag":9,"./tags/search.tag":10,"riot":16}],3:[function(require,module,exports){
'use strict'

var ctx = new window.AudioContext()
var soundfont = require('soundfont-player')(ctx)

var instrument = soundfont.instrument('acoustic_grand_piano')

module.exports = function (notes) {
}

},{"soundfont-player":17}],4:[function(require,module,exports){
var parse = require('note-parser')
var VexFlow = Vex.Flow

module.exports = function (canvas, width, height, notes) {
  var renderer = new VexFlow.Renderer(canvas, VexFlow.Renderer.Backends.CANVAS)
  var ctx = renderer.getContext()
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = 'black'
  var stave = new VexFlow.Stave(10, 0, width)
  stave.addClef('treble').setContext(ctx).draw()

  var tickables = notes.map(function (name) {
    var note = parse(name)
    var staveNote = new VexFlow.StaveNote({ keys: [note.pc + note.acc + '/' + note.oct], duration: 'q' })
    if (note.acc) {
      staveNote.addAccidental(0, new VexFlow.Accidental(note.acc))
    }
    return staveNote
  })
  tickables.push(new VexFlow.BarNote({
    type: VexFlow.Barline.END
  }))
  var voice = new VexFlow.Voice({
    num_beats: 4,
    beat_value: 4,
    resolution: VexFlow.RESOLUTION
  })
  voice.mode = VexFlow.Voice.Mode.SOFT

  // Add notes to voice
  voice.addTickables(tickables)

  // Format and justify the notes to width pixels
  var formatter = new VexFlow.Formatter()
  formatter.joinVoices([voice]).format([voice], width)

  // Render voice
  voice.draw(ctx, stave)
}

},{"note-parser":15}],5:[function(require,module,exports){
var riot = require('riot')
var Scale = require('music-scale/all')

module.exports = function (app) {
  function route (decimal, name) {
    decimal = decimal || ''
    var hash = '' + decimal
    if (name) hash += '/' + name
    riot.route(hash)
  }

  riot.route(function (decimal, name) {
    var scale = /^\d{4}$/.test(decimal) ? Scale.get(+decimal) : null
    if (scale) {
      if (!/^\s*$/.test(name)) {
        name = (name in scale.names()) ? name : scale.name()
        app.select(name || scale.decimal)
      } else {
        route(scale.decimal, scale.name() || scale.binary)
      }
    } else {
      var clean = decodeURIComponent(name)
      scale = Scale.get(clean)
      if (scale) route(scale.decimal, name)
    }
  })

  return route
}

},{"music-scale/all":13,"riot":16}],6:[function(require,module,exports){
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

},{"chromatic":11,"music-scale/all":13}],7:[function(require,module,exports){
var riot = require('riot');
module.exports = 
riot.tag('browser', '<div class="app"> <div class="search"> <search app="{ opts.app }"></search> </div> <div class="scale"> <scale app="{ opts.app }"></scale> </div> </div>', 'browser , [riot-tag="browser"] { font-family: \'myriad pro\', sans-serif; } browser .app a, [riot-tag="browser"] .app a{ color: black; } browser .app, [riot-tag="browser"] .app{ width: 960px; margin: 40px auto; overflow: hidden; } browser .search, [riot-tag="browser"] .search{ width: 33%; float: left; } browser .scale, [riot-tag="browser"] .scale{ margin-left: 33%; }', function(opts) {


});

},{"riot":16}],8:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('roots', '<div class="roots"> <a each="{ roots }" class="{ root: true, selected: selected }" href="#" onclick="{ parent.selected }"> { name } </a> </div>', 'roots .roots, [riot-tag="roots"] .roots{ width: 100%; overflow: hidden; } roots .roots a, [riot-tag="roots"] .roots a{ display: block; float: left; text-decoration: none; padding: 0.2em 0.5em 0 0.5em; border: 1px solid black; margin-right: 0.2em; } roots .roots a.selected, [riot-tag="roots"] .roots a.selected{ background-color: yellow; }', function(opts) {
    var self = this
    var app = this.opts.app
    self.roots = app.getRoots()

    app.events.on('select', function() {
      self.roots = app.getRoots()
      self.update()
    })

    this.selected = function(e) {
      app.setRoot(e.target.innerHTML.trim())
    }.bind(this);
  
});

},{"riot":16}],9:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('scale', '<div if="{ scale }" class="details"> <roots app="{ opts.app }" root="{ root }"></roots> <h2>Scale: { state.root } { scale.name } <small if="{ scale.altNames }">({ scale.altNames })</small> </h2> <h4>[{ scale.decimal }] { scale.binary } { scale.type }</h4> <h3>Notes</h3> <div class="notes"> <canvas id="score0" width="500" height="100"></canvas>_ <canvas id="score1" width="500" height="100"></canvas>_ </div> <a href="#" onclick="{ play }">Play</a> <h3>Modes</h3> <div each ="{ scale.modes }" class="{ mode: true, can: cannonical }"> <a href="#{ decimal }/{ name }"> { parent.state.root } { name } </a> <div each="{ binary }" class="{ digit: true, one: one, zero: !one, alt: alt }"> { digit } </div> </div> </div>', 'scale .mode, [riot-tag="scale"] .mode{ width: 100%; overflow: hidden; padding: 0.2em 0; height: 2em; } scale .mode a, [riot-tag="scale"] .mode a{ float: left; display: block; width: 12em; } scale .mode div, [riot-tag="scale"] .mode div{ float: left; overflow: hidden; text-indent: -100px; height: 1em; width: 1em; margin: 0.5em 0.1em 0.1em 0; border-radius: 1em; border: 1px solid white; } scale .mode.can, [riot-tag="scale"] .mode.can{ font-weight: bold; } scale .mode .zero, [riot-tag="scale"] .mode .zero{ background-color: #DDD; } scale .mode .alt, [riot-tag="scale"] .mode .alt{ margin-top: 0.5em; width: 1em; } scale .mode .one, [riot-tag="scale"] .mode .one{ background-color: #666; } scale .mode .one.alt, [riot-tag="scale"] .mode .one.alt{ background-color: #333; }', function(opts) {
    var self = this
    var app = this.opts.app
    this.state = app.state
    this.scale = app.getSelected()
    var canvas = [this.score0, this.score1]
    var VexFlow = typeof Vex !== 'undefined' ? Vex.Flow : null

    this.on('update', function() {
      var notes = app.getSelected().notes
      app.render(canvas[0], 400, 100, notes[0])
      if (notes.length > 1) app.render(canvas[1], 400, 100, notes[1])
    })

    this.play = function(e) {
      var notes = app.getSelected().notes[0]
      console.log(notes)
      app.play(notes)
    }.bind(this);

    this.select = function(e) {
      app.select(e.target.getAttribute('data-name'))
    }.bind(this);

    app.events.on('select', function(name) {
      self.scale = app.getSelected()
      self.root = app.state.root
      self.update()
      document.body.scrollTop = document.documentElement.scrollTop = 0
    })
  
});

},{"riot":16}],10:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('search', '<h4>Search scale</h4> <label>You can search by scale name, <br>decimal or equivalent binary</label> <input name="searchPattern" onkeyup="{ search }"> <div class="names"> <label>Showing { results.length } of 2048</label> <a each="{ name in results }" data-name="{ name }" onclick="{ parent.select }" href="#"> { name } </a>&nbsp; </div>', 'search input[name=\'searchPattern\'], [riot-tag="search"] input[name=\'searchPattern\']{ font-size: 1em; } search label, [riot-tag="search"] label{ display: block; font-size: 0.8em; margin: 0.5em 0 1em 0; } search .names a, [riot-tag="search"] .names a{ display: block; }', function(opts) {
    var app = this.opts.app
    this.results = app.getResults()

    this.select = function(e) {
      var name = e.target.getAttribute('data-name')
      if (/^\d{4}\s/.test(name)) app.route(+name.split(' ')[0])
      else app.route(null, name)
    }.bind(this);

    this.search = function(e) {
      app.setPattern(this.searchPattern.value)
      this.results = app.getResults()
      this.update()
    }.bind(this);

    this.searchPattern.focus()
  
});

},{"riot":16}],11:[function(require,module,exports){
'use strict'

function Chromatic (root, octave, length, descending) {
  if (!root) throw Error('Give me a root, please')
  length = length || 12
  root = root.charAt(0).toUpperCase() + root.slice(1).toLowerCase()
  descending = descending === true ? 1 : 0

  return Chromatic.SCALES.reduce(function (all, notes) {
    var scale = find(root, notes)
    if (scale) all.push(octavize(forceLength(reverse(scale, descending), length), octave))
    return all
  }, [])
}

Chromatic.SCALES = [
  'C Db D Eb E F Gb G Ab A Bb B'.split(' '),
  'Cb Dbb Db Ebb Eb Fb Gbb Gb Abb Ab Bbb Bb'.split(' '),
  'C C# D D# E F F# G G# A A# B'.split(' '),
  'C# C## D# D## E# F# F## G# G## A# A## B#'.split(' ')
]

function find (root, notes) {
  var index = notes.indexOf(root)
  return index < 0 ? null : rotate(notes, index)
}

function reverse (scale, reverse) {
  return reverse ? rotate(scale.reverse(), scale.length - 1) : scale
}

function octavize (scale, octave) {
  if (!octave) return scale
  octave = +octave
  return scale.map(function (note, index) {
    if (index !== 0 && note[0] === 'C' && scale[index - 1][0] !== 'C') octave++
    return note + octave
  })
}

function forceLength (scale, length) {
  var original = scale.length
  var result = []
  for (var i = 0; i < length; i++) {
    result.push(scale[i % original])
  }
  return result
}

function rotate (arr, positions) {
  return arr.slice(positions, 12).concat(arr.slice(0, positions))
}

module.exports = Chromatic

},{}],12:[function(require,module,exports){
module.exports = function(method) {
  var memoized = function() {
    var cache = this['__cache' + memoized.cacheId] ||
      (this['__cache' + memoized.cacheId] = {});
    var key = [].join.call(arguments, '|');
    if (cache.hasOwnProperty(key))
      return cache[key];
    return (cache[key] = method.apply(this, arguments));
  }
  memoized.cacheId = '' + Date.now() + Math.random();

  return memoized;
}

},{}],13:[function(require,module,exports){
'use strict'
var Scale = require('./')
Scale.Names({
  '2217': ['lydian #5 pentatonic'],
  '2218': ['whole tone pentatonic'],
  '2225': ['lydian pentatonic', 'chinese'],
  '2226': ['lydian dominant pentatonic'],
  '2257': ['ionian pentatonic'],
  '2258': ['mixolydian pentatonic', 'indian'],
  '2274': ['neopolitan major pentatonic'],
  '2378': ['malkos raga'],
  '2385': ['minor #7 pentatonic'],
  '2386': ['minor pentatonic', 'vietnamese 2'],
  '2388': ['minor six pentatonic'],
  '2392': ['vietnamese 1'],
  '2402': ['locrian pentatonic', 'minor seven flat five pentatonic'],
  '2418': ['minor blues', 'blues'],
  '2457': ['augmented'],
  '2466': ['super locrian pentatonic'],
  '2485': ['lydian #2'],
  '2486': ['hungarian major'],
  '2519': ['kafi raga'],
  '2521': ['augmented heptatonic'],
  '2642': ['egyptian'],
  '2644': ['ritusen'],
  '2646': ['piongio'],
  '2708': ['major pentatonic', 'pentatonic'],
  '2712': ['flat six pentatonic'],
  '2726': ['prometheus'],
  '2730': ['whole tone'],
  '2731': ['leading whole tone'],
  '2733': ['lydian augmented'],
  '2741': ['lydian'],
  '2742': ['lydian dominant', 'lydian b7'],
  '2746': ['lydian minor'],
  '2765': ['ionian augmented'],
  '2773': ['major', 'ionian'],
  '2774': ['mixolydian', 'dominant'],
  '2775': ['bebop', 'bebop dominant'],
  '2777': ['harmonic major'],
  '2778': ['melodic minor fifth mode', 'hindu', 'mixolydian b6'],
  '2781': ['bebop major'],
  '2794': ['locrian major', 'arabian'],
  '2805': ['ichikosucho'],
  '2836': ['flat three pentatonic', 'kumoi'],
  '2840': ['hirajoshi'],
  '2869': ['lydian diminished'],
  '2870': ['dorian #4', 'romanian minor'],
  '2873': ['hungarian minor'],
  '2897': ['minor hexatonic'],
  '2901': ['melodic minor', 'melodic'],
  '2902': ['dorian'],
  '2905': ['harmonic minor', 'harmonic'],
  '2906': ['aeolian'],
  '2907': ['minor bebop'],
  '2909': ['minor six diminished'],
  '2922': ['locrian #2'],
  '2925': ['diminished'],
  '2964': ['major blues'],
  '3030': ['bebop minor'],
  '3062': ['composite blues'],
  '3154': ['in-sen'],
  '3160': ['kumoijoshi'],
  '3170': ['iwato'],
  '3220': ['major flat two pentatonic', 'scriabin'],
  '3238': ['prometheus neopolitan'],
  '3242': ['mystery #1'],
  '3243': ['enigmatic'],
  '3253': ['lydian #9'],
  '3257': ['double harmonic lydian'],
  '3276': ['six tone symmetric'],
  '3289': ['double harmonic major', 'gypsy'],
  '3290': ['phrygian major', 'spanish'],
  '3302': ['oriental'],
  '3305': ['persian'],
  '3321': ['purvi raga'],
  '3352': ['pelog'],
  '3385': ['todi raga'],
  '3413': ['neopolitan major', 'dorian b2'],
  '3414': ['melodic minor second mode'],
  '3417': ['neopolitan', 'balinese'],
  '3418': ['phrygian', 'neopolitan minor'],
  '3430': ['locrian 6'],
  '3434': ['locrian'],
  '3450': ['bebop locrian'],
  '3498': ['altered', 'super locrian', 'diminished whole tone', 'pomeroy'],
  '3500': ['super locrian bb7'],
  '3506': ['flamenco'],
  '3546': ['spanish heptatonic']
})

if (typeof module === 'object' && module.exports) module.exports = Scale
if (typeof window !== 'undefined') window.Scale = Scale

},{"./":14}],14:[function(require,module,exports){
'use strict'

var memoize = require('method-memoize')

var IS_BINARY = /^[01]+$/
var IS_NUMBER = /^\d+$/

/*
 * Scale constructor
 */
function Scale (num) {
  if (!(this instanceof Scale)) return Scale.get(num)

  if (IS_NUMBER.test(num)) {
    this.decimal = +num
    this.binary = this.decimal.toString(2)
  } else {
    throw Error('Invalid scale number: ' + num)
  }
  if (this.decimal < Scale.MIN || this.decimal > Scale.MAX) {
    throw Error('Scale number not valid: ' + this.decimal +
      ' (must be between ' + Scale.MIN + ' and ' + Scale.MAX + ')')
  }

  this.length = this.binary.match(/1/g).length
}

Scale.MIN = parseInt('100000000000', 2)
Scale.MAX = parseInt('111111111111', 2)

Scale.get = function (identifier) {
  if (!identifier) return null
  return Scale.cache(identifier, function () {
    if (IS_BINARY.test(identifier)) return Scale.get(parseInt(identifier, 2))
    else if (IS_NUMBER.test(identifier)) return new Scale(identifier)
    return Scale.get(Scale.Names.toDecimal(identifier))
  })
}

Scale.fromNumbers = function (array) {
  var numbers = array.map(function (i) {
    return i.toString()
  })
  var binary = NUMBERS.map(function (num) {
    return numbers.indexOf(num) >= 0 ? '1' : '0'
  }).join('')
  return Scale.get(binary)
}

Scale.all = function () {
  if (!Scale._all) {
    Scale._all = []
    for (var i = Scale.MIN; i <= Scale.MAX; i++) {
      Scale._all.push(Scale.get(i))
    }
  }
  return Scale._all
}

Scale.prototype.names = memoize(function () { return Scale.Names.fromDecimal(this.decimal) })
Scale.prototype.name = function () { return this.names()[0] }

/*
 * Steps: the number of semitones required for each degree (step)
 * For example, the major scale is 2,2,1,2,2,2,1 — starting on any given
 * note (the first "degree"), the second degree is 2 semitones above the first,
 * the third is 2 semitones above the second, the fourth is 1 semitone above
 * the third, and so on.
 *
 * @return an array of semitones for each step
 *
 * @example Scale(2773).steps() // => [2, 2, 1, 2, 2, 2, 1]
 */
var STEPS = /1(0)*/g
Scale.prototype.steps = memoize(function () {
  return (this.binary.match(STEPS)).map(lengthOf)
})

/*
 * leap()
 *
 * the maximum number of semitones between two notes of the scale
 *
 * Useful to limit the number of scales: "The requirement of no step greater
 * than a major third is somewhat arbitrary, but does allow us to include
 * commonly used scales like the Pentatonic" - William Zeitler
 */
Scale.prototype.leap = memoize(function () {
  return (this.binary.match(STEPS)).reduce(function (num, zeros) {
    return Math.max(num, zeros.length)
  }, 0)
})

var NUMBERS = ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7']
Scale.prototype.numbers = function () {
  return this.binary.split('')
    .map(function (digit, index) {
      return digit === '1' ? NUMBERS[index] : null
    })
    .filter(function (n) { return n })
}

var INTERVALS = ['P1', 'm2', 'M2', 'm3', 'M3', 'P4',
  'd5', 'P5', 'm6', 'M6', 'm7', 'M7']
Scale.prototype.intervals = function () {
  var intervals = this.binary.split('').map(function (digit, index) {
    return digit === '1' ? INTERVALS[index] : null
  })
  specialCase(intervals, 8, 'm6', 9, 'M6', 'A5')
  specialCase(intervals, 6, 'd5', 7, 'P5', 'A4')
  specialCase(intervals, 6, 'd5', 8, 'A5', 'A4')
  // specialCase(intervals, 6, 'd5', 8, 'm6', 'A4', 'A5')
  return intervals.filter(function (i) { return i })
}

function specialCase (intervals, a, aVal, b, bVal, aSus, bSus) {
  if (intervals[a] === aVal && intervals[b] === bVal) {
    if (aSus) intervals[a] = aSus
    if (bSus) intervals[b] = bSus
  }
}

Scale.prototype.modes = memoize(function () {
  var modes = []
  for (var i = 0; i < 12; i++) {
    modes.push(rotate(this.binary, i))
  }
  var m = modes.filter(function (binary) {
    return binary.charAt(0) === '1'
  }).map(function (binary, index) {
    return Scale.get(binary)
  })
  return m
})

Scale.prototype.mode = function (num) {
  var count = this.modes().length
  return this.modes()[(num - 1) % count]
}

Scale.prototype.cannonicalMode = memoize(function () {
  var ordered = this.modes().concat().sort(function (scaleA, scaleB) {
    var stepsA = +scaleA.steps().join('')
    var stepsB = +scaleB.steps().join('')
    return stepsA - stepsB
  })
  return ordered[ordered.length - 1]
})
Scale.prototype.isCannonical = function () {
  return this.cannonicalMode() === this
}

/*
 */
Scale.prototype.isModeOf = function (other) {
  var binary = other.binary ? other.binary : other
  return binary.length === this.binary.length &&
    (binary + binary).indexOf(this.binary) !== -1
}

Scale.prototype.reflection = memoize(function () {
  return Scale.get(this.binary.split('').reverse().join(''))
})

Scale.prototype.coscale = memoize(function () {
  var inv = this.binary.replace(/0/g, 'L').replace(/1/g, '0').replace(/L/g, 1)
  return Scale.get(rotate(inv, inv.indexOf('1')))
})

/*
 * Used to store Scale instances
 */
Scale.cache = (function (values) {
  return function (id, generator) {
    return values[id] || (values[id] = generator())
  }
})({})

/*
 * Name store
 *
 * Add decimal and names and build an index to retrieve them from decimal to
 * names and from name to decimal number
 */
Scale.Names = (function (decToNames, nameToDec) {
  function store (hash) {
    var names
    Object.keys(hash).forEach(function (decimal) {
      names = hash[decimal]
      decToNames[decimal] = names
      names.forEach(function (name) { nameToDec[name] = decimal })
    })
  }
  store.names = function () { return Object.keys(nameToDec) }
  store.fromDecimal = function (decimal) { return decToNames[decimal] || [] }
  store.toDecimal = function (name) { return nameToDec[name] }
  return store
})({}, {})

Scale.Names({
  '2773': ['major'],
  '2901': ['melodic minor', 'melodic'],
  '2905': ['harmonic minor', 'harmonic'],
  '2709': ['major pentatonic']
})

/*
 * rotates a string of 12 characters length (a scale binary number)
 */
function rotate (str, positions) {
  return str.slice(positions, 12) + str.slice(0, positions)
}

function lengthOf (o) { return o.length }

if (typeof module === 'object' && module.exports) module.exports = Scale
if (typeof window !== 'undefined') window.Scale = Scale

},{"method-memoize":12}],15:[function(require,module,exports){
'use strict'

var NOTE = /^([a-gA-G])(#{0,2}|b{0,2})(-?[0-9]{1}|[+]{0,2}|[-]{0,2})$/
/*
 * parseNote
 *
 * @param {String} note - the note string to be parsed
 * @return {Object} a object with the following attributes:
 * - pc: pitchClass, the letter of the note, ALWAYS in lower case
 * - acc: the accidentals (or '' if no accidentals)
 * - oct: the octave as integer. By default is 4
 */
var parse = function (note, defaultOctave, defaultValue) {
  var parsed, match, octave

  // in scientific notation middleC is 4
  defaultOctave = defaultOctave || 4
  // test string against regex
  if (typeof note === 'string' && (match = NOTE.exec(note))) {
    // match[3] is the octave part
    if (match[3].length > 0 && !isNaN(match[3])) {
      octave = +match[3]
    } else if (match[3][0] === '+') {
      octave = defaultOctave + match[3].length
    } else if (match[3][0] === '-') {
      octave = defaultOctave - match[3].length
    } else {
      octave = defaultOctave
    }
    parsed = { pc: match[1].toLowerCase(),
      acc: match[2], oct: octave }
  } else if (typeof note.pc !== 'undefined'
    && typeof note.acc !== 'undefined'
    && typeof note.oct !== 'undefined') {
    parsed = note
  }

  if (parsed) {
    parsed.name = parsed.name || '' + parsed.pc + parsed.acc + parsed.oct
    parsed.midi = parsed.midi || toMidi(parsed)
    parsed.freq = parsed.freq || midiToFrequency(parsed.midi)
    return parsed
  } else if (typeof (defaultValue) !== 'undefined') {
    return defaultValue
  } else {
    throw Error('Invalid note format: ' + note)
  }
}

var SEMITONES = {c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 }
function toMidi (note) {
  var alter = note.acc.length
  if (note.acc[0] === 'b') alter = -1 * alter
  return SEMITONES[note.pc] + alter + 12 * (note.oct + 1)
}
function midiToFrequency (note) {
  return Math.pow(2, (note - 69) / 12) * 440
}

module.exports = parse

},{}],16:[function(require,module,exports){
/* Riot v2.2.1, @license MIT, (c) 2015 Muut Inc. + contributors */

;(function(window) {
  'use strict'
  var riot = { version: 'v2.2.1', settings: {} }

  // This globals 'const' helps code size reduction

  // for typeof == '' comparisons
  var T_STRING = 'string'
  var T_OBJECT = 'object'

  // for IE8 and rest of the world
  var isArray = Array.isArray || (function () {
    var _ts = Object.prototype.toString
    return function (v) { return _ts.call(v) === '[object Array]' }
  })()

  // Version# for IE 8-11, 0 for others
  var ieVersion = (function (win) {
    return (win && win.document || {}).documentMode | 0
  })(window)

riot.observable = function(el) {

  el = el || {}

  var callbacks = {},
      _id = 0

  el.on = function(events, fn) {
    if (isFunction(fn)) {
      fn._id = typeof fn._id == 'undefined' ? _id++ : fn._id

      events.replace(/\S+/g, function(name, pos) {
        (callbacks[name] = callbacks[name] || []).push(fn)
        fn.typed = pos > 0
      })
    }
    return el
  }

  el.off = function(events, fn) {
    if (events == '*') callbacks = {}
    else {
      events.replace(/\S+/g, function(name) {
        if (fn) {
          var arr = callbacks[name]
          for (var i = 0, cb; (cb = arr && arr[i]); ++i) {
            if (cb._id == fn._id) { arr.splice(i, 1); i-- }
          }
        } else {
          callbacks[name] = []
        }
      })
    }
    return el
  }

  // only single event supported
  el.one = function(name, fn) {
    function on() {
      el.off(name, on)
      fn.apply(el, arguments)
    }
    return el.on(name, on)
  }

  el.trigger = function(name) {
    var args = [].slice.call(arguments, 1),
        fns = callbacks[name] || []

    for (var i = 0, fn; (fn = fns[i]); ++i) {
      if (!fn.busy) {
        fn.busy = 1
        fn.apply(el, fn.typed ? [name].concat(args) : args)
        if (fns[i] !== fn) { i-- }
        fn.busy = 0
      }
    }

    if (callbacks.all && name != 'all') {
      el.trigger.apply(el, ['all', name].concat(args))
    }

    return el
  }

  return el

}
riot.mixin = (function() {
  var mixins = {}

  return function(name, mixin) {
    if (!mixin) return mixins[name]
    mixins[name] = mixin
  }

})()

;(function(riot, evt, window) {

  // browsers only
  if (!window) return

  var loc = window.location,
      fns = riot.observable(),
      win = window,
      started = false,
      current

  function hash() {
    return loc.href.split('#')[1] || ''
  }

  function parser(path) {
    return path.split('/')
  }

  function emit(path) {
    if (path.type) path = hash()

    if (path != current) {
      fns.trigger.apply(null, ['H'].concat(parser(path)))
      current = path
    }
  }

  var r = riot.route = function(arg) {
    // string
    if (arg[0]) {
      loc.hash = arg
      emit(arg)

    // function
    } else {
      fns.on('H', arg)
    }
  }

  r.exec = function(fn) {
    fn.apply(null, parser(hash()))
  }

  r.parser = function(fn) {
    parser = fn
  }

  r.stop = function () {
    if (!started) return
    win.removeEventListener ? win.removeEventListener(evt, emit, false) : win.detachEvent('on' + evt, emit)
    fns.off('*')
    started = false
  }

  r.start = function () {
    if (started) return
    win.addEventListener ? win.addEventListener(evt, emit, false) : win.attachEvent('on' + evt, emit)
    started = true
  }

  // autostart the router
  r.start()

})(riot, 'hashchange', window)
/*

//// How it works?


Three ways:

1. Expressions: tmpl('{ value }', data).
   Returns the result of evaluated expression as a raw object.

2. Templates: tmpl('Hi { name } { surname }', data).
   Returns a string with evaluated expressions.

3. Filters: tmpl('{ show: !done, highlight: active }', data).
   Returns a space separated list of trueish keys (mainly
   used for setting html classes), e.g. "show highlight".


// Template examples

tmpl('{ title || "Untitled" }', data)
tmpl('Results are { results ? "ready" : "loading" }', data)
tmpl('Today is { new Date() }', data)
tmpl('{ message.length > 140 && "Message is too long" }', data)
tmpl('This item got { Math.round(rating) } stars', data)
tmpl('<h1>{ title }</h1>{ body }', data)


// Falsy expressions in templates

In templates (as opposed to single expressions) all falsy values
except zero (undefined/null/false) will default to empty string:

tmpl('{ undefined } - { false } - { null } - { 0 }', {})
// will return: " - - - 0"

*/


var brackets = (function(orig) {

  var cachedBrackets,
      r,
      b,
      re = /[{}]/g

  return function(x) {

    // make sure we use the current setting
    var s = riot.settings.brackets || orig

    // recreate cached vars if needed
    if (cachedBrackets !== s) {
      cachedBrackets = s
      b = s.split(' ')
      r = b.map(function (e) { return e.replace(/(?=.)/g, '\\') })
    }

    // if regexp given, rewrite it with current brackets (only if differ from default)
    return x instanceof RegExp ? (
        s === orig ? x :
        new RegExp(x.source.replace(re, function(b) { return r[~~(b === '}')] }), x.global ? 'g' : '')
      ) :
      // else, get specific bracket
      b[x]
  }
})('{ }')


var tmpl = (function() {

  var cache = {},
      reVars = /(['"\/]).*?[^\\]\1|\.\w*|\w*:|\b(?:(?:new|typeof|in|instanceof) |(?:this|true|false|null|undefined)\b|function *\()|([a-z_$]\w*)/gi
              // [ 1               ][ 2  ][ 3 ][ 4                                                                                  ][ 5       ]
              // find variable names:
              // 1. skip quoted strings and regexps: "a b", 'a b', 'a \'b\'', /a b/
              // 2. skip object properties: .name
              // 3. skip object literals: name:
              // 4. skip javascript keywords
              // 5. match var name

  // build a template (or get it from cache), render with data
  return function(str, data) {
    return str && (cache[str] = cache[str] || tmpl(str))(data)
  }


  // create a template instance

  function tmpl(s, p) {

    // default template string to {}
    s = (s || (brackets(0) + brackets(1)))

      // temporarily convert \{ and \} to a non-character
      .replace(brackets(/\\{/g), '\uFFF0')
      .replace(brackets(/\\}/g), '\uFFF1')

    // split string to expression and non-expresion parts
    p = split(s, extract(s, brackets(/{/), brackets(/}/)))

    return new Function('d', 'return ' + (

      // is it a single expression or a template? i.e. {x} or <b>{x}</b>
      !p[0] && !p[2] && !p[3]

        // if expression, evaluate it
        ? expr(p[1])

        // if template, evaluate all expressions in it
        : '[' + p.map(function(s, i) {

            // is it an expression or a string (every second part is an expression)
          return i % 2

              // evaluate the expressions
              ? expr(s, true)

              // process string parts of the template:
              : '"' + s

                  // preserve new lines
                  .replace(/\n/g, '\\n')

                  // escape quotes
                  .replace(/"/g, '\\"')

                + '"'

        }).join(',') + '].join("")'
      )

      // bring escaped { and } back
      .replace(/\uFFF0/g, brackets(0))
      .replace(/\uFFF1/g, brackets(1))

    + ';')

  }


  // parse { ... } expression

  function expr(s, n) {
    s = s

      // convert new lines to spaces
      .replace(/\n/g, ' ')

      // trim whitespace, brackets, strip comments
      .replace(brackets(/^[{ ]+|[ }]+$|\/\*.+?\*\//g), '')

    // is it an object literal? i.e. { key : value }
    return /^\s*[\w- "']+ *:/.test(s)

      // if object literal, return trueish keys
      // e.g.: { show: isOpen(), done: item.done } -> "show done"
      ? '[' +

          // extract key:val pairs, ignoring any nested objects
          extract(s,

              // name part: name:, "name":, 'name':, name :
              /["' ]*[\w- ]+["' ]*:/,

              // expression part: everything upto a comma followed by a name (see above) or end of line
              /,(?=["' ]*[\w- ]+["' ]*:)|}|$/
              ).map(function(pair) {

                // get key, val parts
                return pair.replace(/^[ "']*(.+?)[ "']*: *(.+?),? *$/, function(_, k, v) {

                  // wrap all conditional parts to ignore errors
                  return v.replace(/[^&|=!><]+/g, wrap) + '?"' + k + '":"",'

                })

              }).join('')

        + '].join(" ").trim()'

      // if js expression, evaluate as javascript
      : wrap(s, n)

  }


  // execute js w/o breaking on errors or undefined vars

  function wrap(s, nonull) {
    s = s.trim()
    return !s ? '' : '(function(v){try{v='

        // prefix vars (name => data.name)
        + (s.replace(reVars, function(s, _, v) { return v ? '(d.'+v+'===undefined?'+(typeof window == 'undefined' ? 'global.' : 'window.')+v+':d.'+v+')' : s })

          // break the expression if its empty (resulting in undefined value)
          || 'x')
      + '}catch(e){'
      + '}finally{return '

        // default to empty string for falsy values except zero
        + (nonull === true ? '!v&&v!==0?"":v' : 'v')

      + '}}).call(d)'
  }


  // split string by an array of substrings

  function split(str, substrings) {
    var parts = []
    substrings.map(function(sub, i) {

      // push matched expression and part before it
      i = str.indexOf(sub)
      parts.push(str.slice(0, i), sub)
      str = str.slice(i + sub.length)
    })

    // push the remaining part
    return parts.concat(str)
  }


  // match strings between opening and closing regexp, skipping any inner/nested matches

  function extract(str, open, close) {

    var start,
        level = 0,
        matches = [],
        re = new RegExp('('+open.source+')|('+close.source+')', 'g')

    str.replace(re, function(_, open, close, pos) {

      // if outer inner bracket, mark position
      if (!level && open) start = pos

      // in(de)crease bracket level
      level += open ? 1 : -1

      // if outer closing bracket, grab the match
      if (!level && close != null) matches.push(str.slice(start, pos+close.length))

    })

    return matches
  }

})()

// { key, i in items} -> { key, i, items }
function loopKeys(expr) {
  var b0 = brackets(0),
      els = expr.slice(b0.length).match(/\s*(\S+?)\s*(?:,\s*(\S)+)?\s+in\s+(.+)/)
  return els ? { key: els[1], pos: els[2], val: b0 + els[3] } : { val: expr }
}

function mkitem(expr, key, val) {
  var item = {}
  item[expr.key] = key
  if (expr.pos) item[expr.pos] = val
  return item
}


/* Beware: heavy stuff */
function _each(dom, parent, expr) {

  remAttr(dom, 'each')

  var template = dom.outerHTML,
      root = dom.parentNode,
      placeholder = document.createComment('riot placeholder'),
      tags = [],
      child = getTag(dom),
      checksum

  root.insertBefore(placeholder, dom)

  expr = loopKeys(expr)

  // clean template code
  parent
    .one('premount', function () {
      if (root.stub) root = parent.root
      // remove the original DOM node
      dom.parentNode.removeChild(dom)
    })
    .on('update', function () {
      var items = tmpl(expr.val, parent),
          test

      // object loop. any changes cause full redraw
      if (!isArray(items)) {
        test = checksum
        checksum = items ? JSON.stringify(items) : ''
        if (checksum === test) return

        items = !items ? [] :
          Object.keys(items).map(function (key) {
            return mkitem(expr, key, items[key])
          })
      }

      var frag = document.createDocumentFragment(),
          i = tags.length,
          j = items.length

      // unmount leftover items
      while (i > j) tags[--i].unmount()
      tags.length = j

      test = !checksum && !!expr.key
      for (i = 0; i < j; ++i) {
        var _item = test ? mkitem(expr, items[i], i) : items[i]

        if (!tags[i]) {
          // mount new
          (tags[i] = new Tag({ tmpl: template }, {
              parent: parent,
              isLoop: true,
              root: root,
              item: _item
            })
          ).mount()

          frag.appendChild(tags[i].root)
        }
        tags[i]._item = _item
        tags[i].update(_item)
      }

      root.insertBefore(frag, placeholder)

      if (child) parent.tags[getTagName(dom)] = tags

    }).one('updated', function() {
      var keys = Object.keys(parent)// only set new values
      walk(root, function(node) {
        // only set element node and not isLoop
        if (node.nodeType == 1 && !node.isLoop && !node._looped) {
          node._visited = false // reset _visited for loop node
          node._looped = true // avoid set multiple each
          setNamed(node, parent, keys)
        }
      })
    })

}


function parseNamedElements(root, parent, childTags) {

  walk(root, function(dom) {
    if (dom.nodeType == 1) {
      dom.isLoop = (dom.parentNode && dom.parentNode.isLoop || dom.getAttribute('each')) ? 1 : 0

      // custom child tag
      var child = getTag(dom)

      if (child && !dom.isLoop) {
        var tag = new Tag(child, { root: dom, parent: parent }, dom.innerHTML),
            tagName = getTagName(dom),
            ptag = parent,
            cachedTag

        while (!getTag(ptag.root)) {
          if (!ptag.parent) break
          ptag = ptag.parent
        }

        // fix for the parent attribute in the looped elements
        tag.parent = ptag

        cachedTag = ptag.tags[tagName]

        // if there are multiple children tags having the same name
        if (cachedTag) {
          // if the parent tags property is not yet an array
          // create it adding the first cached tag
          if (!isArray(cachedTag))
            ptag.tags[tagName] = [cachedTag]
          // add the new nested tag to the array
          ptag.tags[tagName].push(tag)
        } else {
          ptag.tags[tagName] = tag
        }

        // empty the child node once we got its template
        // to avoid that its children get compiled multiple times
        dom.innerHTML = ''
        childTags.push(tag)
      }

      if (!dom.isLoop)
        setNamed(dom, parent, [])
    }

  })

}

function parseExpressions(root, tag, expressions) {

  function addExpr(dom, val, extra) {
    if (val.indexOf(brackets(0)) >= 0) {
      var expr = { dom: dom, expr: val }
      expressions.push(extend(expr, extra))
    }
  }

  walk(root, function(dom) {
    var type = dom.nodeType

    // text node
    if (type == 3 && dom.parentNode.tagName != 'STYLE') addExpr(dom, dom.nodeValue)
    if (type != 1) return

    /* element */

    // loop
    var attr = dom.getAttribute('each')

    if (attr) { _each(dom, tag, attr); return false }

    // attribute expressions
    each(dom.attributes, function(attr) {
      var name = attr.name,
        bool = name.split('__')[1]

      addExpr(dom, attr.value, { attr: bool || name, bool: bool })
      if (bool) { remAttr(dom, name); return false }

    })

    // skip custom tags
    if (getTag(dom)) return false

  })

}
function Tag(impl, conf, innerHTML) {

  var self = riot.observable(this),
      opts = inherit(conf.opts) || {},
      dom = mkdom(impl.tmpl),
      parent = conf.parent,
      isLoop = conf.isLoop,
      item = conf.item,
      expressions = [],
      childTags = [],
      root = conf.root,
      fn = impl.fn,
      tagName = root.tagName.toLowerCase(),
      attr = {},
      loopDom,
      TAG_ATTRIBUTES = /([\w\-]+)\s?=\s?['"]([^'"]+)["']/gim


  if (fn && root._tag) {
    root._tag.unmount(true)
  }

  // not yet mounted
  this.isMounted = false

  if (impl.attrs) {
    var attrs = impl.attrs.match(TAG_ATTRIBUTES)

    each(attrs, function(a) {
      var kv = a.split(/\s?=\s?/)
      root.setAttribute(kv[0], kv[1].replace(/['"]/g, ''))
    })

  }

  // keep a reference to the tag just created
  // so we will be able to mount this tag multiple times
  root._tag = this

  // create a unique id to this tag
  // it could be handy to use it also to improve the virtual dom rendering speed
  this._id = fastAbs(~~(new Date().getTime() * Math.random()))

  extend(this, { parent: parent, root: root, opts: opts, tags: {} }, item)

  // grab attributes
  each(root.attributes, function(el) {
    var val = el.value
    // remember attributes with expressions only
    if (brackets(/\{.*\}/).test(val)) attr[el.name] = val
  })

  if (dom.innerHTML && !/select|select|optgroup|tbody|tr/.test(tagName))
    // replace all the yield tags with the tag inner html
    dom.innerHTML = replaceYield(dom.innerHTML, innerHTML)

  // options
  function updateOpts() {
    // update opts from current DOM attributes
    each(root.attributes, function(el) {
      opts[el.name] = tmpl(el.value, parent || self)
    })
    // recover those with expressions
    each(Object.keys(attr), function(name) {
      opts[name] = tmpl(attr[name], parent || self)
    })
  }

  this.update = function(data) {
    extend(self, data)
    updateOpts()
    self.trigger('update', data)
    update(expressions, self, data)
    self.trigger('updated')
  }

  this.mixin = function() {
    each(arguments, function(mix) {
      mix = typeof mix == 'string' ? riot.mixin(mix) : mix
      each(Object.keys(mix), function(key) {
        // bind methods to self
        if (key != 'init')
          self[key] = typeof mix[key] == 'function' ? mix[key].bind(self) : mix[key]
      })
      // init method will be called automatically
      if (mix.init) mix.init.bind(self)()
    })
  }

  this.mount = function() {

    updateOpts()

    // initialiation
    fn && fn.call(self, opts)

    toggle(true)


    // parse layout after init. fn may calculate args for nested custom tags
    parseExpressions(dom, self, expressions)

    if (!self.parent) self.update()

    // internal use only, fixes #403
    self.trigger('premount')

    if (isLoop) {
      // update the root attribute for the looped elements
      self.root = root = loopDom = dom.firstChild
    } else {
      while (dom.firstChild) root.appendChild(dom.firstChild)
      if (root.stub) self.root = root = parent.root
    }
    // if it's not a child tag we can trigger its mount event
    if (!self.parent || self.parent.isMounted) {
      self.isMounted = true
      self.trigger('mount')
    }
    // otherwise we need to wait that the parent event gets triggered
    else self.parent.one('mount', function() {
      // avoid to trigger the `mount` event for the tags
      // not visible included in an if statement
      if (!isInStub(self.root)) {
        self.parent.isMounted = self.isMounted = true
        self.trigger('mount')
      }
    })
  }


  this.unmount = function(keepRootTag) {
    var el = loopDom || root,
        p = el.parentNode

    if (p) {

      if (parent) {
        // remove this tag from the parent tags object
        // if there are multiple nested tags with same name..
        // remove this element form the array
        if (isArray(parent.tags[tagName])) {
          each(parent.tags[tagName], function(tag, i) {
            if (tag._id == self._id)
              parent.tags[tagName].splice(i, 1)
          })
        } else
          // otherwise just delete the tag instance
          parent.tags[tagName] = undefined
      } else {
        while (el.firstChild) el.removeChild(el.firstChild)
      }

      if (!keepRootTag)
        p.removeChild(el)

    }


    self.trigger('unmount')
    toggle()
    self.off('*')
    // somehow ie8 does not like `delete root._tag`
    root._tag = null

  }

  function toggle(isMount) {

    // mount/unmount children
    each(childTags, function(child) { child[isMount ? 'mount' : 'unmount']() })

    // listen/unlisten parent (events flow one way from parent to children)
    if (parent) {
      var evt = isMount ? 'on' : 'off'

      // the loop tags will be always in sync with the parent automatically
      if (isLoop)
        parent[evt]('unmount', self.unmount)
      else
        parent[evt]('update', self.update)[evt]('unmount', self.unmount)
    }
  }

  // named elements available for fn
  parseNamedElements(dom, this, childTags)


}

function setEventHandler(name, handler, dom, tag, item) {

  dom[name] = function(e) {

    // cross browser event fix
    e = e || window.event

    if (!e.which) e.which = e.charCode || e.keyCode
    if (!e.target) e.target = e.srcElement

    // ignore error on some browsers
    try {
      e.currentTarget = dom
    } catch (ignored) { '' }

    e.item = tag._item ? tag._item : item

    // prevent default behaviour (by default)
    if (handler.call(tag, e) !== true && !/radio|check/.test(dom.type)) {
      e.preventDefault && e.preventDefault()
      e.returnValue = false
    }

    if (!e.preventUpdate) {
      var el = item ? tag.parent : tag
      el.update()
    }

  }

}

// used by if- attribute
function insertTo(root, node, before) {
  if (root) {
    root.insertBefore(before, node)
    root.removeChild(node)
  }
}

// item = currently looped item
function update(expressions, tag, item) {

  each(expressions, function(expr, i) {

    var dom = expr.dom,
        attrName = expr.attr,
        value = tmpl(expr.expr, tag),
        parent = expr.dom.parentNode

    if (value == null) value = ''

    // leave out riot- prefixes from strings inside textarea
    if (parent && parent.tagName == 'TEXTAREA') value = value.replace(/riot-/g, '')

    // no change
    if (expr.value === value) return
    expr.value = value

    // text node
    if (!attrName) return dom.nodeValue = value.toString()

    // remove original attribute
    remAttr(dom, attrName)

    // event handler
    if (typeof value == 'function') {
      setEventHandler(attrName, value, dom, tag, item)

    // if- conditional
    } else if (attrName == 'if') {
      var stub = expr.stub

      // add to DOM
      if (value) {
        if (stub) {
          insertTo(stub.parentNode, stub, dom)
          dom.inStub = false
          // avoid to trigger the mount event if the tags is not visible yet
          // maybe we can optimize this avoiding to mount the tag at all
          if (!isInStub(dom)) {
            walk(dom, function(el) {
              if (el._tag && !el._tag.isMounted) el._tag.isMounted = !!el._tag.trigger('mount')
            })
          }
        }
      // remove from DOM
      } else {
        stub = expr.stub = stub || document.createTextNode('')
        insertTo(dom.parentNode, dom, stub)
        dom.inStub = true
      }
    // show / hide
    } else if (/^(show|hide)$/.test(attrName)) {
      if (attrName == 'hide') value = !value
      dom.style.display = value ? '' : 'none'

    // field value
    } else if (attrName == 'value') {
      dom.value = value

    // <img src="{ expr }">
    } else if (attrName.slice(0, 5) == 'riot-' && attrName != 'riot-tag') {
      attrName = attrName.slice(5)
      value ? dom.setAttribute(attrName, value) : remAttr(dom, attrName)

    } else {
      if (expr.bool) {
        dom[attrName] = value
        if (!value) return
        value = attrName
      }

      if (typeof value != 'object') dom.setAttribute(attrName, value)

    }

  })

}

function each(els, fn) {
  for (var i = 0, len = (els || []).length, el; i < len; i++) {
    el = els[i]
    // return false -> remove current item during loop
    if (el != null && fn(el, i) === false) i--
  }
  return els
}

function isFunction(v) {
  return typeof v === 'function' || false   // avoid IE problems
}

function remAttr(dom, name) {
  dom.removeAttribute(name)
}

function fastAbs(nr) {
  return (nr ^ (nr >> 31)) - (nr >> 31)
}

function getTagName(dom) {
  var child = getTag(dom),
    namedTag = dom.getAttribute('name'),
    tagName = namedTag && namedTag.indexOf(brackets(0)) < 0 ? namedTag : child.name

  return tagName
}

function extend(src) {
  var obj, args = arguments
  for (var i = 1; i < args.length; ++i) {
    if ((obj = args[i])) {
      for (var key in obj) {      // eslint-disable-line guard-for-in
        src[key] = obj[key]
      }
    }
  }
  return src
}

function mkdom(template) {
  var checkie = ieVersion && ieVersion < 10,
      matches = /^\s*<([\w-]+)/.exec(template),
      tagName = matches ? matches[1].toLowerCase() : '',
      rootTag = (tagName === 'th' || tagName === 'td') ? 'tr' :
                (tagName === 'tr' ? 'tbody' : 'div'),
      el = mkEl(rootTag)

  el.stub = true

  if (checkie) {
    if (tagName === 'optgroup')
      optgroupInnerHTML(el, template)
    else if (tagName === 'option')
      optionInnerHTML(el, template)
    else if (rootTag !== 'div')
      tbodyInnerHTML(el, template, tagName)
    else
      checkie = 0
  }
  if (!checkie) el.innerHTML = template

  return el
}

function walk(dom, fn) {
  if (dom) {
    if (fn(dom) === false) walk(dom.nextSibling, fn)
    else {
      dom = dom.firstChild

      while (dom) {
        walk(dom, fn)
        dom = dom.nextSibling
      }
    }
  }
}

function isInStub(dom) {
  while (dom) {
    if (dom.inStub) return true
    dom = dom.parentNode
  }
  return false
}

function mkEl(name) {
  return document.createElement(name)
}

function replaceYield (tmpl, innerHTML) {
  return tmpl.replace(/<(yield)\/?>(<\/\1>)?/gim, innerHTML || '')
}

function $$(selector, ctx) {
  return (ctx || document).querySelectorAll(selector)
}

function inherit(parent) {
  function Child() {}
  Child.prototype = parent
  return new Child()
}

function setNamed(dom, parent, keys) {
  each(dom.attributes, function(attr) {
    if (dom._visited) return
    if (attr.name === 'id' || attr.name === 'name') {
      dom._visited = true
      var p, v = attr.value
      if (~keys.indexOf(v)) return

      p = parent[v]
      if (!p)
        parent[v] = dom
      else
        isArray(p) ? p.push(dom) : (parent[v] = [p, dom])
    }
  })
}
/**
 *
 * Hacks needed for the old internet explorer versions [lower than IE10]
 *
 */

function tbodyInnerHTML(el, html, tagName) {
  var div = mkEl('div'),
      loops = /td|th/.test(tagName) ? 3 : 2,
      child

  div.innerHTML = '<table>' + html + '</table>'
  child = div.firstChild

  while (loops--) {
    child = child.firstChild
  }

  el.appendChild(child)

}

function optionInnerHTML(el, html) {
  var opt = mkEl('option'),
      valRegx = /value=[\"'](.+?)[\"']/,
      selRegx = /selected=[\"'](.+?)[\"']/,
      eachRegx = /each=[\"'](.+?)[\"']/,
      ifRegx = /if=[\"'](.+?)[\"']/,
      innerRegx = />([^<]*)</,
      valuesMatch = html.match(valRegx),
      selectedMatch = html.match(selRegx),
      innerValue = html.match(innerRegx),
      eachMatch = html.match(eachRegx),
      ifMatch = html.match(ifRegx)

  if (innerValue) {
    opt.innerHTML = innerValue[1]
  } else {
    opt.innerHTML = html
  }

  if (valuesMatch) {
    opt.value = valuesMatch[1]
  }

  if (selectedMatch) {
    opt.setAttribute('riot-selected', selectedMatch[1])
  }

  if (eachMatch) {
    opt.setAttribute('each', eachMatch[1])
  }

  if (ifMatch) {
    opt.setAttribute('if', ifMatch[1])
  }

  el.appendChild(opt)
}

function optgroupInnerHTML(el, html) {
  var opt = mkEl('optgroup'),
      labelRegx = /label=[\"'](.+?)[\"']/,
      elementRegx = /^<([^>]*)>/,
      tagRegx = /^<([^ \>]*)/,
      labelMatch = html.match(labelRegx),
      elementMatch = html.match(elementRegx),
      tagMatch = html.match(tagRegx),
      innerContent = html

  if (elementMatch) {
    var options = html.slice(elementMatch[1].length+2, -tagMatch[1].length-3).trim()
    innerContent = options
  }

  if (labelMatch) {
    opt.setAttribute('riot-label', labelMatch[1])
  }

  if (innerContent) {
    var innerOpt = mkEl('div')

    optionInnerHTML(innerOpt, innerContent)

    opt.appendChild(innerOpt.firstChild)
  }

  el.appendChild(opt)
}

/*
 Virtual dom is an array of custom tags on the document.
 Updates and unmounts propagate downwards from parent to children.
*/

var virtualDom = [],
    tagImpl = {},
    styleNode

var RIOT_TAG = 'riot-tag'

function getTag(dom) {
  return tagImpl[dom.getAttribute(RIOT_TAG) || dom.tagName.toLowerCase()]
}

function injectStyle(css) {

  styleNode = styleNode || mkEl('style')

  if (!document.head) return

  if (styleNode.styleSheet)
    styleNode.styleSheet.cssText += css
  else
    styleNode.innerHTML += css

  if (!styleNode._rendered)
    if (styleNode.styleSheet) {
      document.body.appendChild(styleNode)
    } else {
      var rs = $$('style[type=riot]')[0]
      if (rs) {
        rs.parentNode.insertBefore(styleNode, rs)
        rs.parentNode.removeChild(rs)
      } else {
        document.head.appendChild(styleNode)
      }
    }

  styleNode._rendered = true

}

function mountTo(root, tagName, opts) {
  var tag = tagImpl[tagName],
      // cache the inner HTML to fix #855
      innerHTML = root._innerHTML = root._innerHTML || root.innerHTML

  // clear the inner html
  root.innerHTML = ''

  if (tag && root) tag = new Tag(tag, { root: root, opts: opts }, innerHTML)

  if (tag && tag.mount) {
    tag.mount()
    virtualDom.push(tag)
    return tag.on('unmount', function() {
      virtualDom.splice(virtualDom.indexOf(tag), 1)
    })
  }

}

riot.tag = function(name, html, css, attrs, fn) {
  if (isFunction(attrs)) {
    fn = attrs
    if (/^[\w\-]+\s?=/.test(css)) {
      attrs = css
      css = ''
    } else attrs = ''
  }
  if (css) {
    if (isFunction(css)) fn = css
    else injectStyle(css)
  }
  tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
  return name
}

riot.mount = function(selector, tagName, opts) {

  var els,
      allTags,
      tags = []

  // helper functions

  function addRiotTags(arr) {
    var list = ''
    each(arr, function (e) {
      list += ', *[riot-tag="'+ e.trim() + '"]'
    })
    return list
  }

  function selectAllTags() {
    var keys = Object.keys(tagImpl)
    return keys + addRiotTags(keys)
  }

  function pushTags(root) {
    if (root.tagName) {
      if (tagName && !root.getAttribute(RIOT_TAG))
        root.setAttribute(RIOT_TAG, tagName)

      var tag = mountTo(root,
        tagName || root.getAttribute(RIOT_TAG) || root.tagName.toLowerCase(), opts)

      if (tag) tags.push(tag)
    }
    else if (root.length) {
      each(root, pushTags)   // assume nodeList
    }
  }

  // ----- mount code -----

  if (typeof tagName === T_OBJECT) {
    opts = tagName
    tagName = 0
  }

  // crawl the DOM to find the tag
  if (typeof selector === T_STRING) {
    if (selector === '*') {
      // select all the tags registered
      // and also the tags found with the riot-tag attribute set
      selector = allTags = selectAllTags()
    } else {
      // or just the ones named like the selector
      selector += addRiotTags(selector.split(','))
    }
    els = $$(selector)
  }
  else
    // probably you have passed already a tag or a NodeList
    els = selector

  // select all the registered and mount them inside their root elements
  if (tagName === '*') {
    // get all custom tags
    tagName = allTags || selectAllTags()
    // if the root els it's just a single tag
    if (els.tagName) {
      els = $$(tagName, els)
    } else {
      // select all the children for all the different root elements
      var nodeList = []
      each(els, function (_el) {
        nodeList.push($$(tagName, _el))
      })
      els = nodeList
    }
    // get rid of the tagName
    tagName = 0
  }

  if (els.tagName)
    pushTags(els)
  else
    each(els, pushTags)

  return tags
}

// update everything
riot.update = function() {
  return each(virtualDom, function(tag) {
    tag.update()
  })
}

// @deprecated
riot.mountTo = riot.mount


  // share methods for other riot parts, e.g. compiler
  riot.util = { brackets: brackets, tmpl: tmpl }

  // support CommonJS, AMD & browser
  if (typeof exports === 'object')
    module.exports = riot
  else if (typeof define === 'function' && define.amd)
    define(function() { return riot })
  else
    window.riot = riot

})(typeof window != 'undefined' ? window : undefined);

},{}],17:[function(require,module,exports){
'use strict'

var base64DecodeToArray = require('./lib/b64decode.js')
var parseNote = require('note-parser')

function Soundfont (audioContext) {
  if (!(this instanceof Soundfont)) return new Soundfont(audioContext)
  this.ctx = audioContext
  this.instruments = {}
  this.promises = []
}

Soundfont.prototype.instrument = function (name) {
  if (!name) return createDefaultInstrument(this.ctx, 'default')
  var inst = this.instruments[name]
  if (!inst) {
    var ctx = this.ctx
    inst = createDefaultInstrument(ctx, name)
    var promise = Soundfont.loadBuffers(ctx, name).then(function (buffers) {
      var realInst = createInstrument(ctx, name, buffers)
      inst.play = realInst.play
    })
    this.promises.push(promise)
    inst.onready = function (callback) {
      return promise.then(callback)
    }
    this.instruments[name] = inst
  }
  return inst
}

Soundfont.prototype.onready = function (callback) {
  Promise.all(this.promises).then(callback)
}

Soundfont.noteToMidi = function (note) {
  if (!note) return null
  if (note.midi) return note.midi
  if (!isNaN(note)) return note
  else return parseNote(note).midi
}

/*
 * Soundfont.nameToUrl
 * Given an instrument name returns a URL to its Soundfont js file
 *
 * @param {String} name - instrument name
 * @returns {String} the Soundfont data url
 */
Soundfont.nameToUrl = function (name) {
  return 'https://cdn.rawgit.com/gleitz/midi-js-Soundfonts/master/FluidR3_GM/' + name + '-ogg.js'
}

/*
 * SoundFont.getScript
 *
 * Given a script URL returns a Promise with the script contents as text
 * @param {String} url - the URL
 */
Soundfont.loadData = function (url) {
  return new Promise(function (done, reject) {
    var req = new window.XMLHttpRequest()
    req.open('GET', url)

    req.onload = function () {
      if (req.status === 200) {
        done(req.response)
      } else {
        reject(Error(req.statusText))
      }
    }
    req.onerror = function () {
      reject(Error('Network Error'))
    }
    req.send()
  })
}

/*
 *  Parse the SoundFont data and return a JSCON object
 *  (SoundFont data are .js files wrapping json data)
 *
 * @param {String} data - the SoundFont js file content
 * @returns {JSON} the parsed data as JSON object
 */
Soundfont.dataToJson = function (data) {
  var begin = data.indexOf('MIDI.Soundfont.')
  begin = data.indexOf('=', begin) + 2
  var end = data.lastIndexOf(',')
  return JSON.parse(data.slice(begin, end) + '}')
}

/*
 * loadBuffers
 *
 * Given a Web Audio context and a instrument name
 * load the instrument data and return a hash of audio buffers
 *
 * @param {Object} ctx - A Web Audio context
 * @param {String} name - the sounfont instrument name
 */
Soundfont.loadBuffers = function (ctx, name) {
  return Promise.resolve(name)
    .then(Soundfont.nameToUrl)
    .then(Soundfont.loadData)
    .then(Soundfont.dataToJson)
    .then(function (jsonData) {
      return createBank(ctx, name, jsonData)
    })
    .then(decodeBank)
    .then(function (bank) {
      return bank.buffers
    })
}

/*
 * @param {Object} ctx - Web Audio context
 * @param {String} name - The bank name
 * @param {Object} data - The Soundfont instrument data as JSON
 */
function createBank (ctx, name, data) {
  var bank = { ctx: ctx, name: name, data: data }
  bank.buffers = {}

  return bank
}

/*
 * INTENAL: decodeBank
 * Given an instrument, returns a Promise that resolves when
 * all the notes from de instrument are decoded
 */
function decodeBank (bank) {
  var promises = Object.keys(bank.data).map(function (note) {
    return decodeNote(bank.ctx, bank.data[note])
      .then(function (buffer) {
        note = parseNote(note)
        bank.buffers[note.midi] = buffer
      })
  })

  return Promise.all(promises).then(function () {
    return bank
  })
}

/*
 * Given a WAA context and a base64 encoded buffer data returns
 * a Promise that resolves when the buffer is decoded
 */
function decodeNote (context, data) {
  return new Promise(function (done, reject) {
    var decodedData = base64DecodeToArray(data.split(',')[1]).buffer
    context.decodeAudioData(decodedData, function (buffer) {
      done(buffer)
    }, function (e) {
      reject('DecodeAudioData error', e)
    })
  })
}

/*
 * createDefaultInstrument
 */
function createDefaultInstrument (context, name) {
  var instrument = {
    name: name,
    play: function (note, time, duration, options) {
      note = parseNote(note)
      options = options || {}
      var gain = options.gain || 0.2
      var vcoType = options.vcoType || 'sine'

      var vco = context.createOscillator()
      vco.type = vcoType
      vco.frequency.value = note.freq

      /* VCA */
      var vca = context.createGain()
      vca.gain.value = gain

      /* Connections */
      vco.connect(vca)
      vca.connect(context.destination)

      vco.start(time)
      vco.stop(time + duration)
      return vco
    }
  }
  return instrument
}

function createInstrument (audioContext, name, buffers) {
  var instrument = {
    name: name,
    play: function (note, time, duration) {
      var midi = Soundfont.noteToMidi(note)
      var buffer = buffers[midi]
      if (!buffer) {
        console.log('WARNING: Note buffer not found: ', note)
        return
      }
      var source = audioContext.createBufferSource()
      source.buffer = buffer
      source.connect(audioContext.destination)
      source.start(time)
      if (duration) source.stop(time + duration)
      return source
    }
  }
  return instrument
}

if (typeof module === 'object' && module.exports) module.exports = Soundfont
if (typeof window !== 'undefined') window.Soundfont = Soundfont

},{"./lib/b64decode.js":18,"note-parser":19}],18:[function(require,module,exports){
'use strict'

function b64ToUint6 (nChr) {
  return nChr > 64 && nChr < 91 ?
    nChr - 65
    : nChr > 96 && nChr < 123 ?
      nChr - 71
      : nChr > 47 && nChr < 58 ?
        nChr + 4
        : nChr === 43 ?
          62
          : nChr === 47 ?
            63
            :
            0

}

// Decode Base64 to Uint8Array
// ---------------------------
function base64DecodeToArray (sBase64, nBlocksSize) {
  var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, '')
  var nInLen = sB64Enc.length
  var nOutLen = nBlocksSize ?
    Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize :
    nInLen * 3 + 1 >> 2
  var taBytes = new Uint8Array(nOutLen)

  for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
    nMod4 = nInIdx & 3
    nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4
    if (nMod4 === 3 || nInLen - nInIdx === 1) {
      for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
        taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255
      }
      nUint24 = 0
    }
  }
  return taBytes
}

module.exports = base64DecodeToArray

},{}],19:[function(require,module,exports){
'use strict';

var NOTE = /^([a-gA-G])(#{0,2}|b{0,2})(-?\d{0,1})$/
/*
 * parseNote
 *
 * @param {String} note - the note string to be parsed
 * @return {Object} a object with the following attributes:
 * - pc: pitchClass, the letter of the note, ALWAYS in lower case
 * - acc: the accidentals (or '' if no accidentals)
 * - oct: the octave as integer. By default is 4
 */
var parse = function(note, defaultOctave, defaultValue) {
  var parsed, match;
  if(typeof(note) === 'string' && (match = NOTE.exec(note))) {
    var octave = match[3] !== '' ? +match[3] : (defaultOctave || 4);
    parsed = { pc: match[1].toLowerCase(),
      acc: match[2], oct: octave };
  } else if(typeof(note.pc) !== 'undefined'
    && typeof(note.acc) !== 'undefined'
    && typeof(note.oct) !== 'undefined') {
    parsed = note;
  }

  if (parsed) {
    parsed.midi = parsed.midi || toMidi(parsed);
    parsed.freq = parsed.freq || midiToFrequency(parsed.midi);
    return parsed;
  } else if (typeof(defaultValue) !== 'undefined') {
    return defaultValue;
  } else {
    throw Error("Invalid note format: " + note);
  }
}

parse.toString = function(obj) {
  return obj.pc + obj.acc + obj.oct;
}

var SEMITONES = {c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 }
function toMidi(note) {
  var alter = note.acc.length;
  if(note.acc[0] === 'b') alter = -1 * alter;
  return SEMITONES[note.pc] + alter + 12 * (note.oct + 1);
}
function midiToFrequency (note) {
    return Math.pow(2, (note-69)/12)*440;
}

module.exports = parse;

},{}]},{},[2]);

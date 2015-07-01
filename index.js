
module.exports = Scale

var EMPTY_ARRAY = []

function Scale (name) {
  if (!(this instanceof Scale)) return new Scale(name)

  if (/^[01]+$/.test(name)) {
    this.binary = name
    this.decimal = parseInt(name, 2)
  } else if (/^\d+$/.test(name)) {
    this.decimal = +name
    this.binary = this.decimal.toString(2)
  } else {
    this._name = name
    this.decimal = Scale.byName[name]
    if (!this.decimal) throw Error('Scale not found: "' + name + '"')
    this.binary = this.decimal.toString(2)
  }
  this.length = (this.binary.match(/1/g) || EMPTY_ARRAY).length

  if (this.binary.length !== 12) {
    throw Error('Scale binary (' + this.binary + ') must have 12 digits: ' + this.binary.length)
  }
  if (this.binary.charAt(0) !== '1') {
    throw Error('Scale should have root: ' + this.binary + ' (' + name + ')')
  }
}

Scale.prototype.isMusical = function () {
  return this.length > 2 && this.length < 9 &&
    this.binary.match(/111/) === null
}

Scale.prototype.name = function () {
  if (!this._name) {
    var names = Scale.names[this.decimal]
    this._name = names ? names[0] : ''
  }
  return this._name
}

Scale.prototype.steps = function () {
  this._steps = this._steps || buildSteps(this.binary)
  return this._steps
}

function buildSteps (binary) {
  var array = rotate(binary.split(''), 1)
  var steps = []
  var current = 1
  array.forEach(function (digit, index) {
    if (digit === '0') {
      current++
    } else {
      steps.push(current)
      current = 1
    }
  })
  return steps
}

Scale.prototype.numbers = function () {
  this._numbers = this._numbers || buildNumbers(this.binary)
  return this._numbers
}

var NUMBERS = ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7']
function buildNumbers (binary) {
  return binary.split('')
    .map(function (digit, index) {
      return digit === '1' ? NUMBERS[index] : null
    })
    .filter(function (n) { return n })
}

Scale.fromNumbers = function (array) {
  var numbers = array.map(function (i) {
    return i.toString()
  })
  return new Scale(NUMBERS.map(function (num) {
    return numbers.indexOf(num) >= 0 ? '1' : '0'
  }).join(''))
}

Scale.prototype.intervals = function () {
  this._intervals = this._intervals || buildIntervals(this.binary)
  return this._intervals
}

var INTERVALS = ['P1', 'm2', 'M2', 'm3', 'M3', 'P4',
  'd5', 'P5', 'm6', 'M6', 'm7', 'M7']
function buildIntervals (binary) {
  var intervals = binary.split('').map(function (digit, index) {
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

Scale.prototype.modes = function () {
  this._modes = this._modes || buildModes(this.binary.split(''))
  return this._modes
}

Scale.prototype.mode = function (num) {
  var count = this.modes().length
  return new Scale(this.modes()[(num - 1) % count])
}

Scale.prototype.reflection = function () {
  return new Scale(this.binary.split('').reverse().join(''))
}

Scale.prototype.coscale = function () {
  var array = this.binary.split('').map(function (char) {
    return char === '0' ? '1' : '0'
  })
  for (var i = 0, len = array.length; i < len; i++) {
    if (array[i] === '1') return new Scale(rotate(array, i, len).join(''))
  }
  throw Error('Something went wrong')
}

function buildModes (array) {
  var modes = []
  for (var i = 0, len = array.length; i < len; i++) {
    modes.push(rotate(array, i, len).join(''))
  }
  return modes.filter(function (binary) {
    return binary.charAt(0) === '1'
  })
}

function rotate (array, num, len) {
  len = len || array.length
  return array.slice(num, len).concat(array.slice(0, num))
}

Scale.byName = {}
Scale.names = {}
Scale.addNames = function (names) {
  Object.keys(names).forEach(function (decimal) {
    var modes = buildModes(parseInt(decimal, 10).toString(2).split(''))
    var modeNames = names[decimal]
    modes.forEach(function (mode, index) {
      var modeDecimal = parseInt(mode, 2)
      var names = modeNames[index] || modeNames[0].map(function (n) {
        return n + ' mode ' + (index + 1)
      })
      Scale.names[modeDecimal] = names
      names.forEach(function (name) {
        Scale.byName[name] = modeDecimal
      })
    })
  })
}
Scale.commonScales = [2708, 2418, 2514, 2387, 2773, 2901, 2905]

Scale.addNames({
  '2708': [['major pentatonic'], ['dorian pentatonic'], ['phrygian pentatonic'],
    ['mixolydian pentatonic'], ['minor pentatonic']],
  '2418': [['first blues', 'minor blues']],
  '2514': [['second blues']],
  '2387': [['third blues']],
  '2773': [['major', 'ionian'], ['dorian'], ['phrygian'], ['lydian'],
    ['mixolydian', 'dominant'], ['aeolian'], ['locrian']],
  '2901': [['melodic minor', 'melodic'], ['melodic minor second mode'],
    ['lydian augmented'], ['lydian dominant', 'lydian b7'],
    ['melodic minor fifth mode', 'hindu', 'mixolydian b6'],
    ['locrian #2'], ['altered', 'super locrian', 'diminished whole tone']],
  '2905': [['harmonic minor', 'harmonic'], ['locrian 6'], ['ionian augmented'],
    ['dorian #4', 'romanian minor'], ['phrygian major', 'spanish'], ['lydian #2'],
    ['super locrian bb7']]
})

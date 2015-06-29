
module.exports = Scale

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

  if (this.binary.charAt(0) !== '1') {
    throw Error('Wrong binary number: ' + this.binary + ' (' + name + ')')
  }
}

Scale.prototype.name = function () {
  if (!this._name) {
    var names = Scale.names[this.decimal]
    this._name = names ? names[0] : ''
  }
  return this._name
}

Scale.prototype.intervals = function () {
  this._intervals = this._intervals || buildIntervals(this.binary)
  return this._intervals
}

var INTERVALS = [['P1'], ['m2'], ['M2', 'A2'], ['m3'], ['M3'], ['P4'],
  ['d5', 'A4'], ['P5'], ['m6', 'A5'], ['M6'], ['m7', 'A6'], ['M7']]
function buildIntervals (binary) {
  var intervals = []
  var name
  for (var i = binary.length - 1; i > -1; i++) {
    name = INTERVALS[i]
    intervals.unshift(name[0])
  }
  if (binary.charAt(7) === '1' && binary.charAt(6) === '1') {
    intervals[intervals.indexOf('d5')] = 'A4'
  }
  return intervals
}

Scale.prototype.modes = function () {
  this._modes = this._modes || buildmodes(this.binary.split(''))
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

function buildmodes (array) {
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

Scale.use = function (names) {
  Scale.byName = {}
  Scale.names = names
  Object.keys(names).forEach(function (scale) {
    names[scale].forEach(function (name) {
      Scale.byName[name] = +scale
    })
  })
}
Scale.basicNames = {
  '2773': ['major'],
  '2901': ['melodic minor', 'melodic'],
  '2905': ['harmonic minor', 'harmonic']
}
Scale.use(Scale.basicNames)

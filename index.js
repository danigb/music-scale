
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

Scale.names = {
  2773: ['major'],
  2901: ['minor melodic', 'melodic'],
  2905: ['minor harmonic', 'harmonic']
}

Scale.byName = {}
Object.keys(Scale.names).forEach(function (scale) {
  Scale.names[scale].forEach(function (name) {
    Scale.byName[name] = +scale
  })
})

Scale.prototype.name = function () {
  if (!this._name) {
    var names = Scale.names[this.decimal]
    this._name = names ? names[0] : ''
  }
  return this._name
}

var INTERVALS = ['P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'd5', 'P5', 'm6', 'M6', 'm7', 'M7']
Scale.prototype.intervals = function () {
  this._intervals = this._intervals || this.binary.split('').reduce(function (intervals, val, index) {
    if (val === '1') intervals.push(INTERVALS[index])
    return intervals
  }, [])
  return this._intervals
}

Scale.prototype.rotations = function () {
  this._rotations = this._rotations || buildRotations(this.binary.split(''))
  return this._rotations
}

Scale.prototype.rotate = function (num) {
  var count = this.rotations().length
  return new Scale(this.rotations()[num % count])
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

function buildRotations (array) {
  var rotations = []
  for (var i = 0, len = array.length; i < len; i++) {
    rotations.push(rotate(array, i, len).join(''))
  }
  return rotations.filter(function (binary) {
    return binary.charAt(0) === '1'
  })
}

function rotate (array, num, len) {
  len = len || array.length
  return array.slice(num, len).concat(array.slice(0, num))
}

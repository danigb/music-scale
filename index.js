'use strict'

module.exports = Scale

var IS_BINARY = /^[01]+$/
var IS_NUMBER = /^\d+$/
function Scale (num, names) {
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
  if (names) this._names = names
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

Scale.prototype.names = function () { return this._names || Scale.Names.fromDecimal(this.decimal) }
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
Scale.prototype.steps = function () {
  return (this.binary.match(STEPS)).map(lengthOf)
}

/*
 * leap
 *
 * Useful to limit the number of scales: "The requirement of no step greater
 * than a major third is somewhat arbitrary, but does allow us to include
 * commonly used scales like the Pentatonic" - William Zeitler
 *
 * @returns the maximum number of semitones between two notes of the scale
 */
Scale.prototype.leap = function () {
  return (this.binary.match(STEPS)).reduce(function (num, zeros) {
    return Math.max(num, zeros.length)
  }, 0)
}

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

Scale.prototype.modes = function () {
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
}

Scale.prototype.mode = function (num) {
  var count = this.modes().length
  return this.modes()[(num - 1) % count]
}

Scale.prototype.cannonicalMode = function () {
  var ordered = this.modes().sort(function (scaleA, scaleB) {
    var stepsA = +scaleA.steps().join('')
    var stepsB = +scaleB.steps().join('')
    return stepsA - stepsB
  })
  return ordered[ordered.length - 1]
}

/*
 */
Scale.prototype.isModeOf = function (other) {
  var binary = other.binary ? other.binary : other
  return binary.length === this.binary.length &&
    (binary + binary).indexOf(this.binary) !== -1
}

Scale.prototype.reflection = function () {
  return Scale.get(this.binary.split('').reverse().join(''))
}

Scale.prototype.coscale = function () {
  var inv = this.binary.replace(/0/g, 'L').replace(/1/g, '0').replace(/L/g, 1)
  return Scale.get(rotate(inv, inv.indexOf('1')))
}

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

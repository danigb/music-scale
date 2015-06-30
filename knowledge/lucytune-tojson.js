// Quick and dirty convert from html file to json data

var fs = require('fs')
var path = require('path')

// http://www.lucytune.com/scales/ScaleCoding2013.htm
var input = path.join(__dirname, 'lucytune-scales.html')
var output = path.join(__dirname, 'lucytune-scales.json')

var content = fs.readFileSync(input, 'utf8')

var KEYS = ['name', 'altName', 'positions', 'binary', 'noteNumber',
  'dissonance', 'noteNames', 'intervals', 'coding', 'triadsMajor',
  'triadsMinor', 'triadsAug', 'triadsDim']
var parsed = content.split('TR').slice(3, -1)
  .filter(function (l) { return l.length > 3})
  .map(function (l) { return l.slice(1, -2) })
  .map(function (l) {
    return l.split('</TD>').map(function (d) {
      return d.replace('<TD>', '').replace(/\<BR\>/g, '')
        .replace('Theoretical - No Known Name', '?')
    })
  }).map(function (array) {
    var obj = {}
    KEYS.forEach(function (key, index) {
      obj[key] = array[index]
    })
    return obj
  }).filter(function (scale) {
    return scale.binary.length > 1
  }).map(function (scale) {
    scale.noteNames = scale.noteNames.replace('.', '').trim().split(/\s+/)
    scale.positions = scale.positions.replace('.', '').trim().split(/\s+/)
    return scale
  })

fs.writeFileSync(output, JSON.stringify(parsed, null, 2))
console.log('Total scales parsed:', parsed.length)

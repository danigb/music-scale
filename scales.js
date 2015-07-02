var Scales = {}
Scales.byName = {}
Scales.names = {}
Scales.addNames = function (names) {
  Object.keys(names).forEach(function (decimal) {
    var modes = buildModes(parseInt(decimal, 10).toString(2).split(''))
    var modeNames = names[decimal]
    modes.forEach(function (mode, index) {
      var modeDecimal = parseInt(mode, 2)
      var names = modeNames[index] || modeNames[0].map(function (n) {
        return n + ' mode ' + (index + 1)
      })
      Scales.names[modeDecimal] = names
      names.forEach(function (name) {
        Scales.byName[name] = modeDecimal
      })
    })
  })
}
Scales.commonScales = [2708, 2418, 2514, 2387, 2773, 2901, 2905]

Scales.addNames({
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

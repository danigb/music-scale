
<browser>
  <div class="app">
    <div class="search">
      <search events={ events }></search>
    </div>
    <div if={ scale } class="details">
      <h2>Scale: { scale.name }
        <small if={ scale.altNames }>({ scale.altNames })</small>
      </h2>
      <h4>[{ scale.decimal }] { scale.binary } { scale.type }</h4>
      <div class="properties">
        <label>Cannonical: </label>{ scale.cannonicalName }<br>
      </div>
      <h3>Modes</h3>
      <div each ={ scale.modes } class="modes">
        <a>{ binary } { name }</a>
    </div>
  </div>

  <style scoped>
    .app { width: 100%; overflow: hidden; }
    .search { width: 33%; float: left; }
  </style>

  <script>
    var types = ['one note', 'interval', 'triad', 'cuatriad', 'pentatonic',
      'hexatonic', 'heptatonic', 'octatonic', '9 notes', '10 notes', '11 notes', '12 notes']
    var self = this
    this.events = riot.observable(this)
    this.scale_name = ''

    this.events.on('select', function(name) {
      var scale = Scale.get(name)
      self.scale = {
        name: name,
        type: types[scale.length - 1],
        decimal: scale.decimal,
        binary: scale.binary,
        altNames: scale.names().filter(function(altName) {
          return altName !== name
        }).join(', '),
        modes: scale.modes().map(function (mode) {
          return { binary: mode.binary, name: mode.name() }
        }),
        cannonicalName: scale.cannonicalMode().name()
      }
      self.update()
    })
    this.events.trigger('select', 'major')
  </script>
</browser>

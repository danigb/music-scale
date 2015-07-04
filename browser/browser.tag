
<browser>
  <div class="app">
    <div class="search">
      <search app={ app }></search>
    </div>
    <div class="scale">
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
          <a href="#" onclick={ parent.select } data-name={ binary }>{ binary } { name }</a>
      </div>
    </div>
  </div>

  <style scoped>
    :scope { font-family: 'myriad pro', sans-serif; }
    .app { width: 960px; margin: 40px auto; overflow: hidden; }
    .search { width: 33%; float: left; }
    .scale { margin-left: 33%; }
  </style>

  <script>
    var self = this
    this.app = this.opts.app

    select(e) {
      this.app.events.trigger('select', e.target.getAttribute('data-name'))
    }

    this.app.events.on('select', function(name) {
      self.scale = self.app.scales.get(name)
      self.update()
      document.body.scrollTop = document.documentElement.scrollTop = 0
    })
    this.app.events.trigger('select', 'major')


  </script>
</browser>

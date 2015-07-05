<roots>
  <div class="roots">
    <a each={ roots } class={ root: true, selected: selected } href="#" onclick={ parent.selected }>
      { name }
    </a>
  </div>

  <style scoped>
    .roots { width: 100%; overflow: hidden; }
    .roots a { display: block; float: left; text-decoration: none;
      padding: 0.2em 0.5em 0 0.5em; border: 1px solid black;
      margin-right: 0.2em;
    }
    .roots a.selected { background-color: yellow; }

  </style>

  <script>
    var self = this
    var app = this.opts.app
    self.roots = app.getRoots()

    app.events.on('select', function() {
      self.roots = app.getRoots()
      self.update()
    })

    selected(e) {
      app.setRoot(e.target.innerHTML.trim())
    }
  </script>
</roots>

<search>
  <h4>Search scale</h4>
  <input name="searchPattern" onkeyup={ search }>
  <div class="names">
    <label>Showing { filtered.length } of { allNames.length }</label>
    <a each={ filtered } data-name={ name }
      onclick={ parent.select } href="#">
      { name }
    </a>&nbsp;
  </div>

  <style scoped>
    input[name='searchPattern'] {
      font-size: 1em;
    }
    .names label { display: block; font-size: 0.8em; margin: 0.5em 0 1em 0; }
    .names a { display: block; }
  </style>

  <script>
    this.allNames = Scale.Names.names().map(function (name) {
      return { name: name, visible: true }
    })
    this.filtered = this.allNames.filter(byPattern)
    this.total = this.allNames.length

    select(e) {
      var name = e.target.getAttribute('data-name')
      this.opts.events.trigger('select', name)
    }

    search(e) {
      var pattern = this.pattern = e.target.value
      this.allNames.forEach(function (item) {
        item.visible = pattern.length === 0 || item.name.indexOf(pattern) >= 0
      })
      this.filtered = this.allNames.filter(byPattern)
    }

    function byPattern(item) {
      return item.visible
    }

  </script>
</search>

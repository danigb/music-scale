<search>
  <h4>Search scale</h4>
  <label>You can search by scale name, <br>decimal or equivalent binary</label>
  <input name="searchPattern" onkeyup={ search }>
  <div class="names">
    <label>Showing { results.length } of 2048</label>
    <a each={ name in results } data-name={ name }
      onclick={ parent.select } href="#">
      { name }
    </a>&nbsp;
  </div>

  <style scoped>
    input[name='searchPattern'] {
      font-size: 1em;
    }
    label { display: block; font-size: 0.8em; margin: 0.5em 0 1em 0; }
    .names a { display: block; }
  </style>

  <script>
    var app = this.opts.app
    this.results = app.getResults()

    select(e) {
      app.select(e.target.getAttribute('data-name'))
    }

    search(e) {
      app.setPattern(this.searchPattern.value)
      this.results = app.getResults()
      this.update()
    }

    this.searchPattern.focus()
  </script>
</search>

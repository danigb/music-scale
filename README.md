# music-scale

[![Build Status](https://travis-ci.org/danigb/music-scale.svg?branch=master)](https://travis-ci.org/danigb/music-scale)
[![Code Climate](https://codeclimate.com/github/danigb/music-scale/badges/gpa.svg)](https://codeclimate.com/github/danigb/music-scale)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![npm version](https://badge.fury.io/js/music-scale.png)](https://badge.fury.io/js/music-scale)

Music scales made easy:

```js
var scale = require('music-scale')
var major = scale('1 2 3 4 5 6 7')
major('A') // => ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']
```

## Install

Install via npm: `npm i --save music-scale` and require it. For browsers use browserify, webpack or a similar tool.

## Usage

#### Build scales from intervals

The simplest use case is build scales from intervals:

```js
scale('1M 2M 3m 7m', 'F') // => ['F', 'G', 'Ab', 'Eb'º]
scale('1 2 3 4 5', 'A3') // => ['A3', 'B3', 'C#4', 'D4', 'E4']
```

To know the interval string format see [interval-parser](https://github.com/danigb/interval-parser). Notice that if the tonic contains octave, the scale will have octaves in it.

Also, you can partially apply the `scale` function:

```js
var pentatonic = scale('1 2 3 5 6')
pentatonic('E') // => ['E', 'F#', 'G#', 'B', 'C#']
```

#### Build scales from notes

You can also use notes as the source of your scale:

```js
var lydian = scale('C D E F# G A B')
lydian('A') // => ['A', 'B', 'C#', 'D#', 'E', 'F#', 'G#']
```

#### Use a dictionary

You can build scales using a dictionary of names to intervals (or notes). Optionally, you can pass a dictionary of aliases:

```js
var scales = scale.fromName(
  {'major': 'C D E F G A B', 'minor': 'A B C D E F G'},
  {'ionian': 'major', 'eolian': 'minor'})
scales('major', 'F') // => ['F', 'G', 'A', 'Bb', 'C', 'D', 'E']
scales('ionian', 'A') // same as scales('major', 'A')
scales('eolian', 'G') // same as scales('minor', 'G')
scale('dorian', 'C') // => null
```

There is one scale and one aliases dictionary available:

```js
all = require('music-scale/scales.json')
aliases = require('music-scale/aliases.json')
var scales = scale.fromName(all, aliases)
scales('bebop locrian', 'C') // => [ 'C', 'Db', 'Eb', 'F', 'Gb', 'G', 'Ab', 'Bb']
```

_Reminder for webpack users: If you use the .json files you will need add a plugin to webpack.config file._

## API

<!-- START docme generated API please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN docme TO UPDATE -->

<div>
<div class="jsdoc-githubify">
<section>
<article>
<div class="container-overview">
<dl class="details">
</dl>
</div>
<dl>
<dt>
<h4 class="name" id="fromName"><span class="type-signature"></span>fromName<span class="signature">(dictionary, aliases, name, tonic)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Build a scale using a name from a dictionary</p>
<p>Normally you'll want to use this function partially applied.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>dictionary</code></td>
<td class="type">
<span class="param-type">Hash</span>
</td>
<td class="description last"><p>a dictionary to map names to intervals (or notes)</p></td>
</tr>
<tr>
<td class="name"><code>aliases</code></td>
<td class="type">
<span class="param-type">Hash</span>
</td>
<td class="description last"><p>an (optional, can be null) dictionary that maps names to names</p></td>
</tr>
<tr>
<td class="name"><code>name</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the scale name you want to build</p></td>
</tr>
<tr>
<td class="name"><code>tonic</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the scale tonic</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/music-scale/blob/master/index.js">index.js</a>
<span>, </span>
<a href="https://github.com/danigb/music-scale/blob/master/index.js#L63">lineno 63</a>
</li>
</ul></dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>var data = require('music-scale/all-scales.json')
var aliases = require('music-scale/scale-aliases.json')
var scales = scale.fromName(data, aliases)
scales('kumoi', 'G') // => ['G', 'A', 'Bb', 'D', 'E']</code></pre>
</dd>
<dt>
<h4 class="name" id="scale"><span class="type-signature"></span>scale<span class="signature">(source, tonic)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Build a scale from a source and a tonic</p>
<p>A source can be a list of intervals or notes. The tonic must be
a pitch (with or without octave)</p>
<p>This function is currified, so you can partially apply the function passing
one parameter instead of two</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>source</code></td>
<td class="type">
<span class="param-type">Array</span>
</td>
<td class="description last"><p>the list of intervals or notes</p></td>
</tr>
<tr>
<td class="name"><code>tonic</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the tonic of the scale</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/music-scale/blob/master/index.js">index.js</a>
<span>, </span>
<a href="https://github.com/danigb/music-scale/blob/master/index.js#L35">lineno 35</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the list of notes</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Array</span>
</dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>scale('1 2 3 5 6', 'G') // => ['G', 'A', 'B', 'D', 'E']
var dorian = scale('D E F G A B C')
dorian('C4')</code></pre>
</dd>
</dl>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->

## License

MIT License

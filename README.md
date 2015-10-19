# music-scale

[![Build Status](https://travis-ci.org/danigb/music-scale.svg?branch=master)](https://travis-ci.org/danigb/music-scale)
[![Code Climate](https://codeclimate.com/github/danigb/music-scale/badges/gpa.svg)](https://codeclimate.com/github/danigb/music-scale)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![npm version](https://img.shields.io/npm/v/music-scale.svg)](https://www.npmjs.com/package/music-scale)
[![license](https://img.shields.io/npm/l/music-scale.svg)](https://www.npmjs.com/package/music-scale)
[![pitch-array](https://img.shields.io/badge/pitch--array-compatible-yellow.svg)](https://github.com/danigb/pitch-array-notation)

Music scales made easy:

```js
var scale = require('music-scale')
var major = scale('1 2 3 4 5 6 7')
major('A') // => ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']
```

It includes a dictionary with more than 100 scales:

```js
var lydianAug = scale.fromName('lydian augmented')
lydianAug('C') // => ['C', 'D', 'E', 'F#', 'G#', 'A', 'B']
```

## Install

#### Node

Install via npm: `npm i --save music-scale` and require it.

#### Browsers

Currently there's no distribution for browsers, but is planned. You can use browserify, webpack or a similar tool to create one.

_For webpack users: If you use the .json files (or any function that consumes the json file like fromName and names) you will need add a plugin to webpack.config file._


## Usage

#### Build scales from intervals

The simplest use case is build scales from intervals:

```js
scale('1M 2M 3m 7m', 'F') // => ['F', 'G', 'Ab', 'Eb']
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

`scale` function assumes that the first note is the tonic.

#### Get scale intervals

You can get the scale intervals passing `null` as tonic:

```js
var dorian = scale('D E F G A B C')
dorian(null) // => ['1P', '2M', '3m', '4P', '5P', '6M', '7m']
```

#### Create a dictionary of scales

You can create a dictionary of scales with a hash that maps names to intervals (or notes). Optionally, you can pass a dictionary of aliases:

```js
var scales = scale.fromName(
  {'major': 'C D E F G A B', 'minor': 'A B C D E F G'},
  {'ionian': 'major', 'eolian': 'minor'})
scales('major', 'F') // => ['F', 'G', 'A', 'Bb', 'C', 'D', 'E']
scales('ionian', 'A') // same as scales('major', 'A')
scales('eolian', 'G') // same as scales('minor', 'G')
scale('dorian', 'C') // => null
```

#### Use the built-in scale dictionary

`music-scale` has a couple of .json data hash with about 100 scales (see [dict](https://github.com/danigb/music-scale/tree/master/dict) directory):

```js
scale.fromName('bebop locrian', 'C') // => [ 'C', 'Db', 'Eb', 'F', 'Gb', 'G', 'Ab', 'Bb']
```

You can get all scales names with `names` function:

```js
scale.names() // => ['major', 'minor', ...]
```

#### Get degrees of a scale

You can get specific degrees of a scale:

```js
scale.degrees('1 3 5', 'C D E F G A B') // => [ 'C', 'E', 'G' ]
scale.degrees('1 5 2 6', 'C D E F G A B') // => [ 'C', 'G', 'D', 'A' ]
```

Notice that scale notes are the same that the order of the degrees
(Jerry Bergonzi would be very happy with this...)

#### Scale detection

Not implemented yet: get the name of scale from a collection of notes

#### This library is too big

You can require the individual functions:

```js
var scale = require('music-scale/scale')
var fromName = require('music-scale/fromName')
```

### This library is too small

Sugestions welcomed. Pull request are perfect.

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
<h4 class="name" id="degrees"><span class="type-signature"></span>degrees<span class="signature">(degrees, notes)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get the degrees of a scale</p>
<p>The resulting array will contain the notes in the same order as degrees.
If a given degree is not present in the scale, the result will contain a
null in that position.</p>
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
<td class="name"><code>degrees</code></td>
<td class="type">
<span class="param-type">Array</span>
|
<span class="param-type">String</span>
</td>
<td class="description last"><p>the degrees numbers</p></td>
</tr>
<tr>
<td class="name"><code>notes</code></td>
<td class="type">
<span class="param-type">Array</span>
|
<span class="param-type">String</span>
</td>
<td class="description last"><p>the scale notes</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/music-scale/blob/master/degrees.js">degrees.js</a>
<span>, </span>
<a href="https://github.com/danigb/music-scale/blob/master/degrees.js#L13">lineno 13</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the notes of the given degrees (or null if not present)</p>
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
<pre class="prettyprint"><code>scale.degrees('1 3 5', 'C D E F G A B') // => [ 'C', 'E', 'G' ]
scale.degrees('1 5 2 6', 'C D E F G A B') // => [ 'C', 'G', 'D', 'A' ]
scale.degrees('1 2 6', 'C D E F G') // => [ 'C', 'D', null ]</code></pre>
</dd>
<dt>
<h4 class="name" id="dictionary"><span class="type-signature"></span>dictionary<span class="signature">(data, aliases)</span><span class="type-signature"> &rarr; {function}</span></h4>
</dt>
<dd>
<div class="description">
<p>Create a scale builder function from a hash of data</p>
<p>A scale builder is a function that given a names and a tonic, returns
a scale (array). It can be partially applied.</p>
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
<td class="name"><code>data</code></td>
<td class="type">
<span class="param-type">Hash</span>
</td>
<td class="description last"><p>the data (maps names to intervals or notes)</p></td>
</tr>
<tr>
<td class="name"><code>aliases</code></td>
<td class="type">
<span class="param-type">Hash</span>
</td>
<td class="description last"><p>(Optional) maps names to names in the data hash</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/music-scale/blob/master/dictionary.js">dictionary.js</a>
<span>, </span>
<a href="https://github.com/danigb/music-scale/blob/master/dictionary.js#L14">lineno 14</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>a function to create scales</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">function</span>
</dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>var scales = dictionary({ major: '1 2 3 4 5 6 7', minor: '1 2 3b 4 5 6b 7b' }, {eolian: 'minor'})
scales('major', 'C') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
scales('aeolian', 'A') // => ['A', 'B', 'C', 'D', 'E', 'F', 'G']
var minor = scales('minor')
minor('D') // => ['D', 'E', 'F', 'G', 'A', 'Bb', 'C']</code></pre>
</dd>
<dt>
<h4 class="name" id="fromName"><span class="type-signature"></span>fromName<span class="signature">(name, tonic)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Build a scale using a name and a tonic</p>
<p>It uses a dictionary of scales (see dict directory)</p>
<p>Can be partially applied (see example)</p>
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
<td class="name"><code>name</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the name of the scale</p></td>
</tr>
<tr>
<td class="name"><code>tonic</code></td>
<td class="type">
<span class="param-type">String</span>
|
<span class="param-type">Array</span>
</td>
<td class="description last"><p>the tonic of the scale</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/music-scale/blob/master/fromName.js">fromName.js</a>
<span>, </span>
<a href="https://github.com/danigb/music-scale/blob/master/fromName.js#L5">lineno 5</a>
</li>
</ul></dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>scale.fromName('bebop locrian', 'C') // => [ 'C', 'Db', 'Eb', 'F', 'Gb', 'G', 'Ab', 'Bb' ]
var kumoi = scale.fromName('kumoi')
kumoi('G') // => ['G', 'A', 'Bb', 'D', 'E']</code></pre>
</dd>
<dt>
<h4 class="name" id="names"><span class="type-signature"></span>names<span class="signature">(withAliases)</span><span class="type-signature"> &rarr; {Array.&lt;String>}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get all scale names available</p>
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
<td class="name"><code>withAliases</code></td>
<td class="type">
<span class="param-type">Boolean</span>
</td>
<td class="description last"><p>set to <code>true</code> to get aliases names</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/music-scale/blob/master/names.js">names.js</a>
<span>, </span>
<a href="https://github.com/danigb/music-scale/blob/master/names.js#L6">lineno 6</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the list of all scale names</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Array.&lt;String></span>
</dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>scale.names() // => ['major', 'minor', ...]</code></pre>
</dd>
<dt>
<h4 class="name" id="scale"><span class="type-signature"></span>scale<span class="signature">(source, tonic)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Build a scale from a source and a tonic. A scale is an array of notes (or
intervals if tonic is null) ordered by frequency</p>
<p>A source can be a list of intervals or notes. The tonic must be
a pitch (with or without octave) or null to get the scale intervals</p>
<p>This function is currified, so you can partially apply the function passing
one parameter instead of two (see example)</p>
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
<a href="https://github.com/danigb/music-scale/blob/master/scale.js">scale.js</a>
<span>, </span>
<a href="https://github.com/danigb/music-scale/blob/master/scale.js#L26">lineno 26</a>
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

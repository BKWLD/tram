# tram.js

Cross-browser CSS3 transitions in JavaScript.

## About

The idea behind Tram is to take the performance and flexibility of CSS transitions and define them in JavaScript - offering a more powerful, expressive API with auto-stopping, sequencing, and cross-browser fallbacks.

Tram currently depends on jQuery, for two reasons: (1) Per-element data API, and (2) cross-browser css getters / setters. If your library of choice offers these two things, then porting Tram to your library may be possible.

Available on npm: `npm install tram`

File size:
* dev ~`42 kb`
* min ~`16 kb`
* gzip ~`3 kb`

## How it works

On first load, Tram will use feature detection to determine whether 
the browser supports CSS transitions. If yes, Tram will manage styles
and trust the browser to handle the frame by frame animation.
If no, Tram will set styles on each frame, using its own tweening
engine powered by [requestAnimationFrame][1] and [performance.now()][2].

*Please keep your arms and legs inside the tram at all times.*

```js
// Tram can be loaded via AMD, CommonJS or browser globals.
var tram = require('tram');
var tram = window.tram;
var tram = $.tram;

// Let's start with an element. Tram can accept direct DOM nodes,
// jQuery sets, and arrays of elements.
var element = $('.passenger');
var element = document.querySelector('.passenger');

// Before you add a transition to an element, you must first wrap it
// with the tram() method. This stores a Tram class instance in the
// element data, which is used for auto-stop and other state.
tram(element);

// You may optionally save a reference to this instance, which may help
// performance for a large group of elements.
var myTram = tram(element);

// Each property must now be defined using the add() method. 
// This should feel very familiar to CSS3 transition shorthand:
// 'property-name duration easing-function delay'
tram(element).add('opacity 500ms ease-out');

// Once a transition is defined, it is stored in element data.
// You may override settings later, for example:
tram(element).add('opacity 2s'); // changed duration to 2 seconds

// To begin a transition on your element, the start() method is used.
// When start is called, it will look for matching property names
// and begin animating using the supported mode.
tram(element).start({ opacity: 0.5 });

// If you'd like to listen for the transition end event, use then().
// Note that all of Tram's wrapper methods are chainable.
tram(element)
  .start({ opacity: 0.5 })
  .then(function () { console.log('done!') });

// Sequencing is also available by using then(). For example:
tram(element)
  .start({ opacity: 0.5 })
  .then({ opacity: 1 })
  .then({ opacity: 0 });

// Tram provides some virtual properties to help with CSS3 transforms.
tram(element)
  .add('transform 1s ease-out-quint')
  .start({ x: 100, rotate: 45 }); // aka: translateX(100px) rotate(45deg)

// If you need to set style values right away, use the set() method.
// This will stop any transitions, and immediately set the values.
tram(element).set({ x: 0, opacity: 1 });

// Stopping a transition may be done using the stop() method. This also
// happens automatically whenever start() or set() are called.
tram(element).stop('transform'); // specific property
tram(element).stop(); // stops all property transitions

// That's about it. For more advanced features + options, please refer
// to the docs below, or check out the /examples/ directory.
```

[1]: http://paulirish.com/2011/requestanimationframe-for-smart-animating/ "requestAnimationFrame"

[2]: http://updates.html5rocks.com/2012/05/requestAnimationFrame-API-now-with-sub-millisecond-precision "performance.now()"

## Methods

TODO document each method

## Properties

Browser support for transitioning DOM properties is limited, so Tram attempts to cover the most common cross-browser properties, plus a few extras. This list was compiled using CSS animation specs [here][3] and [here][4].

### Supported property names / values

```js
'color'                // color
'background'           // color
'outline-color'        // color
'border-color'         // color
'border-top-color'     // color
'border-right-color'   // color
'border-bottom-color'  // color
'border-left-color'    // color
'border-width'         // length
'border-top-width'     // length
'border-right-width'   // length
'border-bottom-width'  // length
'border-left-width'    // length
'border-spacing'       // length
'letter-spacing'       // length
'margin'               // length
'margin-top'           // length
'margin-right'         // length
'margin-bottom'        // length
'margin-left'          // length
'padding'              // length
'padding-top'          // length
'padding-right'        // length
'padding-bottom'       // length
'padding-left'         // length
'outline-width'        // length
'opacity'              // number
'top'                  // length, percentage
'right'                // length, percentage
'bottom'               // length, percentage
'left'                 // length, percentage
'font-size'            // length, percentage
'text-indent'          // length, percentage
'word-spacing'         // length, percentage
'width'                // length, percentage
'min-width'            // length, percentage
'max-width'            // length, percentage
'height'               // length, percentage
'min-height'           // length, percentage
'max-height'           // length, percentage
'line-height'          // number, length, percentage
'transform'            // (see transform info below)

// TODO - planned support
// 'background-position'  // [x, y] length, percentage
// 'transform-origin'     // [x, y] length, percentage
// 'clip'                 // [x, y, w, h] rectangle
// 'crop'                 // [x, y, w, h] rectangle
// 'scroll-top'           // number (tween-only)
// 'scroll-left'          // number (tween-only)
```

**Note:** `dash-style` names are required for `.add()`, but other methods like `.start()` and `.stop()` may use `camelCase`.

[3]: http://oli.jp/2010/css-animatable-properties/ "oli.jp"
[4]: http://www.w3.org/TR/css3-transitions/#properties-from-css- "w3.org"

### Transforms

TODO describe transform shortcuts w/ examples

```js
'x'                    // length, percentage
'y'                    // length, percentage
'z'                    // length, percentage
'rotate'               // angle
'rotateX'              // angle
'rotateY'              // angle
'rotateZ'              // angle
'scale'                // number
'scaleX'               // number
'scaleY'               // number
'scaleZ'               // number
'skew'                 // angle
'skewX'                // angle
'skewY'                // angle
'perspective'          // length
```

### Easings

```js
// Defaults
'ease'
'ease-in'
'ease-out'
'ease-in-out'
'linear'

// Quad
'ease-in-quad'
'ease-out-quad'
'ease-in-out-quad'

// Cubic
'ease-in-cubic'
'ease-out-cubic'
'ease-in-out-cubic'

// Quart
'ease-in-quart'
'ease-out-quart'
'ease-in-out-quart'

// Quint
'ease-in-quint'
'ease-out-quint'
'ease-in-out-quint'

// Sine
'ease-in-sine'
'ease-out-sine'
'ease-in-out-sine'

// Expo
'ease-in-expo'
'ease-out-expo'
'ease-in-out-expo'

// Circ
'ease-in-circ'
'ease-out-circ'
'ease-in-out-circ'

// Back
'ease-in-back'
'ease-out-back'
'ease-in-out-back'
```

## TODO

* Add scrollTop and scrollLeft as tween-only props
* Expose enterFrame and timeNow functions
* Add remap({ x: 'left' }) method for shimming properties
* Add .get(prop) method to return current value
* Support array values for props like 'background-position'
* Confirm 'backface:hidden' is enough for gpu acceleration
* Consider adding tram.delay() static utlity
* Consider adding Bower support
* Consider px -> rem unit conversion support

## Contributing

1. If you'd like to contribute to this project, please submit all pull requests to the `dev` branch. Any pull requests sent to `master` will be closed. This is mostly to offset the convenience of having various dist/* files available on the master branch.

2. Grunt CLI tools may be helpful. The following commands should start a watch script that concats source files on each save:  
(from the root directory)  
`npm install`  
`make`  

3. Once you're ready to send a pull request, please view `test/index.html` in your browser to confirm that all tests are passing.

## Thanks

Special thanks to the following open source authors + libraries.

@ded - https://github.com/ded/morpheus  
@rstacruz - https://github.com/rstacruz/jquery.transit  
@visionmedia - https://github.com/visionmedia/move.js  
@jayferd - https://github.com/jayferd/pjs

## MIT License 

This code may be freely distributed under the [MIT license](http://danro.mit-license.org/).

### Terms Of Use - Easing Equations

Open source under the [BSD License](http://www.opensource.org/licenses/bsd-license.php).

Copyright © 2001 Robert Penner
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of the author nor the names of contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

# tram.js

Cross-browser CSS3 transitions in JavaScript.

## About

The idea behind Tram is to take the performance and flexibility of CSS transitions and define them in JavaScript, offering a more powerful, expressive API with auto-stopping, sequencing, and cross-browser fallbacks.

Tram currently depends on jQuery, for two reasons: (1) Per-element data API, and (2) cross-browser css getters / setters. If your library of choice offers these two things, then porting Tram to your library should be fairly trivial.

File size:
* dev ~`40 kb`
* min ~`15 kb`
* gzip ~`3 kb`

Supports AMD, CommonJS and plain old browser globals.

Available on npm: `npm install tram`

## How it works

*Please keep your arms and legs inside the tram at all times.*

TODO explain features inline with examples

## Methods

TODO document each method

## Properties

Browser support for transitioning DOM properties is limited, so Tram attempts to cover the most common cross-browser properties, plus a few extras. This list was compiled using CSS animation specs [here][1] and [here][2].

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

[1]: http://oli.jp/2010/css-animatable-properties/ "oli.jp"
[2]: http://www.w3.org/TR/css3-transitions/#properties-from-css- "w3.org"

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
* Add fallback({ x: 'left' }) method for non-supported props
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

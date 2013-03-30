# tram.js

Cross-browser CSS3 transitions in JavaScript.

## About

The idea behind *tram.js* is simple: Take the flexibility and performance of CSS3 transitions and manage them through a more powerful JavaScript API, while providing support for older browsers.

## jQuery dependency

TODO describe jquery dependency... data API, cross-browser style getters + setters, bugfixes, feature tests, general utils: type tests, extend()

## How it works

```js
// magic
```

## Properties

Browser support for transitioning CSS properties is limited, so *tram.js* attempts to cover the most common *cross-browser* properties. This list is based on CSS animation specs [here][1] and [here][2].

### Supported property names / values

```js
'color'                // color
'background-color'     // color
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
'background-position'  // length, percentage
'line-height'          // number, length, percentage
'transform'            // transform-function
'transform-origin'     // length, percentage

// TODO - planned support
// 'clip'              // rectangle
// 'crop'              // rectangle
```

[1]: http://oli.jp/2010/css-animatable-properties/ "oli.jp"
[2]: http://www.w3.org/TR/css3-transitions/#properties-from-css- "w3.org"

## Easings

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

## Options

### Fallback mode

TODO

### REM support

TODO

### GPU acceleration

TODO

## Thanks

Special thanks to the following open source authors + libraries.

@ded - https://github.com/ded/morpheus  
@rstacruz - https://github.com/rstacruz/jquery.transit  
@visionmedia - https://github.com/visionmedia/move.js  
@jayferd - https://github.com/jayferd/pjs

## MIT License 

This code may be freely distributed under the MIT license.
http://danro.mit-license.org/

## BSD License (Easing Equations)

TERMS OF USE - EASING EQUATIONS

Open source under the [BSD License](http://www.opensource.org/licenses/bsd-license.php).

Copyright © 2001 Robert Penner
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of the author nor the names of contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

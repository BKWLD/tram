/*!
  * tram.js v0.1.0-global
  * Cross-browser CSS3 transitions in JavaScript.
  * https://github.com/danro/tram
  * MIT License
  */
window.tram = (function ($) {

  /*!
   * P.js
   * A lightweight class system.  It's just prototypes!
   * http:// github.com/jayferd/pjs
   * MIT license
   */
  var P = (function(prototype, ownProperty, undefined) {
    // helper functions that also help minification
    function isObject(o) { return typeof o === 'object'; }
    function isFunction(f) { return typeof f === 'function'; }

    // a function that gets reused to make uninitialized objects
    function BareConstructor() {}

    function P(_superclass /* = Object */, definition) {
      // handle the case where no superclass is given
      if (definition === undefined) {
        definition = _superclass;
        _superclass = Object;
      }

      // C is the class to be returned.
      //
      // It delegates to instantiating an instance of `Bare`, so that it
      // will always return a new instance regardless of the calling
      // context.
      //
      //  TODO: the Chrome inspector shows all created objects as `C`
      //        rather than `Object`.  Setting the .name property seems to
      //        have no effect.  Is there a way to override this behavior?
      function C() {
        var self = new Bare;
        if (isFunction(self.init)) self.init.apply(self, arguments);
        return self;
      }

      // C.Bare is a class with a noop constructor.  Its prototype is the
      // same as C, so that instances of C.Bare are also instances of C.
      // New objects can be allocated without initialization by calling
      // `new MyClass.Bare`.
      function Bare() {}
      C.Bare = Bare;

      // Set up the prototype of the new class.
      var _super = BareConstructor[prototype] = _superclass[prototype];
      var proto = Bare[prototype] = C[prototype] = new BareConstructor;

      // other variables, as a minifier optimization
      var extensions;


      // set the constructor property on the prototype, for convenience
      proto.constructor = C;

      C.mixin = function(def) {
        Bare[prototype] = C[prototype] = P(C, def)[prototype];
        return C;
      }

      return (C.open = function(def) {
        extensions = {};

        if (isFunction(def)) {
          // call the defining function with all the arguments you need
          // extensions captures the return value.
          extensions = def.call(C, proto, _super, C, _superclass);
        }
        else if (isObject(def)) {
          // if you passed an object instead, we'll take it
          extensions = def;
        }

        // ...and extend it
        if (isObject(extensions)) {
          for (var ext in extensions) {
            if (ownProperty.call(extensions, ext)) {
              proto[ext] = extensions[ext];
            }
          }
        }

        // if there's no init, we assume we're inheriting a non-pjs class, so
        // we default to applying the superclass's constructor.
        if (!isFunction(proto.init)) {
          proto.init = _superclass;
        }

        return C;
      })(definition);
    }

    // ship it
    return P;

    // as a minifier optimization, we've closured in a few helper functions
    // and the string 'prototype' (C[p] is much shorter than C.prototype)
  })('prototype', ({}).hasOwnProperty);

  // --------------------------------------------------
  // Easing methods { id: [ cssString, jsFunction ] }
  
  var easing = {
    
    // --------------------------------------------------
    // CSS easings, converted to functions using Timothee Groleau's generator.
    // http://www.timotheegroleau.com/Flash/experiments/easing_function_generator.htm
    
    'ease': ['ease', function (t, b, c, d) {
      var ts=(t /= d)*t;
      var tc=ts*t;
      return b+c*(-2.75*tc*ts + 11*ts*ts + -15.5*tc + 8*ts + 0.25*t);
    }],
    
    'ease-in': ['ease-in', function (t, b, c, d) {
      var ts=(t /= d)*t;
      var tc=ts*t;
      return b+c*(-1*tc*ts + 3*ts*ts + -3*tc + 2*ts);
    }],
    
    'ease-out': ['ease-out', function (t, b, c, d) {
      var ts=(t /= d)*t;
      var tc=ts*t;
      return b+c*(0.3*tc*ts + -1.6*ts*ts + 2.2*tc + -1.8*ts + 1.9*t);
    }],
    
    'ease-in-out': ['ease-in-out', function (t, b, c, d) {
      var ts=(t /= d)*t;
      var tc=ts*t;
      return b+c*(2*tc*ts + -5*ts*ts + 2*tc + 2*ts);
    }],
    
    // --------------------------------------------------
    // Robert Penner easing equations and their CSS equivalents.
    // http://www.robertpenner.com/easing_terms_of_use.html
    
    'linear': ['linear', function (t, b, c, d) {
      return c*t/d + b;
    }],
    
    // Quad
    'ease-in-quad':
    ['cubic-bezier(0.550, 0.085, 0.680, 0.530)', function (t, b, c, d) {
      return c*(t /= d)*t + b;
    }],
    
    'ease-out-quad':
    ['cubic-bezier(0.250, 0.460, 0.450, 0.940)', function (t, b, c, d) {
      return -c *(t /= d)*(t-2) + b;
    }],
    
    'ease-in-out-quad':
    ['cubic-bezier(0.455, 0.030, 0.515, 0.955)', function (t, b, c, d) {
      if ((t /= d/2) < 1) return c/2*t*t + b;
      return -c/2 * ((--t)*(t-2) - 1) + b;
    }],
    
    // Cubic
    'ease-in-cubic':
    ['cubic-bezier(0.550, 0.055, 0.675, 0.190)', function (t, b, c, d) {
      return c*(t /= d)*t*t + b;
    }],
    
    'ease-out-cubic':
    ['cubic-bezier(0.215, 0.610, 0.355, 1.000)', function (t, b, c, d) {
      return c*((t=t/d-1)*t*t + 1) + b;
    }],
    
    'ease-in-out-cubic':
    ['cubic-bezier(0.645, 0.045, 0.355, 1.000)', function (t, b, c, d) {
      if ((t /= d/2) < 1) return c/2*t*t*t + b;
      return c/2*((t-=2)*t*t + 2) + b;
    }],
    
    // Quart
    'ease-in-quart':
    ['cubic-bezier(0.895, 0.030, 0.685, 0.220)', function (t, b, c, d) {
      return c*(t /= d)*t*t*t + b;
    }],
    
    'ease-out-quart':
    ['cubic-bezier(0.165, 0.840, 0.440, 1.000)', function (t, b, c, d) {
      return -c * ((t=t/d-1)*t*t*t - 1) + b;
    }],
    
    'ease-in-out-quart':
    ['cubic-bezier(0.770, 0.000, 0.175, 1.000)', function (t, b, c, d) {
      if ((t /= d/2) < 1) return c/2*t*t*t*t + b;
      return -c/2 * ((t-=2)*t*t*t - 2) + b;
    }],
    
    // Quint
    'ease-in-quint':
    ['cubic-bezier(0.755, 0.050, 0.855, 0.060)', function (t, b, c, d) {
      return c*(t /= d)*t*t*t*t + b;
    }],
    
    'ease-out-quint':
    ['cubic-bezier(0.230, 1.000, 0.320, 1.000)', function (t, b, c, d) {
      return c*((t=t/d-1)*t*t*t*t + 1) + b;
    }],
    
    'ease-in-out-quint':
    ['cubic-bezier(0.860, 0.000, 0.070, 1.000)', function (t, b, c, d) {
      if ((t /= d/2) < 1) return c/2*t*t*t*t*t + b;
      return c/2*((t-=2)*t*t*t*t + 2) + b;
    }],
    
    // Sine
    'ease-in-sine':
    ['cubic-bezier(0.470, 0.000, 0.745, 0.715)', function (t, b, c, d) {
      return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    }],
    
    'ease-out-sine':
    ['cubic-bezier(0.390, 0.575, 0.565, 1.000)', function (t, b, c, d) {
      return c * Math.sin(t/d * (Math.PI/2)) + b;
    }],
    
    'ease-in-out-sine':
    ['cubic-bezier(0.445, 0.050, 0.550, 0.950)', function (t, b, c, d) {
      return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    }],
    
    // Expo
    'ease-in-expo':
    ['cubic-bezier(0.950, 0.050, 0.795, 0.035)', function (t, b, c, d) {
      return (t === 0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
    }],
    
    'ease-out-expo':
    ['cubic-bezier(0.190, 1.000, 0.220, 1.000)', function (t, b, c, d) {
      return (t === d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    }],
    
    'ease-in-out-expo':
    ['cubic-bezier(1.000, 0.000, 0.000, 1.000)', function (t, b, c, d) {
      if (t === 0) return b;
      if (t === d) return b+c;
      if ((t /= d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
      return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }],
    
    // Circ
    'ease-in-circ':
    ['cubic-bezier(0.600, 0.040, 0.980, 0.335)', function (t, b, c, d) {
      return -c * (Math.sqrt(1 - (t /= d)*t) - 1) + b;
    }],
    
    'ease-out-circ':
    ['cubic-bezier(0.075, 0.820, 0.165, 1.000)', function (t, b, c, d) {
      return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
    }],
    
    'ease-in-out-circ':
    ['cubic-bezier(0.785, 0.135, 0.150, 0.860)', function (t, b, c, d) {
      if ((t /= d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
      return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
    }],
    
    // Back
    'ease-in-back':
    ['cubic-bezier(0.600, -0.280, 0.735, 0.045)', function (t, b, c, d, s) {
      if (s === undefined) s = 1.70158;
      return c*(t /= d)*t*((s+1)*t - s) + b;
    }],
    
    'ease-out-back':
    ['cubic-bezier(0.175, 0.885, 0.320, 1.275)', function (t, b, c, d, s) {
      if (s === undefined) s = 1.70158;
      return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    }],
    
    'ease-in-out-back':
    ['cubic-bezier(0.680, -0.550, 0.265, 1.550)', function (t, b, c, d, s) {
      if (s === undefined) s = 1.70158; 
      if ((t /= d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
      return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    }]
  };

  // --------------------------------------------------
  // Private vars
  /*global $, P, easing */
  
  var doc = document;
  var win = window;
  var store = 'bkwld-tram-js';
  var slice = Array.prototype.slice;
  var testStyle = doc.createElement('a').style;
  var domPrefixes = ['Webkit', 'Moz', 'O', 'ms'];
  var cssPrefixes = ['-webkit-', '-moz-', '-o-', '-ms-'];
  
  var typeNumber = 'n';
  var typeColor = '# rgb rgba';
  var typeLength = 'em cm mm in pt pc px';
  var typePercent = '%';
  var typeDegrees = 'deg';
  var typePixels = 'px';
  
  // --------------------------------------------------
  // Private functions
  
  // Simple feature detect, returns both dom + css prefixed names
  var testFeature = function (prop) {
    // unprefixed case
    if (prop in testStyle) return { dom: prop, css: prop };
    // test all prefixes
    var i, domProp, domSuffix = prop.charAt(0).toUpperCase() + prop.slice(1);
    for (i = 0; i < domPrefixes.length; i++) {
      domProp = domPrefixes[i] + domSuffix;
      if (domProp in testStyle) return { dom: domProp, css: cssPrefixes[i] + prop };
    }
  };
  
  // Feature tests
  var support = $.extend({}, $.support, {
      bind: Function.prototype.bind
    , transform: testFeature('transform')
    , transition: testFeature('transition')
  });
  
  // Animation timer shim with setTimeout fallback
  var enterFrame = function () {
    return win.requestAnimationFrame ||
    win.webkitRequestAnimationFrame ||
    win.mozRequestAnimationFrame ||
    win.oRequestAnimationFrame ||
    win.msRequestAnimationFrame ||
    function (callback) {
      win.setTimeout(callback, 16);
    };
  }();
  
  // Timestamp shim with fallback
  var timeNow = function () {
    // use high-res timer if available
    var perf = win.performance,
      perfNow = perf && (perf.now || perf.webkitNow || perf.msNow || perf.mozNow);
    if (perfNow && support.bind) {
      return perfNow.bind(perf);
    }
    // fallback to epoch-based timestamp
    return Date.now || function () {
      return +(new Date);
    };
  }();
  
  // --------------------------------------------------
  // Transition class - public API returned from the tram() wrapper.
  
  var Transition = P(function(proto) {
    
    proto.init = function (el) {
      this.el = el;
      this.$el = $(el);
      this.props = {};
    };
    
    // Public chainable methods
    chain('add', add);
    chain('start', start);
    chain('stop', stop);
    
    function add(transition, options) {
      // Parse transition settings
      var settings = compact(('' + transition).split(' '));
      var name = settings.shift();
      
      // Get property definition from map
      var definition = propertyMap[name];
      if (!definition) return warn('Unsupported property: ' + name);
      definition = definition.slice();
      
      // Init property with settings + definition + options
      var Class = definition.shift();
      if (name in this.props) {
        this.props[name].init(settings, definition, options);
      } else {
        this.props[name] = new Class(settings, definition, options);
      }
    }
    
    function start(options) {
      // TODO
      // single function
      // single object
      // TODO sequence from arguments
      // obj, function ... (or) function, obj ...
      // console.log('start', this.el, options);
    }
    
    function stop() {
    }
    
    // Define a chainable method that takes children into account
    function chain(name, method) {
      proto[name] = function () {
        if (this.children) return each.call(this, method, arguments);
        method.apply(this, arguments);
        return this;
      };
    }
    
    // Iterate through children and apply the method
    function each(method, args) {
      var i, count = this.children.length;
      for (i = 0; i < count; i++) {
        method.apply(this.children[i], args);
      }
      return this;
    }
  });
  
  // Tram class - extends Transition + wraps child instances for chaining.
  var Tram = P(Transition, function (proto, supr) {
    
    proto.init = function (args) {
      var $elems = $(args[0]);
      var options = args.slice(1);
      
      // Invalid selector, do nothing.
      if (!$elems.length) return this;
      
      // Single case - return single Transition instance
      if ($elems.length === 1) return factory($elems[0], options);
      
      // Store multiple instances for chaining
      var children = [];
      $elems.each(function (index, el) {
        children.push(factory(el, options));
      });
      this.children = children;
      return this;
    };
    
    // Retrieve instance from data or create a new one.
    function factory(el, options) {
      var t = $.data(el, store) || $.data(el, store, new Transition.Bare());
      if (!t.el) t.init(el);
      if (options.length) return t.start(options);
      return t;
    }
  });
  
  // --------------------------------------------------
  // Tween class - handles timing and fallback animation.
  
  var Tween = P(function (proto) {
    easing.linear;
  });
  
  // --------------------------------------------------
  // Property class - get/set property values
  
  var Property = P(function (proto) {
    
    proto.init = function (settings, definition, options) {
      // TODO
    };
    
  });
      
  // Transform - special combo property
  var Transform = P(Property, function (proto, supr) {
    // TODO add option for gpu triggers
    // backface-visibility(hidden);
    // translate3d(0,0,0);
  });
  
  // --------------------------------------------------
  // Main wrapper - returns a Tram instance with public chaining API.
  
  function tram() {
    // Chain on the result of Tram.init() to optimize single case.
    var wrap = new Tram.Bare();
    return wrap.init(slice.call(arguments));
  }
  
  // Global tram config
  tram.config = {
      baseFontSize: 16 // used by remFallback
    , remFallback: false // TODO add rem fallback for px length values
    , defaultUnit: typePixels // default unit added to <length> types
    , gpuTransforms: true // always prepend gpu cache trick to transforms
  };
  
  // macro() static method
  tram.macro = function (id, fn) {
    // TODO
  };
  
  // tween() static method
  tram.tween = function (options) {
    // TODO
  };
  
  // jQuery plugin method, keeps jQuery chain intact.
  $.fn.tram = function (args) {
    // Pass along element as first argument
    args = [this].concat(slice.call(arguments));
    // Directly instantiate Tram class, no tram chain!
    new Tram(args);
    return this;
  };
  
  // --------------------------------------------------
  // Property map + unit values
  
  var propertyMap = (function (Prop) {
    
    var color = typeColor;
    var number = typeNumber;
    var length = typeLength;
    var percent = typePercent;
    var deg = typeDegrees;
    var px = typePixels;
    
    // Transform sub-properties { name: [ realName, units ]}
    Transform.map = {
        x:            [ 'translateX', px ]
      , y:            [ 'translateY', px ]
      , z:            [ 'translateZ', px ]
      , rotate:       [ '', deg ]
      , rotateX:      [ '', deg ]
      , rotateY:      [ '', deg ]
      , rotateZ:      [ '', deg ]
      , scale:        [ '', number ]
      , scaleX:       [ '', number ]
      , scaleY:       [ '', number ]
      , scaleZ:       [ '', number ]
      , skew:         [ '', deg ]
      , skewX:        [ '', deg ]
      , skewY:        [ '', deg ]
      , perspective:  [ '', px ]
    };
    
    // Main Property map { name: [ class, units ]}
    return {
        'color'                : [ Prop, color ]
      , 'background-color'     : [ Prop, color ]
      , 'outline-color'        : [ Prop, color ]
      , 'border-color'         : [ Prop, color ]
      , 'border-top-color'     : [ Prop, color ]
      , 'border-right-color'   : [ Prop, color ]
      , 'border-bottom-color'  : [ Prop, color ]
      , 'border-left-color'    : [ Prop, color ]
      , 'border-width'         : [ Prop, length ]
      , 'border-top-width'     : [ Prop, length ]
      , 'border-right-width'   : [ Prop, length ]
      , 'border-bottom-width'  : [ Prop, length ]
      , 'border-left-width'    : [ Prop, length ]
      , 'border-spacing'       : [ Prop, length ]
      , 'letter-spacing'       : [ Prop, length ]
      , 'margin'               : [ Prop, length ]
      , 'margin-top'           : [ Prop, length ]
      , 'margin-right'         : [ Prop, length ]
      , 'margin-bottom'        : [ Prop, length ]
      , 'margin-left'          : [ Prop, length ]
      , 'padding'              : [ Prop, length ]
      , 'padding-top'          : [ Prop, length ]
      , 'padding-right'        : [ Prop, length ]
      , 'padding-bottom'       : [ Prop, length ]
      , 'padding-left'         : [ Prop, length ]
      , 'outline-width'        : [ Prop, length ]
      , 'opacity'              : [ Prop, number ]
      , 'top'                  : [ Prop, length, percent ]
      , 'right'                : [ Prop, length, percent ]
      , 'bottom'               : [ Prop, length, percent ]
      , 'left'                 : [ Prop, length, percent ]
      , 'font-size'            : [ Prop, length, percent ]
      , 'text-indent'          : [ Prop, length, percent ]
      , 'word-spacing'         : [ Prop, length, percent ]
      , 'width'                : [ Prop, length, percent ]
      , 'min-width'            : [ Prop, length, percent ]
      , 'max-width'            : [ Prop, length, percent ]
      , 'height'               : [ Prop, length, percent ]
      , 'min-height'           : [ Prop, length, percent ]
      , 'max-height'           : [ Prop, length, percent ]
      , 'background-position'  : [ Prop, length, percent ]
      , 'line-height'          : [ Prop, number, length, percent ]
      , 'transform'            : [ Transform ]
      , 'transform-origin'     : [ Prop, length, percent ]
    };
  }(Property));
  
  // --------------------------------------------------
  // Utils
  
  var warn = (function () {
    var warn = 'warn';
    var console = window.console;
    if (console && console[warn] && support.bind) return console[warn].bind(console);
    return function () {};
  }());
  
  // Lo-Dash compact()
  // Creates an array with all falsey values of `array` removed
  // MIT license <http://lodash.com/license>
  function compact(array) {
    var index = -1,
        length = array ? array.length : 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (value) {
        result.push(value);
      }
    }
    return result;
  }
  
  // --------------------------------------------------
  // Export public module.
  return $.tram = tram;

}(window.jQuery));

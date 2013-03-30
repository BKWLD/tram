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
  var space = ' ';
  
  var typeNumber = 'number';
  var typeColor = /^(rgb|#)/;
  var typeLength = /(em|cm|mm|in|pt|pc|px)$/;
  var typeLenPerc = /(em|cm|mm|in|pt|pc|px|%)$/;
  var typeFancyLad = 'fancy';
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
      this.queue = [];
    };
    
    // Public chainable methods
    chain('add', add);
    chain('start', start);
    chain('stop', stop);
    chain('redraw', redraw);
    
    // Public add() - chainable
    function add(transition, options) {
      // Parse transition settings
      var settings = compact(('' + transition).split(space));
      var name = settings[0];
      
      // Get property definition from map
      var definition = propertyMap[name];
      if (!definition) return warn('Unsupported property: ' + name);
      
      // Init property instance
      var Class = definition[0];
      var prop = this.props[name];
      if (!prop) {
        prop = this.props[name] = new Class.Bare();
        // Event handlers
        prop.onStart = proxy(this, onStart);
        prop.onRemove = proxy(this, onRemove);
        prop.onEnd = proxy(this, onEnd);
      }
      // Init settings + type + options
      prop.init(this.$el, settings, definition[1], options);
    }
    
    function onStart() {
      // build transition string from active props
      var p, prop, result = [];
      for (p in this.props) {
        prop = this.props[p];
        if (!prop.active) continue;
        result.push(prop.string);
      }
      result = result.join(',');
      this.el.style[support.transition.dom] = result;
    }
    
    function onRemove() {
      // TODO remove -webkit-transition values from this.props?
    }
    
    function onEnd() {
      // TODO proceed to next item in queue
    }
    
    // Public start() - chainable
    function start(options) {
      // If the first argument is an array, use that as the arguments instead.
      var args = $.isArray(options) ? options : slice.call(arguments);
      if (!args.length) return this;
      
      var current = args.shift();
      if (!current) return this;
      
      // TODO - Deal with existing queue. Replacing it entirely for now.
      // Push any extra arguments into queue
      if (args.length > 1) this.queue = args;
      
      // If current is a function, invoke it.
      if (typeof current == 'function') return current(this);
      
      // If current is an object, start property tweens.
      if (typeof current == 'object') {
        // redraw prior to starting tweens
        this.redraw();
        // loop through each valid property
        var timeSpan = 0;
        eachProp.call(this, current, function (prop, value) {
          // determine the longest time span (duration + delay)
          if (prop.span > timeSpan) timeSpan = prop.span;
          // animate property value
          // TODO deal with auto-stop before animating a property.
          prop.animate(value);
        });
        // TODO proceed to next item in queue after timeSpan
      }
    }
    
    // Public stop() - chainable
    function stop(property) {
      // TODO stop individual properties by name
      for (var p in this.props) {
        this.props[p].stop();
      }
    }
    
    // Public redraw() - chainable
    function redraw() {
      var draw = this.el.offsetHeight;
    }
    
    // Loop through valid properties and run iterator callback
    function eachProp(collection, iterator) {
      var p, valid;
      var transform = this.props.transform;
      var transProps = {};
      for (p in collection) {
        // check for special Transform sub-properties
        if (transform && p in Transform.map) {
          transProps[p] = collection[p];
          continue;
        }
        // validate property
        valid = p in this.props && p in propertyMap;
        if (!valid) continue;
        // iterate with valid property / value
        iterator(this.props[p], collection[p]);
      }
      // iterate with transform prop / sub-prop values
      if (transform) iterator(transform, transProps);
    }
    
    // Define a chainable method that takes children into account
    function chain(name, method) {
      proto[name] = function () {
        if (this.children) return eachChild.call(this, method, arguments);
        method.apply(this, arguments);
        return this;
      };
    }
    
    // Iterate through children and apply the method, return for chaining
    function eachChild(method, args) {
      var i, count = this.children.length;
      for (i = 0; i < count; i++) {
        method.apply(this.children[i], args);
      }
      return this;
    }
  });
  
  // Tram class - extends Transition + wraps child instances for chaining.
  var Tram = P(Transition, function (proto) {
    
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
  // Property class - get/set property values
  
  var Property = P(function (proto) {
    
    var defaults = {
        duration: 500
      , ease: 'ease'
      , delay: 0
    };
    
    proto.init = function ($el, settings, type, options) {
      // Initialize or extend settings
      this.$el = $el;
      this.name = settings[0];
      this.duration = validTime(settings[1], this.duration, defaults.duration);
      this.ease = validEase(settings[2], this.ease, defaults.ease);
      this.delay = validTime(settings[3], this.delay, defaults.delay);
      this.span = this.duration + this.delay;
      this.type = type;
      this.active = false;
      // TODO use options to override gpuTransforms value
      // TODO use options to allow fallback animation per property
      this.animate = support.transition ? this.transition : this.fallback;
      if (this.animate === this.fallback) return;
      // CSS-specific string
      this.string = this.name +
        space + this.duration + 'ms' +
        space + easing[this.ease][0] +
        (this.delay ? space + this.delay + 'ms' : '');
    };
    
    proto.set = function (value) {
      // TODO set value immediately
    };
    
    // CSS transition
    proto.transition = function (value) {
      value = this.convert(value, this.type);
      this.active = true;
      this.onStart();
      this.$el.css(this.name, value);
    };
    
    // Fallback tweening
    proto.fallback = function (value) {
      
    };
    
    // Stop animation
    proto.stop = function () {
      this.tween && this.tween.stop();
      // Reset property to stop CSS transition
      if (this.animate === this.transition) {
        var value = this.$el.css(this.name);
        this.$el.css(this.name, value);
      }
    };
    
    // Convert value to expected type
    proto.convert = function (value, type) {
      var warnType = type;
      var number = typeof value == 'number';
      var string = typeof value == 'string';
      switch(type) {
        case typeNumber:
          if (number) return value;
          break;
        case typeColor:
          if (string && type.test(value)) {
            if (value.charAt(0) == '#' && value.length == 7) return value;
            return toHex(value);
          }
          warnType = 'hex or rgb string';
          break;
        case typeLength:
          if (number) return value + typePixels;
          if (string && type.test(value)) return value;
          warnType = 'number(px) or string(unit)';
          break;
        case typeLenPerc:
          if (number) return value + typePixels;
          if (string && type.test(value)) return value;
          warnType = 'number(px) or string(unit or %)';
          break;
        case typeFancyLad:
          if (number) return value;
          if (string && typeLenPerc.test(value)) return value;
          warnType = 'number or string(unit or %)';
          break;
        case typeDegrees:
          if (number) return value + typeDegrees;
          if (string && type.test(value)) return value;
          warnType = 'number(deg) or string(deg)';
          break;
        case typePixels:
          if (number) return value + typePixels;
          if (string && type.test(value)) return value;
          warnType = 'number(px) or string(px)';
          break;
      }
      // Type must be invalid, warn people.
      typeWarning(warnType, value);
      return value;
    };
    
    function toHex(c) {
      var m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(c);
      return (m ? rgb(m[1], m[2], m[3]) : c)
        .replace(/#(\w)(\w)(\w)$/, '#$1$1$2$2$3$3');
    }
    
    function rgb(r, g, b) {
      return '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
    }
    
    function typeWarning(e, v) {
      warn('Type warning! Expected: [' + e + '] Got: [' + typeof v + '] ' + v);
    }
    
    // Normalize time values
    var ms = /ms/;
    var sec = /s|\./;
    function validTime(string, current, safe) {
      if (current !== undefined) safe = current;
      if (string === undefined) return safe;
      var n = safe;
      // if string contains 'ms' or contains no suffix
      if (ms.test(string) || !sec.test(string)) {
        n = parseInt(string, 10);
      // otherwise if string contains 's' or a decimal point
      } else if (sec.test(string)) {
        n = parseFloat(string) * 1000;
      }
      if (n < 0) n *= -1; // positive only plz
      return n === n ? n : safe; // protect from NaNs
    }
    
    // Make sure ease exists
    function validEase(ease, current, safe) {
      if (current !== undefined) safe = current;
      return ease in easing ? ease : safe;
    }
  });
      
  // Transform - special combo property
  var Transform = P(Property, function (proto) {
    // TODO add option for gpu triggers
    // backface-visibility(hidden);
    // translate3d(0,0,0);
    
    // CSS transition
    proto.transition = function (value) {
    };
    
    // Fallback tweening
    proto.fallback = function (value) {
    };
    
  });
  
  // --------------------------------------------------
  // Tween class - handles timing and fallback animation.
  
  var Tween = P(function (proto) {
    proto.init = function () {
    };
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
  tram.macro = function () {
    // TODO
  };
  
  // tween() static method
  tram.tween = function () {
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
    
    // Transform sub-properties { name: [ realName, valueTypes ]}
    Transform.map = {
        x:            [ 'translateX', typePixels ]
      , y:            [ 'translateY', typePixels ]
      , z:            [ 'translateZ', typePixels ]
      , rotate:       [ '', typeDegrees ]
      , rotateX:      [ '', typeDegrees ]
      , rotateY:      [ '', typeDegrees ]
      , rotateZ:      [ '', typeDegrees ]
      , scale:        [ '', typeNumber ]
      , scaleX:       [ '', typeNumber ]
      , scaleY:       [ '', typeNumber ]
      , scaleZ:       [ '', typeNumber ]
      , skew:         [ '', typeDegrees ]
      , skewX:        [ '', typeDegrees ]
      , skewY:        [ '', typeDegrees ]
      , perspective:  [ '', typePixels ]
    };
    
    // Main Property map { name: [ PropClass, valueTypes ]}
    return {
        'color'                : [ Property, typeColor ]
      , 'background-color'     : [ Property, typeColor ]
      , 'outline-color'        : [ Property, typeColor ]
      , 'border-color'         : [ Property, typeColor ]
      , 'border-top-color'     : [ Property, typeColor ]
      , 'border-right-color'   : [ Property, typeColor ]
      , 'border-bottom-color'  : [ Property, typeColor ]
      , 'border-left-color'    : [ Property, typeColor ]
      , 'border-width'         : [ Property, typeLength ]
      , 'border-top-width'     : [ Property, typeLength ]
      , 'border-right-width'   : [ Property, typeLength ]
      , 'border-bottom-width'  : [ Property, typeLength ]
      , 'border-left-width'    : [ Property, typeLength ]
      , 'border-spacing'       : [ Property, typeLength ]
      , 'letter-spacing'       : [ Property, typeLength ]
      , 'margin'               : [ Property, typeLength ]
      , 'margin-top'           : [ Property, typeLength ]
      , 'margin-right'         : [ Property, typeLength ]
      , 'margin-bottom'        : [ Property, typeLength ]
      , 'margin-left'          : [ Property, typeLength ]
      , 'padding'              : [ Property, typeLength ]
      , 'padding-top'          : [ Property, typeLength ]
      , 'padding-right'        : [ Property, typeLength ]
      , 'padding-bottom'       : [ Property, typeLength ]
      , 'padding-left'         : [ Property, typeLength ]
      , 'outline-width'        : [ Property, typeLength ]
      , 'opacity'              : [ Property, typeNumber ]
      , 'top'                  : [ Property, typeLenPerc ]
      , 'right'                : [ Property, typeLenPerc ]
      , 'bottom'               : [ Property, typeLenPerc ]
      , 'left'                 : [ Property, typeLenPerc ]
      , 'font-size'            : [ Property, typeLenPerc ]
      , 'text-indent'          : [ Property, typeLenPerc ]
      , 'word-spacing'         : [ Property, typeLenPerc ]
      , 'width'                : [ Property, typeLenPerc ]
      , 'min-width'            : [ Property, typeLenPerc ]
      , 'max-width'            : [ Property, typeLenPerc ]
      , 'height'               : [ Property, typeLenPerc ]
      , 'min-height'           : [ Property, typeLenPerc ]
      , 'max-height'           : [ Property, typeLenPerc ]
      , 'background-position'  : [ Property, typeLenPerc ]
      , 'line-height'          : [ Property, typeFancyLad ]
      , 'transform'            : [ Transform ]
      , 'transform-origin'     : [ Property, typeLenPerc ]
    };
  }());
  
  // --------------------------------------------------
  // Utils
  
  function noop() {}
  
  // Log warning message if supported
  var warn = (function () {
    var warn = 'warn';
    var console = window.console;
    if (console && console[warn] && support.bind) return console[warn].bind(console);
    return noop;
  }());
  
  // Faux-bind helper (single arg to help performance)
  function proxy(context, method) {
    return function(arg) {
      return method.call(context, arg);
    };
  }
  
  // Lo-Dash compact()
  // MIT license <http://lodash.com/license>
  // Creates an array with all falsey values of `array` removed
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

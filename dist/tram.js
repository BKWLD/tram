/*!
  * tram.js v0.1.0-global
  * Cross-browser CSS3 transitions in JavaScript.
  * https://github.com/bkwld/tram
  * MIT License
  */
window.tram = (function (jQuery) {

  /*!
   * Breeze - process.nextTick browser shim
   * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */

  /**
   * ### .nextTick (fn)
   *
   * Cross-compatible `nextTick` implementation. Uses
   * `process.nextTick` for node and `setTimeout(fn, 0)`
   * for the browser.
   *
   * @param {Function} callback
   * @name nextTick
   * @api public
   */

  var nextTick = ('undefined' === typeof process || !process.nextTick) ?
      browserNextTick() : process.nextTick;

  /*!
   * Prepares a cross-browser capable nextTick implementation
   * using either `postMessage` or `setTimeout(0)`.
   *
   * @attr http://dbaron.org/log/20100309-faster-timeouts
   * @api private
   */

  function browserNextTick () {
    if (!window || !window.postMessage || window.ActiveXObject) {
      return function (fn) {
        setTimeout(fn, 0);
      };
    }

    var timeouts = []
      , name = 'breeze-zero-timeout';

    window.addEventListener('message', function (e) {
      if (e.source === window && e.data === name) {
        if (e.stopPropagation) e.stopPropagation();
        if (timeouts.length) timeouts.shift()();
      }
    });

    return function (fn) {
      timeouts.push(fn);
      window.postMessage(name, '*');
    };
  }

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
      };

      C.open = function(def) {
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
      };
      
      return C.open(definition);
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
    }]
    
    , 'ease-in': ['ease-in', function (t, b, c, d) {
      var ts=(t /= d)*t;
      var tc=ts*t;
      return b+c*(-1*tc*ts + 3*ts*ts + -3*tc + 2*ts);
    }]
    
    , 'ease-out': ['ease-out', function (t, b, c, d) {
      var ts=(t /= d)*t;
      var tc=ts*t;
      return b+c*(0.3*tc*ts + -1.6*ts*ts + 2.2*tc + -1.8*ts + 1.9*t);
    }]
    
    , 'ease-in-out': ['ease-in-out', function (t, b, c, d) {
      var ts=(t /= d)*t;
      var tc=ts*t;
      return b+c*(2*tc*ts + -5*ts*ts + 2*tc + 2*ts);
    }]
    
    // --------------------------------------------------
    // Robert Penner easing equations and their CSS equivalents.
    // http://www.robertpenner.com/easing_terms_of_use.html
    
    , 'linear': ['linear', function (t, b, c, d) {
      return c*t/d + b;
    }]
    
    // Quad
    , 'ease-in-quad':
    ['cubic-bezier(0.550, 0.085, 0.680, 0.530)', function (t, b, c, d) {
      return c*(t /= d)*t + b;
    }]
    
    , 'ease-out-quad':
    ['cubic-bezier(0.250, 0.460, 0.450, 0.940)', function (t, b, c, d) {
      return -c *(t /= d)*(t-2) + b;
    }]
    
    , 'ease-in-out-quad':
    ['cubic-bezier(0.455, 0.030, 0.515, 0.955)', function (t, b, c, d) {
      if ((t /= d/2) < 1) return c/2*t*t + b;
      return -c/2 * ((--t)*(t-2) - 1) + b;
    }]
    
    // Cubic
    , 'ease-in-cubic':
    ['cubic-bezier(0.550, 0.055, 0.675, 0.190)', function (t, b, c, d) {
      return c*(t /= d)*t*t + b;
    }]
    
    , 'ease-out-cubic':
    ['cubic-bezier(0.215, 0.610, 0.355, 1)', function (t, b, c, d) {
      return c*((t=t/d-1)*t*t + 1) + b;
    }]
    
    , 'ease-in-out-cubic':
    ['cubic-bezier(0.645, 0.045, 0.355, 1)', function (t, b, c, d) {
      if ((t /= d/2) < 1) return c/2*t*t*t + b;
      return c/2*((t-=2)*t*t + 2) + b;
    }]
    
    // Quart
    , 'ease-in-quart':
    ['cubic-bezier(0.895, 0.030, 0.685, 0.220)', function (t, b, c, d) {
      return c*(t /= d)*t*t*t + b;
    }]
    
    , 'ease-out-quart':
    ['cubic-bezier(0.165, 0.840, 0.440, 1)', function (t, b, c, d) {
      return -c * ((t=t/d-1)*t*t*t - 1) + b;
    }]
    
    , 'ease-in-out-quart':
    ['cubic-bezier(0.770, 0, 0.175, 1)', function (t, b, c, d) {
      if ((t /= d/2) < 1) return c/2*t*t*t*t + b;
      return -c/2 * ((t-=2)*t*t*t - 2) + b;
    }]
    
    // Quint
    , 'ease-in-quint':
    ['cubic-bezier(0.755, 0.050, 0.855, 0.060)', function (t, b, c, d) {
      return c*(t /= d)*t*t*t*t + b;
    }]
    
    , 'ease-out-quint':
    ['cubic-bezier(0.230, 1, 0.320, 1)', function (t, b, c, d) {
      return c*((t=t/d-1)*t*t*t*t + 1) + b;
    }]
    
    , 'ease-in-out-quint':
    ['cubic-bezier(0.860, 0, 0.070, 1)', function (t, b, c, d) {
      if ((t /= d/2) < 1) return c/2*t*t*t*t*t + b;
      return c/2*((t-=2)*t*t*t*t + 2) + b;
    }]
    
    // Sine
    , 'ease-in-sine':
    ['cubic-bezier(0.470, 0, 0.745, 0.715)', function (t, b, c, d) {
      return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    }]
    
    , 'ease-out-sine':
    ['cubic-bezier(0.390, 0.575, 0.565, 1)', function (t, b, c, d) {
      return c * Math.sin(t/d * (Math.PI/2)) + b;
    }]
    
    , 'ease-in-out-sine':
    ['cubic-bezier(0.445, 0.050, 0.550, 0.950)', function (t, b, c, d) {
      return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    }]
    
    // Expo
    , 'ease-in-expo':
    ['cubic-bezier(0.950, 0.050, 0.795, 0.035)', function (t, b, c, d) {
      return (t === 0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
    }]
    
    , 'ease-out-expo':
    ['cubic-bezier(0.190, 1, 0.220, 1)', function (t, b, c, d) {
      return (t === d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    }]
    
    , 'ease-in-out-expo':
    ['cubic-bezier(1, 0, 0, 1)', function (t, b, c, d) {
      if (t === 0) return b;
      if (t === d) return b+c;
      if ((t /= d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
      return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }]
    
    // Circ
    , 'ease-in-circ':
    ['cubic-bezier(0.600, 0.040, 0.980, 0.335)', function (t, b, c, d) {
      return -c * (Math.sqrt(1 - (t /= d)*t) - 1) + b;
    }]
    
    , 'ease-out-circ':
    ['cubic-bezier(0.075, 0.820, 0.165, 1)', function (t, b, c, d) {
      return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
    }]
    
    , 'ease-in-out-circ':
    ['cubic-bezier(0.785, 0.135, 0.150, 0.860)', function (t, b, c, d) {
      if ((t /= d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
      return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
    }]
    
    // Back
    , 'ease-in-back':
    ['cubic-bezier(0.600, -0.280, 0.735, 0.045)', function (t, b, c, d, s) {
      if (s === undefined) s = 1.70158;
      return c*(t /= d)*t*((s+1)*t - s) + b;
    }]
    
    , 'ease-out-back':
    ['cubic-bezier(0.175, 0.885, 0.320, 1.275)', function (t, b, c, d, s) {
      if (s === undefined) s = 1.70158;
      return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    }]
    
    , 'ease-in-out-back':
    ['cubic-bezier(0.680, -0.550, 0.265, 1.550)', function (t, b, c, d, s) {
      if (s === undefined) s = 1.70158; 
      if ((t /= d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
      return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    }]
  };
  
  // Clamp cubic-bezier values for webkit bug
  // https://bugs.webkit.org/show_bug.cgi?id=45761
  var clamped = {
      'ease-in-back': 'cubic-bezier(0.600, 0, 0.735, 0.045)'
    , 'ease-out-back': 'cubic-bezier(0.175, 0.885, 0.320, 1)'
    , 'ease-in-out-back': 'cubic-bezier(0.680, 0, 0.265, 1)'
  };

  // --------------------------------------------------
  // Private vars
  /*global jQuery, nextTick, P, easing, clamped */
  
  var doc = document
    , win = window
    , store = 'bkwld-tram-js'
    , slice = Array.prototype.slice
    , unitRegex = /[\.0-9]/g
    , capsRegex = /[A-Z]/g
    , typeNumber = 'number'
    , typeColor = /^(rgb|#)/
    , typeLength = /(em|cm|mm|in|pt|pc|px)$/
    , typeLenPerc = /(em|cm|mm|in|pt|pc|px|%)$/
    , typeAngle = /(deg|rad|turn)$/
    , typeFancy = 'unitless'
    , space = ' '
    , degrees = 'deg'
    , pixels = 'px'
  ;
  
  // --------------------------------------------------
  // Private functions
  
  // Simple feature detect, returns both dom + css prefixed names
  var testDiv = doc.createElement('a')
    , domPrefixes = ['Webkit', 'Moz', 'O', 'ms']
    , cssPrefixes = ['-webkit-', '-moz-', '-o-', '-ms-']
  ;
  var testFeature = function (prop) {
    // unprefixed case
    if (prop in testDiv.style) return { dom: prop, css: prop };
    // test all prefixes
    var i, domProp, domSuffix = '', words = prop.split('-');
    for (i = 0; i < words.length; i++) {
      domSuffix += words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    for (i = 0; i < domPrefixes.length; i++) {
      domProp = domPrefixes[i] + domSuffix;
      if (domProp in testDiv.style) return { dom: domProp, css: cssPrefixes[i] + prop };
    }
  };
  
  // Feature tests
  var support = tram.support = {
      bind: Function.prototype.bind
    , transform: testFeature('transform')
    , transition: testFeature('transition')
    , backface: testFeature('backface-visibility')
    , timing: testFeature('transition-timing-function')
  };
  
  // Modify easing variants for webkit clamp bug
  if (support.transition) {
    var timingProp = support.timing.dom;
    testDiv.style[timingProp] = easing['ease-in-back'][0];
    if (!testDiv.style[timingProp]) {
      // style invalid, use clamped versions
      for (var x in clamped) easing[x][0] = clamped[x];
    }
  }
  
  // Done with test div, avoid IE memory leak.
  testDiv = null;
  
  // --------------------------------------------------
  // Transition class - public API returned from the tram() wrapper.
  
  var Transition = P(function(proto) {
    
    proto.init = function (el) {
      this.el = el;
      this.$el = jQuery(el);
      this.props = {};
      this.queue = [];
      this.style = '';
      // hide backface if supported, for better perf
      if (support.backface) this.el.style[support.backface.dom] = 'hidden';
    };
    
    // Public chainable methods
    chain('add', add);
    chain('start', start);
    chain('stop', stop);
    chain('set', set);
    
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
        prop.onChange = proxy(this, onChange);
        prop.onEnd = proxy(this, onEnd);
      }
      // Init settings + type + options
      prop.init(this.$el, settings, definition, options || {});
    }
    
    function onChange() {
      // build transition string from active props
      var p, prop, result = [];
      for (p in this.props) {
        prop = this.props[p];
        if (!prop.active) continue;
        result.push(prop.string);
      }
      // set transition style property on dom element
      result = result.join(',');
      if (this.style === result) return;
      this.style = result;
      this.el.style[support.transition.dom] = result;
    }
    
    function onEnd() {
      // TODO proceed to next item in queue
    }
    
    // Public start() - chainable
    function start(options) {
      // If the first argument is an array, use that as the arguments instead.
      var args = jQuery.isArray(options) ? options.slice() : slice.call(arguments);
      if (!args.length) return;
      
      var current = args.shift();
      if (!current) return;
      
      // TODO - Deal with existing queue. Replacing it entirely for now.
      // Push any extra arguments into queue
      if (args.length > 1) this.queue = args;
      
      // If current is a function, invoke it.
      if (typeof current == 'function') {
        current(this);
        return;
      }
      
      // If current is an object, start property tweens.
      if (typeof current == 'object') {
        // loop through each valid property
        var timeSpan = 0;
        eachProp.call(this, current, function (prop, value) {
          // determine the longest time span (duration + delay)
          if (prop.span > timeSpan) timeSpan = prop.span;
          // animate property value
          prop.animate(value);
        });
        // call change handler once for all active props
        onChange.call(this);
        // TODO proceed to next item in queue after timeSpan
      }
    }
    
    // Public stop() - chainable
    function stop(property) {
      var values = {};
      if (property) values[property] = 1;
      else values = this.props;
      eachProp.call(this, values, function (prop, value) {
        prop.stop();
      });
    }
    
    // Public set() - chainable
    function set(values) {
      eachProp.call(this, values, function (prop, value) {
        prop.set(value);
      });
    }
    
    // Loop through valid properties and run iterator callback
    function eachProp(collection, iterator) {
      var p, value
        , transform = this.props.transform
        , transMatch = false
        , transProps = {}
      ;
      for (p in collection) {
        value = collection[p];
        // check for special Transform sub-properties
        if (transform && p in Transform.map) {
          transProps[p] = value;
          transMatch = true;
          continue;
        }
        // check for camelCase property name + convert to dashed
        if (capsRegex.test(p)) p = toDashed(p);
        // iterate with valid property / value
        if (p in this.props && p in propertyMap) {
          iterator(this.props[p], value);
        }
      }
      // iterate with transform prop / sub-prop values
      if (transMatch) iterator(transform, transProps);
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
      var $elems = jQuery(args[0]);
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
      var t = jQuery.data(el, store) || jQuery.data(el, store, new Transition.Bare());
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
    
    proto.init = function ($el, settings, definition, options) {
      // Initialize or extend settings
      this.$el = $el;
      this.el = $el[0];
      var name = settings[0];
      if (definition[2]) name = definition[2]; // expand name
      if (prefixed[name]) name = prefixed[name];
      this.name = name;
      this.type = definition[1];
      this.duration = validTime(settings[1], this.duration, defaults.duration);
      this.ease = validEase(settings[2], this.ease, defaults.ease);
      this.delay = validTime(settings[3], this.delay, defaults.delay);
      this.span = this.duration + this.delay;
      this.active = false;
      // Use CSS transitions when supported, unless tween is set via options.
      if (support.transition && options.tween !== true) {
        this.animate = this.transition;
        this.string = this.name + space + this.duration + 'ms' +
          (this.ease != 'ease' ? space + easing[this.ease][0] : '') +
          (this.delay ? space + this.delay + 'ms' : '');
      } else {
        this.animate = this.fallback;
      }
    };
    
    // Set value immediately
    proto.set = function (value) {
      // stop any active transition or tween
      this.stop();
      value = this.convert(value, this.type);
      this.$el.css(this.name, value);
    };
    
    // CSS transition
    proto.transition = function (value) {
      // stop any active transition (without change event)
      this.stop(false);
      // set new value to start transition
      this.active = true;
      this.defer(this, this.convert(value, this.type));
    };
    
    // Deferred update to start CSS transition
    proto.defer = function (self, value) {
      nextTick(function () {
        // Check active state to prevent a race condition
        self.active && self.$el.css(self.name, value);
      });
    };
    
    // Fallback tweening
    proto.fallback = function (value) {
      // stop any active transition or tween
      this.stop();
      // start a new tween
      this.tween = new Tween({
          from: this.convert(this.$el.css(this.name), this.type)
        , to: this.convert(value, this.type)
        , duration: this.duration
        , delay: this.delay
        , ease: this.ease
        , update: this.update
        , context: this
      });
    };
    
    // Update css value (called from tween)
    proto.update = function (value) {
      this.$el.css(this.name, value);
    };
    
    // Stop animation
    proto.stop = function (emit) {
      // Emit change event by default
      if (emit !== false) emit = true;
      this.tween && this.tween.destroy();
      // Reset property to stop CSS transition
      if (this.active) {
        this.active = false;
        var value = this.$el.css(this.name);
        this.$el.css(this.name, value);
        emit && this.onChange();
      }
    };
    
    // Convert value to expected type
    proto.convert = function (value, type) {
      var warnType
        , number = typeof value == 'number'
        , string = typeof value == 'string'
      ;
      switch(type) {
        case typeNumber:
          if (number) return value;
          if (string && value.replace(unitRegex, '') === '') return +value;
          warnType = 'number(unitless)';
          break;
        case typeColor:
          if (string) {
            if (value === '' && this.original) {
              return this.original;
            }
            if (type.test(value)) {
              if (value.charAt(0) == '#' && value.length == 7) return value;
              return cssToHex(value);
            }
          }
          warnType = 'hex or rgb string';
          break;
        case typeLength:
          if (number) return value + pixels;
          if (string && type.test(value)) return value;
          warnType = 'number(px) or string(unit)';
          break;
        case typeLenPerc:
          if (number) return value + pixels;
          if (string && type.test(value)) return value;
          warnType = 'number(px) or string(unit or %)';
          break;
        case typeAngle:
          if (number) return value + degrees;
          if (string && type.test(value)) return value;
          warnType = 'number(deg) or string(angle)';
          break;
        case typeFancy:
          if (number) return value;
          if (string && typeLenPerc.test(value)) return value;
          warnType = 'number(unitless) or string(unit or %)';
          break;
      }
      // Type must be invalid, warn people.
      typeWarning(warnType, value);
      return value;
    };
    
    // Normalize time values
    var ms = /ms/, sec = /s|\./;
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
    
    // Convert rgb and short hex to long hex
    function cssToHex(c) {
      var m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(c);
      return (m ? rgbToHex(m[1], m[2], m[3]) : c)
        .replace(/#(\w)(\w)(\w)$/, '#$1$1$2$2$3$3');
    }
  });
  
  var Color = P(Property, function (proto, supr) {
    
    proto.init = function () {
      supr.init.apply(this, arguments);
      
      // Store original computed value to allow tweening to ''
      if (!this.original) this.original = this.$el.css(this.name);
    };
  });
  
  var Transform = P(Property, function (proto, supr) {
    
    var perspective = 1000;
    
    proto.init = function () {
      supr.init.apply(this, arguments);
      
      // Store transform state
      this.props = {};
      
      // Set default perspective (if backface supported)
      if (support.backface) {
        this.el.style[support.transform.dom] = 'perspective(' + perspective + ')';
        this.el.offsetHeight; // redraw
        this.props.perspective = perspective;
      }
    };
    
    proto.set = function (props) {
      // TODO store all previous transform values during set or start
      // and then include them in the result of convert()
    };
    
    proto.transition = function () {
      // TODO use a tween to keep values updated?
      // or just don't allow get() ing the transform props?
    };
    
    proto.fallback = function () {
      // TODO create a tween for each transform prop
    };
    
    proto.convert = function (props, type) {
      // Convert transform sub-properties
      var p, name, value, def, result = '';
      for (p in props) {
        def = Transform.map[p];
        name = def[1] || p;
        console.log(name);
        value = supr.convert(props[p], def[0]);
        result += name + '(' + value + ') ';
      }
      return result;
    };
  });
  
  // --------------------------------------------------
  // Tween class - handles timing and frame-based animation.
  
  var Tween = P(function (proto) {
    
    // Private vars
    var defaults = {
        duration: 500
      , ease: easing.ease[1]
      , delay: 0
      , from: 0
      , to: 1
    };
    
    proto.init = function (options) {
      // Init timing props
      this.duration = options.duration || defaults.duration;
      this.delay = options.delay || defaults.delay;
      // Use ease function or key value from easing map
      var ease = options.ease || defaults.ease;
      if (easing[ease]) ease = easing[ease][1];
      if (typeof ease != 'function') ease = defaults.ease;
      this.ease = ease;
      this.update = options.update || noop;
      this.complete = options.complete || noop;
      this.context = options.context;
      // Format value and determine units
      var from = options.from;
      var to = options.to;
      if (from === undefined) from = defaults.from;
      if (to === undefined) to = defaults.to;
      this.unit = options.unit || '';
      if (typeof from == 'number' && typeof to == 'number') {
        this.begin = from;
        this.change = to - from;
      } else {
        this.format(to, from);
      }
      // Start tween
      this.start = timeNow();
      this.play();
    };
    
    proto.play = function () {
      if (this.active) return;
      this.active = true;
      addRender(this);
    };
    
    proto.stop = function () {
      if (!this.active) return;
      this.active = false;
      removeRender(this);
    };
    
    proto.render = function (now) {
      var value, delta = now - this.start;
      // skip render during delay
      if (this.delay) {
        if (delta <= this.delay) return;
        // after delay, reduce delta
        delta -= this.delay;
      }
      if (delta < this.duration) {
        // calculate eased position
        var position = this.ease(delta, 0, 1, this.duration);
        value = this.startRGB ? interpolate(this.startRGB, this.endRGB, position)
          : this.begin + (position * this.change);
        if (this.unit) value += this.unit;
        this.update.call(this.context, value);
        return;
      }
      // we're done, set final value and destroy
      value = this.endHex || this.begin + this.change;
      if (this.unit) value += this.unit;
      this.update.call(this.context, value);
      this.complete.call(this.context);
      this.destroy();
    };
    
    // Format string values for tween
    proto.format = function (to, from) {
      // cast strings
      from += '';
      to += '';
      // hex colors
      if (to.charAt(0) == '#') {
        this.startRGB = hexToRgb(from);
        this.endRGB = hexToRgb(to);
        this.endHex = to;
        this.begin = 0;
        this.change = 1;
        return;
      }
      // determine unit suffix
      if (!this.unit) {
        var fromUnit = from.replace(unitRegex, '');
        var toUnit = to.replace(unitRegex, '');
        if (fromUnit !== toUnit) unitWarning('tween', from, to);
        this.unit = fromUnit;
      }
      from = parseFloat(from);
      to = parseFloat(to);
      this.begin = from;
      this.change = to - from;
    };
    
    // Clean up for garbage collection
    proto.destroy = function () {
      this.stop();
      this.ease =
      this.update =
      this.complete =
      this.context =
      null;
    };
    
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
    
    // Add a tween to the render list
    var tweenList = [];
    function addRender(tween) {
      // if this is the first item, start the render loop
      if (tweenList.push(tween) === 1) enterFrame(renderLoop);
    }
    
    // Loop through all tweens on each frame
    function renderLoop() {
      var i, now, count = tweenList.length;
      if (!count) return;
      enterFrame(renderLoop);
      now = timeNow();
      for (i = count; i--;) {
        tweenList[i].render(now);
      }
    }
    
    // Remove tween from render list
    function removeRender(tween) {
      var rest, index = jQuery.inArray(tween, tweenList);
      if (index >= 0) {
        rest = tweenList.slice(index + 1);
        tweenList.length = index;
        if (rest.length) tweenList = tweenList.concat(rest);
      }
    }
    
    // Interpolate rgb colors based on `position`, returns hex string
    function interpolate(start, end, position) {
      return rgbToHex(
        start[0] + position * (end[0] - start[0]),
        start[1] + position * (end[1] - start[1]),
        start[2] + position * (end[2] - start[2])
      );
    }
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
      defaultUnit: pixels // default unit added to <length> types
    , defaultAngle: degrees // default unit added to <angle> types
    , remPixels: false // rems with pixel length fallback
    , remFontSize: 16 // used by remPixels option
  };
  
  // macro() static method
  tram.macro = function () {
    // TODO
    // use string for macros?
    // example:
    // t.start({ x: 50 });
    // t.then('fade-out');
  };
  
  // tween() static method
  tram.tween = function (options) {
    return new Tween(options);
  };
  
  // jQuery plugin method, keeps jQuery chain intact.
  jQuery.fn.tram = function (args) {
    // Pass along element as first argument
    args = [this].concat(slice.call(arguments));
    // Directly instantiate Tram class, no tram chain!
    new Tram(args);
    return this;
  };
  
  // --------------------------------------------------
  // Property map + unit values
  
  // Prefixed property names
  var prefixed = {
    'transform': support.transform && support.transform.css
  };
  
  var propertyMap = (function (Prop) {
    
    // Transform sub-properties { name: [ valueType, expand ]}
    Transform.map = {
        x:            [ typeLenPerc, 'translateX' ]
      , y:            [ typeLenPerc, 'translateY' ]
      , z:            [ typeLenPerc, 'translateZ' ]
      , rotate:       [ typeAngle ]
      , rotateX:      [ typeAngle ]
      , rotateY:      [ typeAngle ]
      , rotateZ:      [ typeAngle ]
      , scale:        [ typeNumber ]
      , scaleX:       [ typeNumber ]
      , scaleY:       [ typeNumber ]
      , scaleZ:       [ typeNumber ]
      , skew:         [ typeAngle ]
      , skewX:        [ typeAngle ]
      , skewY:        [ typeAngle ]
      , perspective:  [ typeLength ]
    };
    
    // Main Property map { name: [ Class, valueType, expand ]}
    return {
        'color'                : [ Color, typeColor ]
      , 'background'           : [ Color, typeColor, 'background-color' ]
      , 'outline-color'        : [ Color, typeColor ]
      , 'border-color'         : [ Color, typeColor ]
      , 'border-top-color'     : [ Color, typeColor ]
      , 'border-right-color'   : [ Color, typeColor ]
      , 'border-bottom-color'  : [ Color, typeColor ]
      , 'border-left-color'    : [ Color, typeColor ]
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
      , 'line-height'          : [ Property, typeFancy ]
      , 'transform'            : [ Transform ]
      // , 'background-position'  : [ Property, typeLenPerc ]
      // , 'transform-origin'     : [ Property, typeLenPerc ]
    };
  }());
  
  // --------------------------------------------------
  // Utils
  
  function toDashed(string) {
    return string.replace(capsRegex, function (s) {
      return '-' + s.toLowerCase();
    });
  }
  
  function hexToRgb(hex) {
    var n = parseInt(hex.slice(1), 16);
    var r = (n >> 16) & 255;
    var g = (n >> 8) & 255;
    var b = n & 255;
    return [r,g,b];
  }
  
  function rgbToHex(r, g, b) {
    return '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
  }
  
  function noop() {}
  
  function typeWarning(exp, val) {
    warn('Type warning: Expected: [' + exp + '] Got: [' + typeof val + '] ' + val);
  }
  
  function unitWarning(name, from, to) {
    warn('Units do not match [' + name + ']: ' + from + ', ' + to);
  }
  
  // Log warning message if supported
  var warn = (function () {
    var warn = 'warn';
    var console = window.console;
    if (console && console[warn]) return function (msg) { console[warn](msg); };
    return noop;
  }());
  
  // Faux-bind helper (single arg for perf)
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
  return jQuery.tram = tram;

}(window.jQuery));

/*!
 * tram.js v0.8.1-global
 * Cross-browser CSS3 transitions in JavaScript
 * https://github.com/bkwld/tram
 * MIT License
 */
window.tram = (function (jQuery) {

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
  /*global jQuery, P, easing, clamped */

  var doc = document
    , win = window
    , dataKey = 'bkwld-tram'
    , unitRegex = /[\-\.0-9]/g
    , capsRegex = /[A-Z]/
    , typeNumber = 'number'
    , typeColor = /^(rgb|#)/
    , typeLength = /(em|cm|mm|in|pt|pc|px)$/
    , typeLenPerc = /(em|cm|mm|in|pt|pc|px|%)$/
    , typeAngle = /(deg|rad|turn)$/
    , typeFancy = 'unitless'
    , emptyTrans = /(all|none) 0s ease 0s/
    , allowAuto = /^(width|height)$/
    , space = ' '
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

  // Run feature tests
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
      // style invalid, use clamped versions instead
      for (var x in clamped) easing[x][0] = clamped[x];
    }
  }

  // Animation timer shim with setTimeout fallback
  var enterFrame = tram.frame = function () {
    var raf = win.requestAnimationFrame ||
      win.webkitRequestAnimationFrame ||
      win.mozRequestAnimationFrame ||
      win.oRequestAnimationFrame ||
      win.msRequestAnimationFrame;
    if (raf && support.bind) return raf.bind(win);
    return function (callback) {
      win.setTimeout(callback, 16);
    };
  }();

  // Timestamp shim with fallback
  var timeNow = tram.now = function () {
    // use high-res timer if available
    var perf = win.performance,
      perfNow = perf && (perf.now || perf.webkitNow || perf.msNow || perf.mozNow);
    if (perfNow && support.bind) return perfNow.bind(perf);
    // fallback to epoch-based timestamp
    return Date.now || function () {
      return +(new Date);
    };
  }();

  // --------------------------------------------------
  // Transition class - public API returned from the tram() wrapper.

  var Transition = P(function(proto) {

    proto.init = function (el) {
      this.$el = jQuery(el);
      this.el = this.$el[0];
      this.props = {};
      this.queue = [];
      this.style = '';
      this.active = false;

      // store inherited transitions from css styles
      if (config.keepInherited && !config.fallback) {
        var upstream = getStyle(this.el, 'transition');
        if (upstream && !emptyTrans.test(upstream)) this.upstream = upstream;
      }

      // hide backface if supported, for better perf
      if (support.backface && config.hideBackface) {
        setStyle(this.el, support.backface.css, 'hidden');
      }
    };

    // Public chainable methods
    chain('add', add);
    chain('start', start);
    chain('wait', wait);
    chain('then', then);
    chain('next', next);
    chain('stop', stop);
    chain('set', set);
    chain('show', show);
    chain('hide', hide);
    chain('redraw', redraw);
    chain('destroy', destroy);

    // Public add() - chainable
    function add(transition, options) {
      // Parse transition settings
      var settings = compact(('' + transition).split(space));
      var name = settings[0];
      options = options || {};

      // Get property definition from map
      var definition = propertyMap[name];
      if (!definition) return warn('Unsupported property: ' + name);

      // Ignore weak property additions
      if (options.weak && this.props[name]) return;

      // Init property instance
      var Class = definition[0];
      var prop = this.props[name];
      if (!prop) prop = this.props[name] = new Class.Bare();
      // Init settings + type + options
      prop.init(this.$el, settings, definition, options);
      return prop; // return for internal use
    }

    // Public start() - chainable
    function start(options, fromQueue, queueArgs) {
      if (!options) return;
      var optionType = typeof options;

      // Clear queue unless start was called from it
      if (!fromQueue) {
        this.timer && this.timer.destroy();
        this.queue = [];
        this.active = false;
      }

      // If options is a number, wait for a delay and continue queue.
      if (optionType == 'number' && fromQueue) {
        this.timer = new Delay({ duration: options, context: this, complete: next });
        this.active = true;
        return;
      }

      // If options is a string, invoke add() to modify transition settings
      if (optionType == 'string' && fromQueue) {
        switch (options) {
          case 'hide': hide.call(this); break;
          case 'stop': stop.call(this); break;
          case 'redraw': redraw.call(this); break;
          default: add.call(this, options, (queueArgs && queueArgs[1]));
        }
        return next.call(this);
      }

      // If options is a function, invoke it.
      if (optionType == 'function') {
        options.call(this, this);
        return;
      }

      // If options is an object, start property tweens.
      if (optionType == 'object') {

        // loop through each valid property
        var timespan = 0;
        eachProp.call(this, options, function (prop, value) {
          // determine the longest time span (duration + delay)
          if (prop.span > timespan) timespan = prop.span;
          // stop current, then begin animation
          prop.stop();
          prop.animate(value);
        }, function (extras) {
          // look for wait property and use it to override timespan
          if ('wait' in extras) timespan = validTime(extras.wait, 0);
        });
        // update main transition styles for active props
        updateStyles.call(this);

        // start timer for total transition timespan
        if (timespan > 0) {
          this.timer = new Delay({ duration: timespan, context: this });
          this.active = true;
          if (fromQueue) this.timer.complete = next;
        }
        // apply deferred styles after a single frame delay
        var self = this, found = false, styles = {};
        enterFrame(function () {
          eachProp.call(self, options, function (prop) {
            if (!prop.active) return;
            found = true;
            styles[prop.name] = prop.nextStyle;
          });
          found && self.$el.css(styles); // set styles object
        });
      }
    }

    // Public wait() - chainable
    function wait(time) {
      time = validTime(time, 0);
      // if start() has ocurred, simply push wait into queue
      if (this.active) {
        this.queue.push({ options: time });
      } else {
        // otherwise, start a timer. wait() is starting the sequence.
        this.timer = new Delay({ duration: time, context: this, complete: next });
        this.active = true;
      }
    }

    // Public then() - chainable
    function then(options) {
      if (!this.active) {
        return warn('No active transition timer. Use start() or wait() before then().');
      }
      // push options into queue
      this.queue.push({ options: options, args: arguments });
      // set timer complete callback
      this.timer.complete = next;
    }

    // Public next() - chainable
    function next() {
      // stop current timer in case next() was called early
      this.timer && this.timer.destroy();
      this.active = false;
      // if the queue is empty do nothing
      if (!this.queue.length) return;
      // start next item in queue
      var queued = this.queue.shift();
      start.call(this, queued.options, true, queued.args);
    }

    // Public stop() - chainable
    function stop(options) {
      this.timer && this.timer.destroy();
      this.queue = [];
      this.active = false;
      var values;
      if (typeof options == 'string') {
        values = {};
        values[options] = 1;
      } else if (typeof options == 'object' && options != null) {
        values = options;
      } else {
        values = this.props;
      }
      eachProp.call(this, values, stopProp);
      updateStyles.call(this);
    }

    // Public set() - chainable
    function set(values) {
      stop.call(this, values);
      eachProp.call(this, values, setProp, setExtras);
    }

    // Public show() - chainable
    function show(display) {
      // Show an element by setting its display
      if (typeof display != 'string') display = 'block';
      this.el.style.display = display;
    }

    // Public hide() - chainable
    function hide() {
      // Stop all transitions before hiding the element
      stop.call(this);
      this.el.style.display = 'none';
    }

    // Public redraw() - chainable
    function redraw() {
      this.el.offsetHeight;
    }

    // Public destroy() - chainable
    function destroy() {
      stop.call(this);
      jQuery.removeData(this.el, dataKey);
      this.$el = this.el = null;
    }

    // Update transition styles
    function updateStyles() {
      // build transition string from active props
      var p, prop, result = [];
      if (this.upstream) result.push(this.upstream);
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

    // Loop through valid properties, auto-create them, and run iterator callback
    function eachProp(collection, iterator, ejector) {
      // skip auto-add during stop()
      var autoAdd = iterator !== stopProp;
      var name;
      var prop;
      var value;
      var matches = {};
      var extras;
      // find valid properties in collection
      for (name in collection) {
        value = collection[name];
        // match transform sub-properties
        if (name in transformMap) {
          if (!matches.transform) matches.transform = {};
          matches.transform[name] = value;
          continue;
        }
        // convert camelCase to dashed
        if (capsRegex.test(name)) name = toDashed(name);
        // match base properties
        if (name in propertyMap) {
          matches[name] = value;
          continue;
        }
        // otherwise, add property to extras
        if (!extras) extras = {};
        extras[name] = value;
      }
      // iterate on each matched property, auto-adding them
      for (name in matches) {
        value = matches[name];
        prop = this.props[name];
        if (!prop) {
          // skip auto-add during stop()
          if (!autoAdd) continue;
          // auto-add property instances
          prop = add.call(this, name);
        }
        // iterate on each property
        iterator.call(this, prop, value);
      }
      // finally, eject the extras into space
      if (ejector && extras) ejector.call(this, extras);
    }

    // Loop iterators
    function stopProp(prop) { prop.stop(); }
    function setProp(prop, value) { prop.set(value); }
    function setExtras(extras) { this.$el.css(extras); }

    // Define a chainable method that takes children into account
    function chain(name, method) {
      proto[name] = function () {
        if (this.children) return eachChild.call(this, method, arguments);
        this.el && method.apply(this, arguments);
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

    proto.init = function (element, options) {
      var $elems = jQuery(element);

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
      var t = jQuery.data(el, dataKey) || jQuery.data(el, dataKey, new Transition.Bare());
      if (!t.el) t.init(el);
      if (options) return t.start(options);
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
      this.nextStyle = null;
      this.auto = allowAuto.test(this.name);
      this.unit = options.unit || this.unit || config.defaultUnit;
      this.angle = options.angle || this.angle || config.defaultAngle;
      // Animate using tween fallback if necessary, otherwise use transition.
      if (config.fallback || options.fallback) {
        this.animate = this.fallback;
      } else {
        this.animate = this.transition;
        this.string = this.name + space + this.duration + 'ms' +
          (this.ease != 'ease' ? space + easing[this.ease][0] : '') +
          (this.delay ? space + this.delay + 'ms' : '');
      }
    };

    // Set value immediately
    proto.set = function (value) {
      value = this.convert(value, this.type);
      this.update(value);
      this.redraw();
    };

    // CSS transition
    proto.transition = function (value) {
      // set new value to start transition
      this.active = true;
      value = this.convert(value, this.type);
      if (this.auto) {
        // when transitioning from 'auto', we must reset to computed
        if (this.el.style[this.name] == 'auto') {
          this.update(this.get());
          this.redraw();
        }
        if (value == 'auto') value = getAuto.call(this);
      }
      this.nextStyle = value;
    };

    // Fallback tweening
    proto.fallback = function (value) {
      var from = this.el.style[this.name] || this.convert(this.get(), this.type);
      value = this.convert(value, this.type);
      if (this.auto) {
        if (from == 'auto') from = this.convert(this.get(), this.type);
        if (value == 'auto') value = getAuto.call(this);
      }
      this.tween = new Tween({
          from: from
        , to: value
        , duration: this.duration
        , delay: this.delay
        , ease: this.ease
        , update: this.update
        , context: this
      });
    };

    // Get current element style
    proto.get = function () {
      return getStyle(this.el, this.name);
    };

    // Update element style value
    proto.update = function (value) {
      setStyle(this.el, this.name, value);
    };

    // Stop animation
    proto.stop = function () {
      // Stop CSS transition
      if (this.active || this.nextStyle) {
        this.active = false;
        this.nextStyle = null;
        setStyle(this.el, this.name, this.get());
      }
      // Stop fallback tween
      var tween = this.tween;
      if (tween && tween.context) tween.destroy();
    };

    // Convert value to expected type
    proto.convert = function (value, type) {
      if (value == 'auto' && this.auto) return value;
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
          if (number) return value + this.unit;
          if (string && type.test(value)) return value;
          warnType = 'number(px) or string(unit)';
          break;
        case typeLenPerc:
          if (number) return value + this.unit;
          if (string && type.test(value)) return value;
          warnType = 'number(px) or string(unit or %)';
          break;
        case typeAngle:
          if (number) return value + this.angle;
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

    proto.redraw = function () {
      this.el.offsetHeight;
    };

    // Calculate expected value for animating towards 'auto'
    function getAuto() {
      var oldVal = this.get();
      this.update('auto');
      var newVal = this.get();
      this.update(oldVal);
      return newVal;
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

  // --------------------------------------------------
  // Color prop

  var Color = P(Property, function (proto, supr) {

    proto.init = function () {
      supr.init.apply(this, arguments);

      // Store original computed value to allow tweening to ''
      if (this.original) return;
      this.original = this.convert(this.get(), typeColor);
    };
  });

  // --------------------------------------------------
  // Scroll prop

  var Scroll = P(Property, function (proto, supr) {

    proto.init = function () {
      supr.init.apply(this, arguments);
      this.animate = this.fallback;
    };

    proto.get = function () {
      return this.$el[this.name]();
    };

    proto.update = function (value) {
      this.$el[this.name](value);
    };
  });

  // --------------------------------------------------
  // Transform prop w/ sub-properties

  var Transform = P(Property, function (proto, supr) {

    proto.init = function () {
      supr.init.apply(this, arguments);

      // If a current state exists, return here
      if (this.current) return;

      // Store transform state
      this.current = {};

      // Set default perspective, if specified
      if (transformMap.perspective && config.perspective) {
        this.current.perspective = config.perspective;
        setStyle(this.el, this.name, this.style(this.current));
        this.redraw();
      }
    };

    proto.set = function (props) {
      // convert new props and store current values
      convertEach.call(this, props, function (name, value) {
        this.current[name] = value;
      });

      // set element style immediately
      setStyle(this.el, this.name, this.style(this.current));
      this.redraw();
    };

    proto.transition = function (props) {
      // convert new prop values and set defaults
      var values = this.values(props);

      // create MultiTween to track values over time
      this.tween = new MultiTween({
          current: this.current
        , values: values
        , duration: this.duration
        , delay: this.delay
        , ease: this.ease
      });

      // build temp object for final transition values
      var p, temp = {};
      for (p in this.current) {
        temp[p] = p in values ? values[p] : this.current[p];
      }

      // set new value to start transition
      this.active = true;
      this.nextStyle = this.style(temp);
    };

    proto.fallback = function (props) {
      // convert new prop values and set defaults
      var values = this.values(props);

      // create MultiTween to track values over time
      this.tween = new MultiTween({
          current: this.current
        , values: values
        , duration: this.duration
        , delay: this.delay
        , ease: this.ease
        , update: this.update
        , context: this
      });
    };

    // Update current values (called from MultiTween)
    proto.update = function () {
      setStyle(this.el, this.name, this.style(this.current));
    };

    // Get combined style string from props
    proto.style = function (props) {
      var p, out = '';
      for (p in props) {
        out += p + '(' + props[p] + ') ';
      }
      return out;
    };

    // Build values object and set defaults
    proto.values = function (props) {
      var values = {}, def;
      convertEach.call(this, props, function (name, value, type) {
        values[name] = value;
        // set default value if current property does not exist
        if (this.current[name] === undefined) {
          def = 0; // default prop value
          if (~name.indexOf('scale')) def = 1;
          this.current[name] = this.convert(def, type);
        }
      });
      return values;
    };

    // Loop through each prop and output name + converted value
    function convertEach(props, iterator) {
      var p, name, type, definition, value;
      for (p in props) {
        definition = transformMap[p];
        type = definition[0];
        name = definition[1] || p;
        value = this.convert(props[p], type);
        iterator.call(this, name, value, type);
      }
    }
  });

  // --------------------------------------------------
  // Tween class - tweens values over time, based on frame timers.

  var Tween = P(function (proto) {

    // Private vars
    var defaults = {
        ease: easing.ease[1]
      , from: 0
      , to: 1
    };

    proto.init = function (options) {
      // Init timing props
      this.duration = options.duration || 0;
      this.delay = options.delay || 0;

      // Use ease function or key value from easing map
      var ease = options.ease || defaults.ease;
      if (easing[ease]) ease = easing[ease][1];
      if (typeof ease != 'function') ease = defaults.ease;
      this.ease = ease;

      this.update = options.update || noop;
      this.complete = options.complete || noop;
      this.context = options.context || this;
      this.name = options.name;

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
      // Store value + unit in case it's accessed before delay is up
      this.value = this.begin + this.unit;

      // Set start time for all Tween instances
      this.start = timeNow();

      // Start tween (unless autoplay disabled)
      if (options.autoplay !== false) {
        this.play();
      }
    };

    proto.play = function () {
      if (this.active) return;
      if (!this.start) this.start = timeNow();
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
          : round(this.begin + (position * this.change));
        this.value = value + this.unit;
        this.update.call(this.context, this.value);
        return;
      }
      // we're done, set final value and destroy
      value = this.endHex || this.begin + this.change;
      this.value = value + this.unit;
      this.update.call(this.context, this.value);
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
      this.begin = this.value = from;
      this.change = to - from;
    };

    // Clean up for garbage collection
    proto.destroy = function () {
      this.stop();
      this.context = null;
      this.ease = this.update = this.complete = noop;
    };

    // Add a tween to the render list
    var tweenList = [];
    function addRender(tween) {
      // if this is the first item, start the render loop
      if (tweenList.push(tween) === 1) enterFrame(renderLoop);
    }

    // Loop through all tweens on each frame
    function renderLoop() {
      var i, now, tween, count = tweenList.length;
      if (!count) return;
      enterFrame(renderLoop);
      now = timeNow();
      for (i = count; i--;) {
        tween = tweenList[i];
        tween && tween.render(now);
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

    // Round number to limit decimals
    var factor = 1000;
    function round(value) {
      return Math.round(value * factor) / factor;
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

  // Delay - simple delay timer that hooks into frame loop
  var Delay = P(Tween, function (proto) {

    proto.init = function (options) {
      this.duration = options.duration || 0;
      this.complete = options.complete || noop;
      this.context = options.context;
      this.play();
    };

    proto.render = function (now) {
      var delta = now - this.start;
      if (delta < this.duration) return;
      this.complete.call(this.context);
      this.destroy();
    };
  });

  // MultiTween - tween multiple properties on a single frame loop
  var MultiTween = P(Tween, function (proto, supr) {

    proto.init = function (options) {
      // configure basic options
      this.context = options.context;
      this.update = options.update;

      // create child tweens for each changed property
      this.tweens = [];
      this.current = options.current; // store direct reference
      var name, value;
      for (name in options.values) {
        value = options.values[name];
        if (this.current[name] === value) continue;
        this.tweens.push(new Tween({
            name: name
          , from: this.current[name]
          , to: value
          , duration: options.duration
          , delay: options.delay
          , ease: options.ease
          , autoplay: false
        }));
      }
      // begin MultiTween render
      this.play();
    };

    proto.render = function (now) {
      // render each child tween
      var i, tween, count = this.tweens.length;
      var alive = false;
      for (i = count; i--;) {
        tween = this.tweens[i];
        if (tween.context) {
          tween.render(now);
          // store current value directly on object
          this.current[tween.name] = tween.value;
          alive = true;
        }
      }
      // destroy and stop render if no longer alive
      if (!alive) return this.destroy();

      // call update method
      this.update && this.update.call(this.context);
    };

    proto.destroy = function () {
      supr.destroy.call(this);
      if (!this.tweens) return;

      // Destroy all child tweens
      var i, count = this.tweens.length;
      for (i = count; i--;) {
        this.tweens[i].destroy();
      }
      this.tweens = null;
      this.current = null;
    };
  });

  // --------------------------------------------------
  // Main wrapper - returns a Tram instance with public chaining API.

  function tram(element, options) {
    // Chain on the result of Tram.init() to optimize single case.
    var wrap = new Tram.Bare();
    return wrap.init(element, options);
  }

  // Global tram config
  var config = tram.config = {
      defaultUnit: 'px' // default unit added to <length> types
    , defaultAngle: 'deg' // default unit added to <angle> types
    , keepInherited: false // optionally keep inherited CSS transitions
    , hideBackface: false // optionally hide backface on all elements
    , perspective: '' // optional default perspective value e.g. '1000px'
    , fallback: !support.transition // boolean to globally set fallback mode
    , agentTests: [] // array of userAgent test strings for sniffing
    // , remPixels: false // rems with pixel length fallback
    // , remFontSize: 16 // used by remPixels option
  };

  // fallback() static - browser sniff to force fallback mode
  //  Example: tram.fallback('firefox');
  //  Would match Firefox along with previously sniffed browsers.
  tram.fallback = function (testString) {
    // if no transition support, fallback is always true
    if (!support.transition) return config.fallback = true;
    config.agentTests.push('(' + testString + ')');
    var pattern = new RegExp(config.agentTests.join('|'), 'i');
    config.fallback = pattern.test(navigator.userAgent);
  };
  // Default sniffs for browsers that support transitions badly ;_;
  tram.fallback('6.0.[2-5] Safari');

  // tram.tween() static method
  tram.tween = function (options) {
    return new Tween(options);
  };

  // tram.delay() static method
  tram.delay = function (duration, callback, context) {
    return new Delay({ complete: callback, duration: duration, context: context });
  };

  // --------------------------------------------------
  // jQuery methods

  // jQuery plugin method, diverts chain to Tram object.
  jQuery.fn.tram = function (options) {
    return tram.call(null, this, options);
  };

  // Shortcuts for internal jQuery style getter / setter
  var setStyle = jQuery.style;
  var getStyle = jQuery.css;

  // --------------------------------------------------
  // Property maps + unit values

  // Prefixed property names
  var prefixed = {
    'transform': support.transform && support.transform.css
  };

  // Main Property map { name: [ Class, valueType, expand ]}
  var propertyMap = {
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
    , 'scroll-top'           : [ Scroll, typeNumber, 'scrollTop' ]
    , 'scroll-left'          : [ Scroll, typeNumber, 'scrollLeft' ]
    // , 'background-position'  : [ Property, typeLenPerc ]
  };

  // Transform property maps
  var transformMap = {};

  if (support.transform) {
    // Add base properties if supported
    propertyMap['transform'] = [ Transform ];
    // propertyMap['transform-origin'] = [ Transform ];

    // Transform sub-property map { name: [ valueType, expand ]}
    transformMap = {
        x:            [ typeLenPerc, 'translateX' ]
      , y:            [ typeLenPerc, 'translateY' ]
      , rotate:       [ typeAngle ]
      , rotateX:      [ typeAngle ]
      , rotateY:      [ typeAngle ]
      , scale:        [ typeNumber ]
      , scaleX:       [ typeNumber ]
      , scaleY:       [ typeNumber ]
      , skew:         [ typeAngle ]
      , skewX:        [ typeAngle ]
      , skewY:        [ typeAngle ]
    };
  }

  // Add 3D transform props if supported
  if (support.transform && support.backface) {
    transformMap.z           = [ typeLenPerc, 'translateZ' ];
    transformMap.rotateZ     = [ typeAngle ];
    transformMap.scaleZ      = [ typeNumber ];
    transformMap.perspective = [ typeLength ];
  }

  // --------------------------------------------------
  // Utils

  function toDashed(string) {
    return string.replace(/[A-Z]/g, function (letter) {
      return '-' + letter.toLowerCase();
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

  // Normalize time values
  var milli = /ms/, seconds = /s|\./;
  function validTime(string, current, safe) {
    if (current !== undefined) safe = current;
    if (string === undefined) return safe;
    var n = safe;
    // if string contains 'ms' or contains no suffix
    if (milli.test(string) || !seconds.test(string)) {
      n = parseInt(string, 10);
    // otherwise if string contains 's' or a decimal point
    } else if (seconds.test(string)) {
      n = parseFloat(string) * 1000;
    }
    if (n < 0) n = 0; // no negative times
    return n === n ? n : safe; // protect from NaNs
  }

  // Log warning message if supported
  var warn = (function () {
    var warn = 'warn';
    var console = window.console;
    if (console && console[warn]) return function (msg) { console[warn](msg); };
    return noop;
  }());

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

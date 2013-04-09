  // --------------------------------------------------
  // Private vars
  /*global jQuery, P, easing, clamped */
  
  var doc = document
    , win = window
    , store = 'bkwld-tram-js'
    , unitRegex = /[\-\.0-9]/g
    , capsRegex = /[A-Z]/
    , typeNumber = 'number'
    , typeColor = /^(rgb|#)/
    , typeLength = /(em|cm|mm|in|pt|pc|px)$/
    , typeLenPerc = /(em|cm|mm|in|pt|pc|px|%)$/
    , typeAngle = /(deg|rad|turn)$/
    , typeFancy = 'unitless'
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
      if (support.backface && config.hideBackface)
        this.el.style[support.backface.dom] = 'hidden';
    };
    
    // Public chainable methods
    chain('add', add);
    chain('start', start);
    chain('then', then);
    chain('next', next);
    chain('stop', stop);
    chain('set', set);
    
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
    }
    
    // Update transition styles
    function updateStyles() {
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
    
    // Public start() - chainable
    function start(options, fromQueue) {
      if (!options) return;
      var optionType = typeof options;
      
      // Clear queue unless start was called from it
      if (!fromQueue) {
        this.timer && this.timer.destroy();
        this.queue = [];
      }
      
      // If options is a string, check macros
      if (optionType === 'string' && macros[options]) {
        return start.call(this, macros[options]);
      }
      
      // If options is a function, invoke it.
      if (optionType === 'function') {
        options(this);
        return;
      }
      
      // If options is an object, start property tweens.
      if (optionType === 'object') {
        // loop through each valid property
        var timespan = 0;
        eachProp.call(this, options, function (prop, value) {
          // determine the longest time span (duration + delay)
          if (prop.span > timespan) timespan = prop.span;
          // animate property value
          prop.animate(value);
        });
        // update main transition styles for active props
        updateStyles.call(this);
        // start timer for total transition timespan
        if (timespan > 0) {
          this.timer = new Delay({ duration: timespan, context: this });
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
          found && self.$el.css(styles);
        });
      }
    }
    
    // Public then() - chainable
    function then(options) {
      if (!this.timer || !this.timer.active) {
        return warn('No active transition timer. Must start() one first.');
      }
      // push options into queue
      this.queue.push(options);
      // set timer complete callback
      this.timer.complete = next;
    }
    
    // Public next() - chainable
    function next() {
      // stop current timer in case next() was called early
      this.timer && this.timer.destroy();
      // if the queue is empty do nothing
      if (!this.queue.length) return;
      // start next item in queue
      var options = this.queue.shift();
      start.call(this, options, true);
    }
    
    // Public stop() - chainable
    function stop(property) {
      this.timer && this.timer.destroy();
      this.queue = [];
      var values = {};
      if (property) values[property] = 1;
      else values = this.props;
      eachProp.call(this, values, function (prop) {
        prop.stop();
      });
      updateStyles.call(this);
    }
    
    // Public set() - chainable
    function set(values) {
      this.timer && this.timer.destroy();
      this.queue = [];
      eachProp.call(this, values, function (prop, value) {
        prop.set(value);
      });
      updateStyles.call(this);
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
        if (transform && p in transformMap) {
          transProps[p] = value;
          transMatch = true;
          continue;
        }
        // check for camelCase property name + convert to dashed
        if (capsRegex.test(p)) p = toDashed(p);
        // iterate with valid property / value
        if (p in this.props && p in propertyMap) {
          iterator.call(this, this.props[p], value);
        }
      }
      // iterate with transform prop / sub-prop values
      if (transMatch) iterator.call(this, transform, transProps);
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
      var t = jQuery.data(el, store) || jQuery.data(el, store, new Transition.Bare());
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
      // stop any active transition or tween
      this.stop();
      value = this.convert(value, this.type);
      this.$el.css(this.name, value);
      this.redraw();
    };
    
    // CSS transition
    proto.transition = function (value) {
      // stop any active transition or tween
      this.stop();
      // set new value to start transition
      this.active = true;
      this.nextStyle = this.convert(value, this.type);
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
    proto.stop = function () {
      this.tween && this.tween.destroy();
      // Reset property to stop CSS transition
      if (this.active) {
        this.active = false;
        this.$el.css(this.name, this.$el.css(this.name));
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
          if (number) return value + config.defaultUnit;
          if (string && type.test(value)) return value;
          warnType = 'number(px) or string(unit)';
          break;
        case typeLenPerc:
          if (number) return value + config.defaultUnit;
          if (string && type.test(value)) return value;
          warnType = 'number(px) or string(unit or %)';
          break;
        case typeAngle:
          if (number) return value + config.defaultAngle;
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
      if (n < 0) n = 0; // no negative times
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
  
  // --------------------------------------------------
  // Color prop
  
  var Color = P(Property, function (proto, supr) {
    
    proto.init = function () {
      supr.init.apply(this, arguments);
      
      // Store original computed value to allow tweening to ''
      if (this.original) return;
      this.original = this.convert(this.$el.css(this.name), typeColor);
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
      
      // Default perspective, if supported
      if (transformMap.perspective) {
        this.current.perspective = '1000px';
        this.$el.css(this.name, this.style(this.current));
        this.redraw();
      }
    };
    
    proto.set = function (props) {
      // stop any active transition or tween
      this.stop();
      
      // convert new props and store current values
      convertEach.call(this, props, function (name, value) {
        this.current[name] = value;
      });
      
      // set element style immediately
      this.$el.css(this.name, this.style(this.current));
      this.redraw();
    };
    
    proto.transition = function (props) {
      // stop any active transition or tween
      this.stop();
      
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
      // stop any active transition or tween
      this.stop();
      
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
      this.$el.css(this.name, this.style(this.current));
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
          : this.begin + (position * this.change);
        if (this.unit) value += this.unit;
        this.value = value;
        this.update.call(this.context, value);
        return;
      }
      // we're done, set final value and destroy
      value = this.endHex || this.begin + this.change;
      if (this.unit) value += this.unit;
      this.value = value;
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
      this.begin = this.value = from;
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
        if (tween.ease) {
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
    , hideBackface: true // always hide backface on elements
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
  tram.fallback('6.0.(2|3) Safari');
  
  // macro() static method
  var macros = {};
  tram.macro = function (name, options) {
    // store a simple macro for the .start() method to use
    macros[name] = options;
  };
  
  // tween() static method
  tram.tween = function (options) {
    return new Tween(options);
  };
  
  // jQuery plugin method, keeps jQuery chain intact.
  jQuery.fn.tram = function (options) {
    new Tram(this, options);
    return this;
  };
  
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

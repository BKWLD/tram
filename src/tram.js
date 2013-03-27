  // --------------------------------------------------
  // Private vars
  /*global $, P, easing */
  
  var doc = document
    , win = window
    , store = 'bkwld-tram-js'
    , slice = Array.prototype.slice
    , testStyle = doc.createElement('a').style
    , domPrefixes = ['Webkit', 'Moz', 'O', 'ms']
    , cssPrefixes = ['-webkit-', '-moz-', '-o-', '-ms-']
  ;
  
  // --------------------------------------------------
  // Private functions
  
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
    if (perfNow && Function.prototype.bind) {
      return perfNow.bind(perf);
    }
    // fallback to epoch-based timestamp
    return Date.now || function () {
      return +(new Date);
    };
  }();
  
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
    transform: testFeature('transform'),
    transition: testFeature('transition')
  });
  
  // --------------------------------------------------
  // Transition class - public API returned from the tram() wrapper.
  var Transition = P(function(proto) {
    
    proto.init = function (el) {
      this.el = el;
      this.$el = $(el);
    };
    
    chainable('add', function (transition) {
      console.log('add', this.el, transition);
    });

    chainable('start', function (options) {
      console.log('start', this.el, options);
    });
    
    // Define a chainable method that takes children into account
    function chainable(name, method) {
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
  
  console.log(Transition.prototype.start);
  
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
    
    // Retrieve instance from data or store a new one.
    function factory(el, options) {
      var t = $.data(el, store) || $.data(el, store, new Transition(el));
      if (options.length) return t.start(options);
      return t;
    }
  });
  
  // --------------------------------------------------
  // Tween class - handles timing and fallback animation.
  
  var Tween = P(function (proto) {
    
  });
  
  // --------------------------------------------------
  // Property classes - generic and custom setters / getters.
  
  var Property = P(function (proto) {
    
  });
  
  var Color = P(Property, function (proto, supr) {
    
  });
  
  var Transform = P(Property, function (proto, supr) {
    
  });
  
  // --------------------------------------------------
  // Main wrapper - returns a Tram instance with public chaining API.
  function tram() {
    // Chain on the result of Tram.init() to optimize single case.
    var wrap = new Tram.Bare();
    return wrap.init(slice.call(arguments));
  }
  
  // macro() static method
  tram.macro = function (id, fn) {
    // TODO
  };
  
  // tween() static method
  tram.tween = function (options) {
    // TODO
  };
  
  // --------------------------------------------------
  // jQuery plugin method, keeps jQuery chain intact.
  
  $.fn.tram = function (args) {
    // Pass along element as first argument
    args = [this].concat(slice.call(arguments));
    // Directly instantiate Tram class, no tram chain!
    new Tram(args);
    return this;
  };
  
  // --------------------------------------------------
  // Export public static method + props.
  return $.tram = tram;

  // --------------------------------------------------
  // Private vars
  /*global $, P, easing */
  
  var doc = document
    , win = window
    , store = 'danro-tram-js'
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
      console.log(this.el);
    };
    
    proto.add = function (transition) {
      return this;
    };
    
    proto.start = function () {
      return this;
    };
    
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
  // Main wrapper - returns a Transition instance for a single element.
  function tram(el, fn) {
    // if an array is passed, only use the first element
    // TODO should console.warn about single elements?
    // or create a Tram wrapper for this?
    if (el.length) el = el[0];
    
    // check for existing instance in data
    var t = $.data(el, store) || $.data(el, store, Transition(el));
    
    // TODO deal with fn and varargs here.
    
    return t;
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
  // jQuery plugin method, returns jQuery object.
  
  $.fn.tram = function () {
    var args = arguments;
    return this.each(function () {
      // invoke tram for each element
      tram(this, args);
    });
  };
  
  // --------------------------------------------------
  // Export public method + static props.
  return $.tram = tram;

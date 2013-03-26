  // --------------------------------------------------
  // Private vars
  /*global P, easing */
  
  var doc = document
    , win = window
    , store = {}
    , testStyle = doc.createElement('a').style
    , domPrefixes = ['Webkit', 'Moz', 'O', 'ms']
    , cssPrefixes = ['-webkit-', '-moz-', '-o-', '-ms-']
  ;
  
  // --------------------------------------------------
  // Private functions
  
  // simple feature detect, returns both dom + css prefixed names
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
  
  // animation timer shim with setTimeout fallback
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
  
  // transform support
  var transform = testFeature('transform');
  var transition = testFeature('transition');
  
  console.log(transform);
  
  // timestamp shim with fallback
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
  
  // --------------------------------------------------
  // Transition class
  
  var Transition = P(function(proto) {
    proto.init = function() {
      
    };
  });
  
  // --------------------------------------------------
  // Property class + subclasses
  
  var Property = P(function (proto) {
    
  });
  
  var Opacity = P(Property, function (proto, supr) {
    
  });
  
  var Color = P(Property, function (proto, supr) {
    
  });
  
  // --------------------------------------------------
  // Main wrapper method - returns Transition instance
  function tram(el, fn) {
    
  }
  
  // --------------------------------------------------  
  return tram;

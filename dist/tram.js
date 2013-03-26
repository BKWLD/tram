/*!
  * tram.js v0.1.0-global
  * Cross-browser CSS3 transitions in JavaScript.
  * https://github.com/danro/tram
  * MIT License
  */
window.tram = (function () {

  /*!
   * P.js
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
  // Easing methods { id: [ css, fallback ] }
  
  var easing = {
    
    // --------------------------------------------------
    // CSS default easings, translated to functions using Timothee Groleau's generator:
    // http://www.timotheegroleau.com/Flash/experiments/easing_function_generator.htm
    
    'ease': ['ease', function (t, b, c, d) {
      var ts=(t/=d)*t;
      var tc=ts*t;
      return b+c*(-2.75*tc*ts + 11*ts*ts + -15.5*tc + 8*ts + 0.25*t);
    }],
    
    'ease-in': ['ease-in', function (t, b, c, d) {
      var ts=(t/=d)*t;
      var tc=ts*t;
      return b+c*(-1*tc*ts + 3*ts*ts + -3*tc + 2*ts);
    }],
    
    'ease-out': ['ease-out', function (t, b, c, d) {
      var ts=(t/=d)*t;
      var tc=ts*t;
      return b+c*(0.3*tc*ts + -1.6*ts*ts + 2.2*tc + -1.8*ts + 1.9*t);
    }],
    
    'ease-in-out': ['ease-in-out', function (t, b, c, d) {
      var ts=(t/=d)*t;
      var tc=ts*t;
      return b+c*(2*tc*ts + -5*ts*ts + 2*tc + 2*ts);
    }],
    
    // --------------------------------------------------
    // Robert Penner easing equations
    // http://www.robertpenner.com/easing_terms_of_use.html
    
    'ease-linear': ['linear', function (t, b, c, d) {
      return c*t/d + b;
    }],
    
    'ease-in-quad':      'cubic-bezier(0.550, 0.085, 0.680, 0.530)',
    'ease-in-cubic':     'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
    'ease-in-quart':     'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
    'ease-in-quint':     'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
    'ease-in-sine':      'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
    'ease-in-expo':      'cubic-bezier(0.950, 0.050, 0.795, 0.035)',
    'ease-in-circ':      'cubic-bezier(0.600, 0.040, 0.980, 0.335)',
    'ease-in-back':      'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
    'ease-out-quad':     'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
    'ease-out-cubic':    'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
    'ease-out-quart':    'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
    'ease-out-quint':    'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
    'ease-out-sine':     'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
    'ease-out-expo':     'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
    'ease-out-circ':     'cubic-bezier(0.075, 0.820, 0.165, 1.000)',
    'ease-out-back':     'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
    'ease-in-out-quad':  'cubic-bezier(0.455, 0.030, 0.515, 0.955)',
    'ease-in-out-cubic': 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
    'ease-in-out-quart': 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
    'ease-in-out-quint': 'cubic-bezier(0.860, 0.000, 0.070, 1.000)',
    'ease-in-out-sine':  'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
    'ease-in-out-expo':  'cubic-bezier(1.000, 0.000, 0.000, 1.000)',
    'ease-in-out-circ':  'cubic-bezier(0.785, 0.135, 0.150, 0.860)',
    'ease-in-out-back':  'cubic-bezier(0.680, -0.550, 0.265, 1.550)'
  };
  
  
  /*
  easeInQuad: function (t, b, c, d) {
    return c*(t/=d)*t + b;
  },
  easeOutQuad: function (t, b, c, d) {
    return -c *(t/=d)*(t-2) + b;
  },
  easeInOutQuad: function (t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t + b;
    return -c/2 * ((--t)*(t-2) - 1) + b;
  },
  easeInCubic: function (t, b, c, d) {
    return c*(t/=d)*t*t + b;
  },
  easeOutCubic: function (t, b, c, d) {
    return c*((t=t/d-1)*t*t + 1) + b;
  },
  easeInOutCubic: function (t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t + b;
    return c/2*((t-=2)*t*t + 2) + b;
  },
  easeInQuart: function (t, b, c, d) {
    return c*(t/=d)*t*t*t + b;
  },
  easeOutQuart: function (t, b, c, d) {
    return -c * ((t=t/d-1)*t*t*t - 1) + b;
  },
  easeInOutQuart: function (t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
    return -c/2 * ((t-=2)*t*t*t - 2) + b;
  },
  easeInQuint: function (t, b, c, d) {
    return c*(t/=d)*t*t*t*t + b;
  },
  easeOutQuint: function (t, b, c, d) {
    return c*((t=t/d-1)*t*t*t*t + 1) + b;
  },
  easeInOutQuint: function (t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
    return c/2*((t-=2)*t*t*t*t + 2) + b;
  },
  easeInSine: function (t, b, c, d) {
    return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
  },
  easeOutSine: function (t, b, c, d) {
    return c * Math.sin(t/d * (Math.PI/2)) + b;
  },
  easeInOutSine: function (t, b, c, d) {
    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
  },
  easeInExpo: function (t, b, c, d) {
    return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
  },
  easeOutExpo: function (t, b, c, d) {
    return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
  },
  easeInOutExpo: function (t, b, c, d) {
    if (t==0) return b;
    if (t==d) return b+c;
    if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
    return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
  },
  easeInCirc: function (t, b, c, d) {
    return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
  },
  easeOutCirc: function (t, b, c, d) {
    return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
  },
  easeInOutCirc: function (t, b, c, d) {
    if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
    return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
  },
  easeInBack: function (t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c*(t/=d)*t*((s+1)*t - s) + b;
  },
  easeOutBack: function (t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
  },
  easeInOutBack: function (t, b, c, d, s) {
    if (s == undefined) s = 1.70158; 
    if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
    return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
  }
  */

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

}());

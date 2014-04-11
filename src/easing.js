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

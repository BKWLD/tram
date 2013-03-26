  // --------------------------------------------------
  /*
   *
   * TERMS OF USE - EASING EQUATIONS
   * 
   * Open source under the BSD License. 
   * 
   * Copyright © 2001 Robert Penner
   * All rights reserved.
   * 
   * Redistribution and use in source and binary forms, with or without modification, 
   * are permitted provided that the following conditions are met:
   * 
   * Redistributions of source code must retain the above copyright notice, this list of 
   * conditions and the following disclaimer.
   * Redistributions in binary form must reproduce the above copyright notice, this list 
   * of conditions and the following disclaimer in the documentation and/or other materials 
   * provided with the distribution.
   * 
   * Neither the name of the author nor the names of contributors may be used to endorse 
   * or promote products derived from this software without specific prior written permission.
   * 
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
   * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
   *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
   *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
   * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
   * OF THE POSSIBILITY OF SUCH DAMAGE. 
   *
   */
  var easing = {
    
    // --------------------------------------------------
    // CSS3 default easings, translated to functions using Timothee Groleau's generator.
    // http://www.timotheegroleau.com/Flash/experiments/easing_function_generator.htm
    
    'ease': ['ease', function(t, b, c, d) {
      var ts=(t/=d)*t;
      var tc=ts*t;
      return b+c*(-2.75*tc*ts + 11*ts*ts + -15.5*tc + 8*ts + 0.25*t);
    }],
    
    'ease-in': ['ease-in', function(t, b, c, d) {
      
    }],
    
    'ease-out': ['ease-out', function(t, b, c, d) {
      
    }],
    
    'ease-in-out': ['ease-in-out', function(t, b, c, d) {
      
    }],
    
    // --------------------------------------------------
    // Robert Penner equations
    
    'ease-linear':       'cubic-bezier(0.250, 0.250, 0.750, 0.750)',
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

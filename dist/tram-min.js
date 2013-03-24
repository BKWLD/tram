/*!
  * tram.js v0.1.0
  * Cross-browser CSS3 transitions in JavaScript.
  * https://github.com/danro/tram
  * MIT License
  */
var P=function(n,t,r){function i(n){return"object"==typeof n}function o(n){return"function"==typeof n}function u(){}function e(c,f){function a(){var n=new p;return o(n.init)&&n.init.apply(n,arguments),n}function p(){}f===r&&(f=c,c=Object),a.Bare=p;var l,y=u[n]=c[n],v=p[n]=a[n]=new u;return v.constructor=a,a.mixin=function(t){return p[n]=a[n]=e(a,t)[n],a},(a.open=function(n){if(l={},o(n)?l=n.call(a,v,y,a,c):i(n)&&(l=n),i(l))for(var r in l)t.call(l,r)&&(v[r]=l[r]);return o(v.init)||(v.init=c),a})(f)}return e}("prototype",{}.hasOwnProperty),tram=function(){function n(){}return n}();
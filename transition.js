/*
--------------------------------------------------
transition.js v0.1.0
Cross-browser CSS3 transitions in JavaScript.
https://github.com/danro/transition
@license MIT license
http://danro.mit-license.org/
--------------------------------------------------
*/

(function (name, context, definition) {
  /*global define module*/
  if (typeof module != 'undefined' && module.exports) module.exports = definition();
  else if (typeof define == 'function' && define.amd) define(definition);
  else context[name] = definition();
})('transition', this, function () {
  
});

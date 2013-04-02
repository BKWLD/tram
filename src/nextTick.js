  /*!
   * Breeze - process.nextTick browser shim
   * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */

  /**
   * ### .nextTick (fn)
   *
   * Cross-compatible `nextTick` implementation. Uses
   * `process.nextTick` for node and `setTimeout(fn, 0)`
   * for the browser.
   *
   * @param {Function} callback
   * @name nextTick
   * @api public
   */

  var nextTick = ('undefined' === typeof process || !process.nextTick) ?
      browserNextTick() : process.nextTick;

  /*!
   * Prepares a cross-browser capable nextTick implementation
   * using either `postMessage` or `setTimeout(0)`.
   *
   * @attr http://dbaron.org/log/20100309-faster-timeouts
   * @api private
   */

  function browserNextTick () {
    if (!window || !window.postMessage || window.ActiveXObject) {
      return function (fn) {
        setTimeout(fn, 0);
      };
    }

    var timeouts = []
      , name = 'breeze-zero-timeout';

    window.addEventListener('message', function (e) {
      if (e.source === window && e.data === name) {
        if (e.stopPropagation) e.stopPropagation();
        if (timeouts.length) timeouts.shift()();
      }
    });

    return function (fn) {
      timeouts.push(fn);
      window.postMessage(name, '*');
    };
  }

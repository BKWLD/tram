(function () {
  /*global $, tram, sink, start*/
  var $test = $('#test');
  var _tram = tram($test);
  var transition = tram.support.transition;

  // --------------------------------------------------
  sink('Timing', function(test, ok, before, after) {

    test('Transition should take roughly 300ms', 1, function () {
      var start = tram.now();
      _tram
        .add('opacity 300ms ease 0')
        .start({ opacity: 1 })
        .then(function () {
          var diff = tram.now() - start;
          ok(diff < 330, 'Elapsed: ' + diff + 'ms');
        });
    });

    test('Fallback should take roughly 300ms', 1, function () {
      var start = tram.now();
      _tram
        .add('opacity 300ms ease 0', { fallback: true })
        .start({ opacity: 1 })
        .then(function () {
          var diff = tram.now() - start;
          ok(diff < 330, 'Elapsed: ' + diff + 'ms');
        });
    });

    test('300ms transition with 100ms delay', 1, function () {
      var start = tram.now();
      _tram
        .add('opacity 300ms ease 100ms')
        .start({ opacity: 1 })
        .then(function () {
          var diff = tram.now() - start;
          ok(diff < 430, 'Elapsed: ' + diff + 'ms');
        });
    });

    after(function () {
      _tram.add('opacity 0 ease 0');
    });

  });

  // --------------------------------------------------
  sink('Performance', function(test, ok, before, after) {

    test('Tweens should clear context when finished', 1, function () {
      var tween = tram.tween({
        from: 0,
        to: 1,
        duration: 100,
        complete: function () {
          setTimeout(function () {
            ok(tween.context == null, 'Tween context is null');
          }, 1);
        }
      });
    });

  });

  // --------------------------------------------------
  sink('Methods', function(test, ok, before, after) {

    before(function () {
      _tram.show().redraw();
    });

    test('set() should set value immediately', 1, function () {
      _tram.set({ opacity: 0.5 });
      ok(+$test.css('opacity') === 0.5, '');
    });

    test('then(string) should change transition settings', 1, function () {
      _tram
        .add('opacity 200ms')
        .set({ opacity: 0 })
        .start({ opacity: 1 })
        .then('opacity 0ms')
        .then(function () {
          ok(this.props.opacity.duration === 0, '');
        });
    });

    test('then(\'hide\') should hide after transition', 1, function () {
      _tram
        .add('opacity 200ms')
        .set({ opacity: 0 })
        .start({ opacity: 1 })
        .then(result)
        .then('hide');

      function result() {
        this.next();
        setTimeout(function () {
          ok($test.css('display') === 'none', '');
        }, 0);
      }
    });

    test('then(\'stop\') should remove the transition', 1, function () {
      // No transition support
      if (!transition) return ok(true, '');

      _tram
        .add('opacity 200ms')
        .set({ opacity: 0 })
        .start({ opacity: 1 })
        .then(result)
        .then('stop');

      function result() {
        var el = this.el;
        this.next();
        setTimeout(function () {
          ok(!el.style[transition.dom], '');
        }, 0);
      }
    });

    test('destroy() should remove element data and references', 1, function() {
      var victim = $('#victim')[0];
      var _victim = tram(victim).start({ opacity: 1 }).destroy();

      var empty = true;
      for (var key in $.data(victim)) { empty = false; }
      var reset = _victim.$el == null && _victim.el == null;

      ok(empty && reset, '');
    });

  });

  // --------------------------------------------------
  sink('Display: none', function(test, ok, before, after) {
    before(function () {
      // Reset to zero / none
      $test.css({ opacity: 0, display: 'none' });
    });

    test('set().redraw() should update display value before transition', 1, function () {
      setTimeout(function () {
        _tram.set({ display: 'block' }).redraw()
          .add('opacity 300ms ease 100ms')
          .start({ opacity: 1 });

        setTimeout(function () {
          ok(+$test.css('opacity') < 1, '');
        }, 20);
      }, 0);
    });

  });

  // --------------------------------------------------
  sink('Error Handling', function(test, ok, before, after) {

    test('Invalid selectors should fail silently', 1, function () {
      try {
        tram($('#undefined')).set({ x: 0 });
        tram('#undefined').set({ x: 0 });
        tram('#undefined').then({ x: 0 });
        ok(true, '');
      } catch (e) {
        ok(false, e);
      }
    });

    // TODO catch tram's warnings.

  });

  // --------------------------------------------------
  start();
}());

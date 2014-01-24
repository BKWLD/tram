(function () {
  /*global $, tram, sink, start*/
  var $test = $('#test');
  
  // --------------------------------------------------
  sink('Timing', function(test, ok, before, after) {

    test('Transition should take roughly 300ms', 1, function () {
      var start = tram.now();
      tram($test)
        .add('opacity 300ms ease 0')
        .start({ opacity: 1 })
        .then(function () {
          var diff = tram.now() - start;
          ok(diff < 330, 'Elapsed: ' + diff + 'ms');
        });
    });
    
    test('Fallback should take roughly 300ms', 1, function () {
      var start = tram.now();
      tram($test)
        .add('opacity 300ms ease 0', { fallback: true })
        .start({ opacity: 1 })
        .then(function () {
          var diff = tram.now() - start;
          ok(diff < 330, 'Elapsed: ' + diff + 'ms');
        });
    });
    
    test('300ms transition with 100ms delay', 1, function () {
      var start = tram.now();
      tram($test)
        .add('opacity 300ms ease 100ms')
        .start({ opacity: 1 })
        .then(function () {
          var diff = tram.now() - start;
          ok(diff < 430, 'Elapsed: ' + diff + 'ms');
        });
    });
    
  });

  // --------------------------------------------------
  sink('Properties', function(test, ok, before, after) {
    
    test('set() should set value immediately', 1, function () {
      tram($test).set({ opacity: 0.5 });
      ok(+$test.css('opacity') === 0.5, '');
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
        tram($test).set({ display: 'block' }).redraw()
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

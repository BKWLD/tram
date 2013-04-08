(function () {
  /*global tram, sink, start*/
  
  // --------------------------------------------------
  sink('Duration', function(test, ok, before, after) {

    test('async test 1', 1, function () {
      window.setTimeout(function () {
        ok(true, 'yep');
      }, 10);
    });
    
  });
  
  // --------------------------------------------------
  sink('TODO', function(test, ok, before, after) {

    test('test', 1, function () {
      ok(true, 'yep');
    });
    
  });
  
  // --------------------------------------------------
  sink('TODO', function(test, ok, before, after) {

    test('test', 1, function () {
      ok(true, 'yep');
    });
    
  });
  
  // --------------------------------------------------
  start();
}());

// chat gippity

import { setTimeout, setInterval, setImmediate, clearTimeout, clearInterval, clearImmediate } from './index';

(function() {
  var testCounter = 0;

  const TIME_MARGIN = 1_000;

  function nextId() {
    return ++testCounter;
  }

  function expect(id, desc) {
    console.log("EXPECTED: [" + id + "] - " + desc);
  }

  function actual(id, desc) {
    console.log("ACTUAL:   [" + id + "] - " + desc);
  }

  // --- Test 1: setTimeout basic ---
  (function() {
    var id = nextId();
    expect(id, "setTimeout should call callback after delay");
    setTimeout(function() {
      actual(id, "setTimeout callback ran");
    }, TIME_MARGIN);
  })();

  // --- Test 2: clearTimeout prevents callback ---
  (function() {
    var id = nextId();
    expect(id, "clearTimeout should cancel the callback");
    var handle = setTimeout(function() {
      actual(id, "SHOULD NOT RUN");
    }, TIME_MARGIN);
    clearTimeout(handle);
  })();

  // --- Test 3: setTimeout arguments ---
  (function() {
    var id = nextId();
    expect(id, "setTimeout should receive args 'hello', 123");
    setTimeout(function(a, b) {
      actual(id, "Received: " + a + ", " + b);
    }, TIME_MARGIN, "hello", 123);
  })();

  // --- Test 4: setInterval fires repeatedly ---
  (function() {
    var id = nextId();
    expect(id, "setInterval should run 3 times before cancel");
    var count = 0;
    var handle = setInterval(function() {
      actual(id, "Interval fired " + (++count));
      if (count === 3) clearInterval(handle);
    }, TIME_MARGIN);
  })();

  // --- Test 5: clearInterval stops execution ---
  (function() {
    var id = nextId();
    expect(id, "clearInterval should prevent interval from firing");
    var handle = setInterval(function() {
      actual(id, "SHOULD NOT RUN");
    }, TIME_MARGIN);
    clearInterval(handle);
  })();

  // --- Test 6: setInterval with arguments ---
  (function() {
    var id = nextId();
    expect(id, "setInterval should receive args 'foo', 'bar'");
    var handle = setInterval(function(a, b) {
      actual(id, "Interval args: " + a + ", " + b);
      clearInterval(handle);
    }, TIME_MARGIN, "foo", "bar");
  })();

  // --- Test 7: setImmediate basic ---
  (function() {
    var id = nextId();
    expect(id, "setImmediate should run after current execution frame");
    setImmediate(function() {
      actual(id, "Immediate callback ran");
    });
  })();

  // --- Test 8: clearImmediate prevents execution ---
  (function() {
    var id = nextId();
    expect(id, "clearImmediate should cancel the immediate callback");
    var handle = setImmediate(function() {
      actual(id, "SHOULD NOT RUN");
    });
    clearImmediate(handle);
  })();

  // --- Test 9: setImmediate with arguments ---
  (function() {
    var id = nextId();
    expect(id, "setImmediate should receive args 99, 'baz'");
    setImmediate(function(x, y) {
      actual(id, "Received: " + x + ", " + y);
    }, 99, "baz");
  })();

  // --- Test 10: Immediate runs before timeout ---
  (function() {
    var id1 = nextId();
    var id2 = nextId();
    expect(id1, "setImmediate should run before setTimeout with 0ms");
    expect(id2, "setTimeout should run after setImmediate");

    setImmediate(function() {
      actual(id1, "Immediate callback");
    });

    setTimeout(function() {
      actual(id2, "Timeout callback");
    }, 0);
  })();

  // --- Test 11: Nested setTimeouts ---
  (function() {
    var id1 = nextId();
    var id2 = nextId();
    expect(id1, "First setTimeout should run");
    expect(id2, "Nested setTimeout should run after first");

    setTimeout(function() {
      actual(id1, "First timeout");
      setTimeout(function() {
        actual(id2, "Second timeout (nested)");
      }, TIME_MARGIN);
    }, TIME_MARGIN);
  })();

  // --- Test 12: Immediate scheduled from within another immediate ---
  (function() {
    var id1 = nextId();
    var id2 = nextId();
    expect(id1, "First immediate should run");
    expect(id2, "Second immediate (nested) should run after first");

    setImmediate(function() {
      actual(id1, "First immediate");
      setImmediate(function() {
        actual(id2, "Second immediate");
      });
    });
  })();

  console.log("All test expectations printed. Watch for ACTUAL logs.");
})();

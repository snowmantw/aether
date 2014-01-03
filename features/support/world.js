(function() {
  var mPath = require('path');
  var World = function World(cb) {
    // Set the 'this' as test context.
    cb();
  };
  exports.World = World;
})();

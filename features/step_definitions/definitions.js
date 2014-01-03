(function() {
  var definitionsWrapper = function() {
    this.World = require('../support/world.js').World;
    this.Given('Aether arguments `$args`', function(args, cb) {
      this.aether.cli.args(args);
      cb();
    });
    this.When('I execute Aether with it', function(cb) {
      // Can't do this:
      //
      //    this.aether.cli.execute().done(cb)
      //
      // or it would never success.
      // Because the 'this' would be replaced (a guess).
      // And the `cb` is not well bounded.
      this.aether.cli.execute().done((function() {
        cb();
      }).bind(this));
    });
    this.Then('I should see "$output"', function(output, cb) {
      if (-1 === this.aether.states.outputs.indexOf(output)) {
        cb.fail(new Error('Expected to see ' + output));
      } else {
        cb();
      }
    });
    this.Then('I should see outputs include \'$regexp\'', function(regexp, cb) {
      if (null === this.aether.states.outputs.join('\n')
                  .match(new RegExp(regexp))
         )
      {
        cb.fail(new Error('Expected to match ' + regexp));
      } else {
        cb();
      }
    });
  };
  module.exports = definitionsWrapper;
})();

/**
 * Utilities functions for Aether.
 */
(function() {
  var _path = require('path');

  /**
   * Overwrite settings recursively.
   *
   * @param {object} options  - New options.
   * @param {object} config   - The existing configure .
   * @return {object} - The overwritten config.
   */
  exports.overwriteSettings = function(options, config) {
    var iterate = function _iterate(opts, settings) {
      for (var property in opts) {
        if (opts.hasOwnProperty(property)) {
          if ('object' === typeof opts[property]) {
            if (!settings[property])
              settings[property] = {};
            iterate(opts[property], settings[property]);
          }
          else {
            settings[property] = opts[property];
          }
        }
      }
    };

    iterate(options, config);
    return config;
  };

  /**
   * Resolver with '~' ability.
   *
   * @param {string} path
   * @return {string}
   */
  exports.resolvePath = function(path) {
    if (path.substr(0,1) === '~')
      path = process.env.HOME + path.substr(1);
    return _path.resolve(path);
  };
})();

(function() {

  var _ = require('underscore'),
      _q = require('q'),
      _fs = require('fs'),
      _path = require('path'),
      _wrench = require('wrench'),
      _utils = require( __dirname + '/utils.js');

  var Aether = function(opts) {
    return new Aether.o(opts);
  };

  Aether.o = function(opts) {

    // Make a Promise process contains every step of
    // building.
    this.stages = _q({});
    this.states = {
      config: {
        valid: false
      },
      help: '',
      verbose: false,
      outputs: []
    };

    this.config = {
      current: '',  // Current template
      path: {
        presets: _utils.resolvePath('~/.aether/presets')
      },
      presets: {
        availables: []
      },
      modules: []
    };
    if (opts)
      this.config = _utils.overwriteSettings(opts, this.config);
    this.config.presets.availables = this._listAvailable();

    this.cli = {
      args: this._args.bind(this),
      execute: this._execute.bind(this)
    };
  };

  /**
   * Give stringified arguments to parse to options.
   * For example: "-c vanilla --modules [calendar, video]"
   *
   * @param {string} args - The arguments.
   * @this {Aether}
   */
  Aether.o.prototype._args = function(args) {
    var _arg = require('arg');
    // Dispatch to each handlers to set the settings.
    this._argsDispatch(_arg.parse(args));
  };

  /**
   * Begin the building process.
   *
   * @this {Aether}
   */
  Aether.o.prototype._execute = function() {
    this.stages.then((function(){
      this.stages = _q({});
    }).bind(this));
    if ('' !== this.states.help) {
      this._dispatchHelp(this.states.help);
      return this.stages;
    }
    if (this.states.verbose)
      this._verboseConfig();
    if ('' !== this.config.current) {
      var preset = this._loadPreset(this.config.current);
      this.config = _utils.overwriteSettings(this.config, preset);
    }
    return this.stages;
  };

  // Following steps would call corresponding modules to do the building work.
  // They would return Promise which would be also concated to the stages
  // to be executed.

  /**
   * Generate default preferences for Firefox OS, the values might be
   * changed with different environment variables like DEBUG=1.
   */
  Aether.o.prototype._preference = function() {
    var pr = _q((function() {
      if (this.states.verbose)
        this.outputs.push('preference');
    }).bind(this));
    this.stages.then(pr);
    return pr;
  };

  /**
   * Load customization configuration from GAIA_DISTRIBUTION_DIR/variant.json
   * for making difference app sets, wallpapers and ringtones per
   * carriers/region
   */
  Aether.o.prototype._variant = function() {
    var pr = _q((function() {
      if (this.states.verbose)
        this.outputs.push('variant');
    }).bind(this));
    this.stages.then(pr);
    return pr;
  };

  /**
   * Generate default data for apps such as grid layout for homescreen and
   * search engine for Browser.
   */
  Aether.o.prototype._applicationsData = function() {
    var pr = _q((function() {
      if (this.states.verbose)
        this.outputs.push('applications-data');
    }).bind(this));
    this.stages.then(pr);
    return pr;
  };

  /**
   * Fetch and set up the Gaia modules specified in the configuration.
   */
  Aether.o.prototype._setupModules = function() {
    var pr = _q((function() {
      if (this.states.verbose)
        this.outputs.push('setup-modules');
    }).bind(this));
    this.stages.then(pr);
    return pr;
  };

  /**
   * Setup test-agent includes two make rules "test-agent-config" &
   * "test-agent-bootstrap-apps" which is used to setup test environment
   * for each app.
   */
  Aether.o.prototype._setupTestAgent = function() {
    var pr = _q((function() {
      if (this.states.verbose)
        this.outputs.push('setup-test-agent');
    }).bind(this));
    this.stages.then(pr);
    return pr;
  };

  /**
   * Minify javascript, concat localization resource files to json files
   * and generate html file for default language if necessary.
   */
  Aether.o.prototype._webappOptimize = function() {
    var pr = _q((function() {
      if (this.states.verbose)
        this.outputs.push('webapp-optimize');
    }).bind(this));
    this.stages.then(pr);
    return pr;
  };

  /**
   * Compress to a zip file for each app and put them into profile directory.
   */
  Aether.o.prototype._webappZip = function() {
    var pr = _q((function() {
      if (this.states.verbose)
        this.outputs.push('webapp-zip');
    }).bind(this));
    this.stages.then(pr);
    return pr;
  };

  /**
   * Clean html files for default language.
   */
  Aether.o.prototype._optimizeClean = function() {
    var pr = _q((function() {
      if (this.states.verbose)
        this.outputs.push('optimize-clean');
    }).bind(this));
    this.stages.then(pr);
    return pr;
  };

  /**
   * Copy preload contact file to profile if exists in GAIA_DISTRIBUTION_DIR.
   */
  Aether.o.prototype._importContacts = function() {
    var pr = _q((function() {
      if (this.states.verbose)
        this.outputs.push('import-contacts');
    }).bind(this));
    this.stages.then(pr);
    return pr;
  };

  /**
   * Copy extensions in GAIA_DIR/tools/extensions to profile directory,
   * setup different configuration would copy different extensions.
   */
  Aether.o.prototype._importExtensions = function() {
    var pr = _q((function() {
      if (this.states.verbose)
        this.outputs.push('imprt-extensions');
    }).bind(this));
    this.stages.then(pr);
    return pr;
  };

  /**
   * Generate default settings for gaia
   */
  Aether.o.prototype._settings = function() {
    var pr = _q((function() {
      if (this.states.verbose)
        this.outputs.push('settings');
    }).bind(this));
    this.stages.then(pr);
    return pr;
  };

  /**
   * Copy default data to profile directory
   */
  Aether.o.prototype._createDefaultData = function() {
    var pr = _q((function() {
      if (this.states.verbose)
        this.outputs.push('create-default-data');
    }).bind(this));
    this.stages.then(pr);
    return pr;
  };

  /**
   * Download certain extensions to profile directory
   */
  Aether.o.prototype._additionalExtensions = function() {
    var pr = _q((function() {
      if (this.states.verbose)
        this.outputs.push('additional-extensions');
    }).bind(this));
    this.stages.then(pr);
    return pr;
  };

  Aether.o.prototype._verboseConfig = function() {
    this.states.outputs.push(JSON.stringify(this.config));
  };

  Aether.o.prototype._dispatchHelp = function(subject) {
    switch(subject) {
      case 'presets':
        this._doHelpPresets();
        break;
    }
  };

  Aether.o.prototype._doHelpPresets = function() {
    this.states.outputs = this.config.presets.availables;
  };

  Aether.o.prototype._listAvailable = function() {
    var ls = _wrench.readdirSyncRecursive(
        _utils.resolvePath(this.config.path.presets));

    var names =  _.filter(ls, function(name) {
      return '.json' === _path.extname(name);
    });

    return _.map(names, function(name) {
      return name.substr(0, name.lastIndexOf('.'));
    });
  };

  Aether.o.prototype._argsDispatch = function(parsedArgs) {
    for( var name in parsedArgs ) {
      var value = parsedArgs[name];
      switch(name) {
        case 'c':
        case 'config':
          this._setConfig(value);
          break;
        case 'm':
        case 'module':
          this._setModules(value);
          break;
        case 'help':
          this._setHelp(value);
          break;
        case 'v':
        case 'verbose':
          this._setVerbose();
          break;
      }
    }
  };

  Aether.o.prototype._loadPreset = function(path) {
    var doc  = JSON.parse(_fs.readFileSync(path, 'utf8'));
    return doc;
  };

  Aether.o.prototype._setConfig = function(str) {
    if(-1 !== this.config.presets.availables.indexOf(str)) {
      var path = this.config.path.presets + '/' + str + '.json';
      this.config.current = path;
    } else {
      throw "No such preset: " + str;
    }
  };

  Aether.o.prototype._setModules = function(strs) {
    // 'strs': ["moduleA", "moduleB"]
    // Use JSON.parse instead of eval.
    var modules = JSON.parse('{"data":' + strs + '}').data;
    this.config.modules = modules;
  };

  Aether.o.prototype._setHelp = function(str) {
    this.states.help = str;
  };

  Aether.o.prototype._setVerbose = function() {
    this.states.verbose = true;
  };

  module.exports = Aether;
})();

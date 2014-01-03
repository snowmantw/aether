var Hooks = function () {
  this.Before(function(callback) {
    // Set the 'this' as test context.
    var proxyquire = require('proxyquire')
      , fe = require('fe.js')
      , fsStub = fe.fs
      , wrenchStub = proxyquire('wrench', {'fs': fsStub})
      , Aether = proxyquire( __dirname + '/../../libs/aether.js',
        {'fs': fsStub, 'wrench': wrenchStub})
      , homepath = process.env.HOME + '/.aether'
      , presetsPath = homepath + '/presets';

    wrenchStub.mkdirSyncRecursive(presetsPath);
    var presets  = fe.instance().directories[presetsPath]
      , fulljson = fe.instance().file(presets, 'full.json', {})
      , caldir = fe.instance().directory(presetsPath + '/calendar')
      , builtin = fe.instance().directory(presetsPath + '/built-in')
      , vanilla = fe.instance().file(caldir, 'vanilla.json', {},
                  function(oc, c, m) {
                    return JSON.stringify(oc);
                  })
      , medapps = fe.instance().file(builtin, 'media-apps.json', {});
    this.fe = fe;
    this.aether = Aether();
    callback();
  });

  this.After(function(callback) {
    this.fe.instance().destroy();
    callback();
  });
};

module.exports = Hooks;

var CoreObject  = require('core-object');
var Promise     = require('ember-cli/lib/ext/promise');
var all         = require('rsvp').all;

var TYPES = {
  'file-hash':      require('./file-hash'),
  'git-tag-commit': require('./git-tag-commit'),
  'git-commit':     require('./git-commit'),
  'version-commit': require('./version-commit')
};

module.exports = CoreObject.extend({
  init: function(options) {
    var types = options.plugin.readConfig('combo');
    this._generators = types.map(function(type) {
      return new TYPES[type](options);
    });
  },

  generate: function() {
    return all(this._generators.map(function(generator) {
      return generator.generate();
    })).then(function(results) {
      var revisionKey = results.map(function(v) {
        return v.revisionKey;
      }).join('-');
      return {
        revisionKey: revisionKey,
        timeStamp: new Date().toISOString()
      }
    });
  }
});

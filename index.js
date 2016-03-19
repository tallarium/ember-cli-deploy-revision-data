/* jshint node: true */
'use strict';

var Promise = require('ember-cli/lib/ext/promise');

var DeployPluginBase = require('ember-cli-deploy-plugin');

module.exports = {
  name: 'ember-cli-deploy-revision-data',

  createDeployPlugin: function(options) {
    var DeployPlugin = DeployPluginBase.extend({
      name: options.name,
      defaultConfig: {
        type: 'file-hash',
        filePattern: 'index.html',
        scm: 'git',
        distDir: function(context) {
          return context.distDir;
        },
        distFiles: function(context) {
          return context.distFiles;
        },
        versionFile: 'package.json',
      },

      prepare: function(/*context*/) {
        var self = this;

        var promises = {
            data: this._getData(),
            scm: this._getScmData()
        };

        return Promise.hash(promises)
          .then(function(results) {
            var data = results.data;
            data.scm = results.scm;
            self.log('generated revision data for revision: `' + data.revisionKey + '`', { verbose: true });
            return data;
          })
          .then(function(data) {
            return { revisionData: data };
          })
          .catch(this._errorMessage.bind(this));
      },

      _getData: function() {
        var type = this.readConfig('type');
        this.log('creating revision data using `' + type + '`', { verbose: true });
        var DataGenerator = require('./lib/data-generators')[type];
        return new DataGenerator({
          plugin: this
        }).generate();
      },

      _getScmData: function() {
        var scm = this.readConfig('scm');
        if (scm) {
          var ScmDataGenerator = require('./lib/scm-data-generators')[scm];
          return new ScmDataGenerator({
            plugin: this
          }).generate();
        } else {
          return Promise.resolve();
        }
      },

      _errorMessage: function(error) {
        this.log(error, { color: 'red' });
        return Promise.reject(error);
      }
    });
    return new DeployPlugin();
  }
};

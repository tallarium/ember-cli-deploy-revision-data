'use strict';

var assert = require('ember-cli/tests/helpers/assert');
var gitRepoInfo = require('git-repo-info');

describe('the version-commit-file-hash data generator', function() {
  var DataGenerator;
  var cwd;

  before(function() {
    DataGenerator = require('../../../../lib/data-generators/combo');
    gitRepoInfo._changeGitDir('dotgit');
  });

  beforeEach(function() {
    cwd = process.cwd();
  });

  afterEach(function() {
    process.chdir(cwd);
  });

  describe('#generate', function() {
    it('concatenates version-commit and file-hash', function() {
      process.chdir('tests/fixtures/repo');

      var plugin = {
        stubConfig: {
          combo: ['version-commit', 'file-hash'],
          distDir: '.',
          distFiles: ['index.html'],
          filePattern: 'index.html',
          versionFile: 'package.json'
        },
        readConfig: function(key) { return this.stubConfig[key]; }
      };

      var subject = new DataGenerator({
        plugin: plugin
      });

      return assert.isFulfilled(subject.generate())
        .then(function(data) {
          assert.equal(data.revisionKey, '3.2.1+41d41f08-ae1569f72495012cd5e8588e0f2f5d49');
        });
    });

    it('concatenates file-hash and git-tag-commit and version-commit', function() {
      process.chdir('tests/fixtures/repo');

      var plugin = {
        stubConfig: {
          combo: ['file-hash', 'git-tag-commit', 'version-commit'],
          distDir: '.',
          distFiles: ['index.html'],
          filePattern: 'index.html',
          versionFile: 'package.json'
        },
        readConfig: function(key) { return this.stubConfig[key]; }
      };

      var subject = new DataGenerator({
        plugin: plugin
      });

      return assert.isFulfilled(subject.generate())
        .then(function(data) {
          assert.equal(data.revisionKey, 'ae1569f72495012cd5e8588e0f2f5d49-2.3.4+41d41f08-3.2.1+41d41f08');
        });
    });    
  });
});

'use strict';

var assert = require('ember-cli/tests/helpers/assert');
var gitRepoInfo = require('git-repo-info');

describe('the git scm data generator', function() {
  var ScmDataGenerator;
  var cwd;

  before(function() {
    ScmDataGenerator = require('../../../../lib/scm-data-generators/git');
    gitRepoInfo._changeGitDir('dotgit');
  });

  beforeEach(function() {
    cwd = process.cwd();
  });

  afterEach(function() {
    process.chdir(cwd);
  });

  describe('#generate', function() {
    it('returns the correct data', function() {
      process.chdir('tests/fixtures/repo');

      var subject = new ScmDataGenerator('dotgit');

      return assert.isFulfilled(subject.generate())
        .then(function(data) {
          assert.equal(data.sha, '41d41f081b45ad50935c08b1203220737d9739b4');
          assert.equal(data.email, 'alisdair@mcdiarmid.org');
          assert.equal(data.name, 'Alisdair McDiarmid');
          assert.isNotNull(data.timestamp);
          assert.equal(data.branch, 'master');
        });
    });
  });
});

var Promise = require('bluebird');

var Model = function(name, attributes, options) {
  this.options = options || {};
};

Model.prototype.findAll = function(options, queryOptions) {
  return Promise.bind(this).then(function() {
    // conformOptions

    if (options.hooks) {
      return this.runHooks('beforeFind', {
        options: options
      });
    }
  }).then(function(context) {
    if (context._skip)
      return Promise.resolve(context);

    // expandIncludeAll.call(this, options);

    if (options.hooks) {
      return this.runHooks('beforeFindAfterExpandIncludeAll', {
        options: options
      });
    }
  }).then(function(context) {
    if (context._skip)
      return Promise.resolve(context);

    // do a bunch of options setup...

    if (options.hooks) {
      return this.runHooks('beforeFindAfterOptions', {
        options: options
      });
    }
  }).then(function(context) {
    if (context._skip)
      return Promise.resolve(context.instances || []);

    return [{ id: 1, username: 'testUser', email: 'user@test.com' }];
  }).tap(function(results) {
    if (options.hooks) {
      return this.runHooks('afterFind', {
        instances: results,
        options: options
      }).then(function(context) {
        return context.instances;
      });
    }
  });
};

module.exports = Model;


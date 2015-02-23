var Promise = require('bluebird'),
    _ = require('lodash');

var hooks = {
  beforeValidate: {params: 2},
  afterValidate: {params: 2},
  beforeCreate: {params: 2},
  afterCreate: {params: 2},
  beforeDestroy: {params: 2},
  afterDestroy: {params: 2},
  beforeUpdate: {params: 2},
  afterUpdate: {params: 2},
  beforeBulkCreate: {params: 2},
  afterBulkCreate: {params: 2},
  beforeBulkDestroy: {params: 1},
  afterBulkDestroy: {params: 1},
  beforeBulkUpdate: {params: 1},
  afterBulkUpdate: {params: 1},
  beforeFind: {params: 1},
  beforeFindAfterExpandIncludeAll: {params: 1},
  beforeFindAfterOptions: {params: 1},
  afterFind: {params: 2},
  beforeDefine: {params: 2, sync: true},
  afterDefine: {params: 1, sync: true},
  beforeInit: {params: 2, sync: true},
  afterInit: {params: 1, sync: true}
};

var Hooks = function() {
};

Hooks.prototype.applyTo = function(Model) {
  _.extend(Model.prototype, Hooks.prototype);
};

Hooks.prototype.addHook = function(name, callback) {
  if (Object.keys(hooks).indexOf(name) === -1) {
    console.log("invalid hook");
    return;
  }

  if (!_.has(this, name)) {
    this[name] = [];
  }

  this[name].push(callback);
};

Hooks.prototype.runHooks = function(hook, ctx) {
  var self = this,
      skipNext = false,
      context = _.extend({
        skip: function() { skipNext = true; }
      }, ctx);

  if (!_.has(this, hook))
    return Promise.resolve(context);

  var hamSandwich = {};
  var work = Array.isArray(this[hook])? this[hook] : [ this[hook] ];
  return work.reduce(function(lhs, rhs) {
    return lhs.then(function() {
      if (skipNext) {
        return;
      }

      rhs(context);
    });
  }, Promise.resolve()).then(function() {
    context._skip = skipNext;
    return context;
  });
};

module.exports = {
  applyTo: function(Model) {
    _.extend(Model.prototype, Hooks.prototype);
    Object.keys(hooks).forEach(function(hook) {
      Model.prototype[hook] = function(callback) {
        return this.addHook(hook, callback);
      };
    });
  }
};

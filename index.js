var Promise = require('bluebird'),
    Hooks = require('./hooks'),
    Model = require('./model'),
    _ = require('lodash');

// mixin
Hooks.applyTo(Model);

var model = new Model('testModel', {}, { hooks: true });

model.beforeFind(function(context) {
  console.log('beforeFind #1');
  context.instances = [ { boobs: "are cool" }];
});

model.addHook('beforeFind', function(context) {
  console.log('beforeFind #2');
  context.skip();
});

model.addHook('beforeFind', function(context) {
  console.log('beforeFind #3');
});

model.addHook('beforeFind', function(context) {
  console.log('beforeFind #4');
});

model.addHook('beforeFind', function(context) {
  console.log('beforeFind #5');
});

model.afterFind(function(context) {
  console.log('afterFind #1');
});

model.findAll({
  hooks: true,
  where: {
    id: 1
  }
}).then(function(results) {
  console.log(results);
});

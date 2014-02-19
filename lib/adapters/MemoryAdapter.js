var datastore = require('../datastore');

var MemoryAdapter = function () {

  return {
    findOne: function (collectionName, opts, cb) {
      opts.limit = 1;
      this.find(collectionName, opts, function (err, results) {
        if (err) return cb(err);
        if (results.length < 1) return cb(err);
        cb(null, results[0]);
      });
    },
    find: function (collectionName, opts, cb) {
      datastore[collectionName].find(opts, cb);
    },
    count: function (collectionName, opts, cb) {
      this.find(collectionName, opts, function (err, results) {
        if (err) return cb(err);
        cb(null, results.length);
      });
    }, 
    create: function (collectionName, data, cb) {
      datastore[collectionName].create(data, cb);
    },
    update: function (collectionName, opts, data, cb) {
      datastore[collectionName].update(opts, data, cb);
    },
    destroy: function (collectionName, opts, cb) {
      datastore[collectionName].destroy(opts, cb);
    }
  };
};

module.exports = MemoryAdapter;

var datastore = require('../datastore');

/**
 * An adapter to interact with a datastore in memory
 * @class MemoryAdapter
 * @constructor
 */
var MemoryAdapter = function () {

  return {
    /**
     * Find records
     * @method find
     * @param  {String}   collectionName Table name
     * @param  {Object}   opts Filter parameters
     * @param  {Function} cb A callback (err, results)
     */
    find: function (collectionName, opts, cb) {
      datastore[collectionName].find(opts, cb);
    },

    /**
     * Count records in a table
     * @method count
     * @param  {String}   collectionName Table name
     * @param  {Object}   opts Filter parameters
     * @param  {Function} cb A callback (err, num)
     */
    count: function (collectionName, opts, cb) {
      this.find(collectionName, opts, function (err, results) {
        if (err) return cb(err);
        cb(null, results.length);
      });
    },

    /**
     * Create a record
     * TODO Create an array of records
     * @method create
     * @param  {String}   collectionName Table name
     * @param  {Object}   data A record
     * @param  {Function} cb A callback (err, lastId)
     */
    create: function (collectionName, data, cb) {
      datastore[collectionName].create(data, cb);
    },

    /**
     * Update record(s)
     * @method update
     * @param  {String}   collectionName Table name
     * @param  {Object}   opts Filter parameters
     * @param  {Object}   data Data overrides
     * @param  {Function} cb A callback (err)
     */
    update: function (collectionName, opts, data, cb) {
      datastore[collectionName].update(opts, data, cb);
    },

    /**
     * Destroy record(s)
     * @method destroy
     * @param  {String}   collectionName Table name
     * @param  {Object}   opts Filter parameters
     * @param  {Function} cb A callback (err)
     */
    destroy: function (collectionName, opts, cb) {
      datastore[collectionName].destroy(opts, cb);
    }
  };
};

module.exports = MemoryAdapter;

var sql = require('../sql');

/**
 * An adapter for mysql interactions
 * @class MysqlAdapter
 * @constructor
 * @param {Object} conn A mysql connection
 * @param {Object} pool A mysql pool
 */
var MysqlAdapter = function (conn, pool) {

  /**
   * Query a mysql database
   * @method query
   * @param  {String}   sql
   * @param  {Function} cb
   * @private
   */
  function query (sql, cb) {
    if (pool) {
      pool.getConnection(function (err, connection) {
        if (err) return cb(err);
        connection.query(sql, function (err, results) {
          connection.release();
          if (err) return cb(err);
          return cb(null, results);
        });
      });
    } else {
      conn.query(sql, cb);
    }
  }

  return {
    /**
     * Find record(s)
     * @method find
     * @param  {String}   collectionName Table name
     * @param  {Object}   opts Filter parameters
     * @param  {Function} cb A callback (err, results)
     */
    find: function (collectionName, opts, cb) {
      query(sql.selectQuery(collectionName, opts), cb);
    },

    /**
     * Create record(s)
     * @method create
     * @param  {String}       collectionName Table name
     * @param  {Object|Array} data A record or array of records
     * @param  {Function}     cb A callback (err, lastId)
     */
    create: function (collectionName, data, cb) {
      query(sql.insertQuery(collectionName, data), function (err, result) {
        if (err) return cb(err);
        cb(null, result.insertId);
      });
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
      query(sql.updateQuery(collectionName, opts, data), cb);
    },

    /**
     * Destroy record(s)
     * @method destroy
     * @param  {String}   collectionName Table name
     * @param  {Object}   opts Filter parameters
     * @param  {Function} cb A callback (err)
     */
    destroy: function (collectionName, opts, cb) {
      query(sql.deleteQuery(collectionName, opts), cb);
    }
  };
};

module.exports = MysqlAdapter;

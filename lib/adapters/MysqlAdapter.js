var sql = require('../sql');

var MysqlAdapter = function (conn, pool) {

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
    find: function (collectionName, opts, cb) {
      query(sql.selectQuery(collectionName, opts), cb);
    },
    create: function (collectionName, data, cb) {
      query(sql.insertQuery(collectionName, data), function (err, result) {
        if (err) return cb(err);
        cb(null, result.insertId);
      });
    },
    update: function (collectionName, opts, data, cb) {
      query(sql.updateQuery(collectionName, opts, data), cb);
    },
    destroy: function (collectionName, opts, cb) {
      query(sql.deleteQuery(collectionName, opts), cb);
    }
  };
};

module.exports = MysqlAdapter;

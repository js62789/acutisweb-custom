var assert = require('assert');
var MysqlAdapter = require('../../../lib/adapters/MysqlAdapter');

var mysql = require('mysql');
var config = require('../../../config');
var conn = mysql.createConnection(config.mysql);

var mysqlAdapter = new MysqlAdapter(conn);

describe('Mysql adapter', function () {

  describe('.find()', function () {

    it('should get records', function (done) {
      mysqlAdapter.find('user', {}, function (err, users) {
        assert(!err);
        assert(users instanceof Array);
        done();
      });
    });

  });

});

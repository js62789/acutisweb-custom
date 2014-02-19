var assert = require('assert');
var MysqlAdapter = require('../../../lib/adapters/MysqlAdapter');

var mysql = require('mysql');
var config = require('../../../config');
var conn = mysql.createConnection(config.mysql);

var mysqlAdapter = new MysqlAdapter(conn);

describe('Mysql adapter', function () {

  describe('.destroy()', function () {

    before(function (done) {
      var userData = {
        email: 'deleteme@test.com',
        password: 'deleteme',
        username: 'deleteme',
        first_name: 'delete',
        last_name: 'me'
      };
      mysqlAdapter.create('user', userData, function (err, results) {
        if (err) done(err);
        done();
      });
    });

    it('should remove a single record', function (done) {
      var userData = {
        first_name: 'please',
        last_name: 'deleteme'
      };
      mysqlAdapter.destroy('user', {where: {username: 'deleteme'}}, function (err, results) {
        assert(!err);
        assert(results);
        done();
      });
    });

  });

});

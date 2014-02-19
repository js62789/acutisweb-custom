var assert = require('assert');
var MysqlAdapter = require('../../../lib/adapters/MysqlAdapter');

var mysql = require('mysql');
var config = require('../../../config');
var conn = mysql.createConnection(config.mysql);

var mysqlAdapter = new MysqlAdapter(conn);

describe('Mysql adapter', function () {

  describe('.create()', function () {

    after(function (done) {
      mysqlAdapter.destroy('user', {where: {username: 'deleteme'}}, function (err, results) {
        if (err) done(err);
        done();
      });
    });

    it('should create a single record', function (done) {
      var userData = {
        email: 'deleteme@test.com',
        password: 'deleteme',
        username: 'deleteme',
        first_name: 'delete',
        last_name: 'me'
      };
      mysqlAdapter.create('user', userData, function (err, results) {
        assert(!err);
        assert(results);
        done();
      });
    });

  });

});

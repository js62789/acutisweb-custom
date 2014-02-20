var assert = require('assert');
var MysqlAdapter = require('../../../lib/adapters/MysqlAdapter');

var mysql = require('mysql');
var config = require('../../../config');
var conn = mysql.createConnection(config.mysql);

var mysqlAdapter = new MysqlAdapter(conn);

describe('Mysql adapter', function () {

  describe('.create()', function () {

    after(function (done) {
      mysqlAdapter.destroy('user', {where: {username: ['deleteme', 'deleteme2']}}, function (err, results) {
        if (err) done(err);
        done();
      });
    });

    it('should return the record id', function (done) {
      var userData = {
        email: 'deleteme@test.com',
        password: 'deleteme',
        username: 'deleteme',
        first_name: 'delete',
        last_name: 'me'
      };
      mysqlAdapter.create('user', userData, function (err, id) {
        assert(!err);
        assert(id);
        assert(typeof id === 'number');
        done();
      });
    });

    it('should create many records', function (done) {
      var userData = [{
        email: 'deleteme@test.com',
        password: 'deleteme',
        username: 'deleteme',
        first_name: 'delete',
        last_name: 'me'
      },{
        email: 'deleteme2@test.com',
        password: 'deleteme2',
        username: 'deleteme2',
        first_name: 'delete2',
        last_name: 'me2'
      }];

      mysqlAdapter.create('user', userData, function (err, id) {
        assert(!err);
        assert(id);
        done();
      });
    });

  });

});

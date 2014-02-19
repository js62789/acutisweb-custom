var assert = require('assert');
var sql = require('../../../lib/sql');

describe('Sql utility', function () {

  describe('.insertQuery()', function () {

    it('should create an INSERT statement', function () {
      var sqlStatement = sql.insertQuery('test', {email: 'test@test.com'});
      var shouldBe = "INSERT INTO `test` (`email`) VALUES ('test@test.com')";
      assert(sqlStatement === shouldBe);
    });

    it('should support multi insert', function () {
      var records = [{email: 'test1@test.com'},{email: 'test2@test.com'}];
      var sqlStatement = sql.insertQuery('test', records);
      var shouldBe = "INSERT INTO `test` (`email`) VALUES ('test1@test.com'),('test2@test.com')";
      assert(sqlStatement === shouldBe);
    });

    it('should create an INSERT IGNORE statement', function () {
      var records = [{email: 'test1@test.com'},{email: 'test2@test.com'}];
      var sqlStatement = sql.insertQuery('test', records, true);
      var shouldBe = "INSERT IGNORE INTO `test` (`email`) VALUES ('test1@test.com'),('test2@test.com')";
      assert(sqlStatement === shouldBe);
    });

  });

});

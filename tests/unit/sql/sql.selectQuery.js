var assert = require('assert');
var sql = require('../../../lib/sql');

describe('Sql utility', function () {

  describe('.selectQuery()', function () {

    it('should create a select statement', function () {
      var sqlStatement = sql.selectQuery('test');
      var shouldBe = "SELECT * FROM `test` ";
      assert(sqlStatement === shouldBe);
    });

    it('should include a where clause', function () {
      var sqlStatement = sql.selectQuery('test', {where: {age: 4}});
      var shouldBe = "SELECT * FROM `test` WHERE `age` = 4 ";
      assert(sqlStatement === shouldBe);
    });

    it('should include a like clause', function () {
      var sqlStatement = sql.selectQuery('test', {where: {like: {name: 'test', summ: 'test'}}});
      var shouldBe = "SELECT * FROM `test` WHERE (`name` LIKE '%test%' OR `summ` LIKE '%test%') ";
      assert(sqlStatement === shouldBe);
    });

  });

});

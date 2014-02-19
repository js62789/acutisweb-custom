var assert = require('assert');
var sql = require('../../../lib/sql');

describe('Sql utility', function () {

  describe('.deleteQuery()', function () {

    it('should create a delete statement', function () {
      var sqlStatement = sql.deleteQuery('test');
      var shouldBe = "DELETE FROM `test` ";
      assert(sqlStatement === shouldBe);
    });

    it('should include a where clause', function () {
      var sqlStatement = sql.deleteQuery('test', {where: {age: 3}});
      var shouldBe = "DELETE FROM `test` WHERE `age` = 3 ";
      assert(sqlStatement === shouldBe);
    });

  });

});

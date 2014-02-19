var assert = require('assert');
var sql = require('../../../lib/sql');

describe('Sql utility', function () {

  describe('.updateQuery()', function () {

    it('should create an update statement', function () {
      var sqlStatement = sql.updateQuery('test', {where: {age: 4}}, {age: 3});
      var shouldBe = "UPDATE `test` SET `age` = 3 WHERE `age` = 4 ";
      assert(sqlStatement === shouldBe);
    });

  });

});

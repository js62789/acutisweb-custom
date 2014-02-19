var assert = require('assert');
var sql = require('../../../lib/sql');

describe('Sql utility', function () {

  describe('.where()', function () {

    it('should create a where string', function () {
      var where = {
        age: 3
      };
      var sqlStatement = sql.where(where);
      var shouldBe = "`age` = 3";
      assert(sqlStatement === shouldBe);
    });

    it('should create a like clause', function () {
      var where = {
        like: {
          name: 'test', 
          summ: 'test'
        }
      };
      var sqlStatement = sql.where(where);
      var shouldBe = "(`name` LIKE '%test%' OR `summ` LIKE '%test%')";
      assert(sqlStatement === shouldBe);
    });

  });

});

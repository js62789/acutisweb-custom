var assert = require('assert');
var sql = require('../../../lib/sql');

describe('Sql utility', function () {

  describe('.values()', function () {

    it('should create an values string', function () {
      var data = {
        id: 1,
        email: 'test@test.com'
      };
      var sqlStatement = sql.values(data);
      var shouldBe = "1,'test@test.com'";
      assert(sqlStatement === shouldBe);
    });

  });

});

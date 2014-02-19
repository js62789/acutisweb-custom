var assert = require('assert');
var sql = require('../../../lib/sql');

describe('Sql utility', function () {

  describe('.attributes()', function () {

    it('should create an attributes string', function () {
      var data = {
        id: 1,
        email: 'test@test.com'
      };
      var sqlStatement = sql.attributes(data);
      var shouldBe = "`id`,`email`";
      assert(sqlStatement === shouldBe);
    });

  });

});

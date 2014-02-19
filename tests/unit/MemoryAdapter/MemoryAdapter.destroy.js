var assert = require('assert');
var MemoryAdapter = require('../../../lib/adapters/MemoryAdapter');

var memoryAdapter = new MemoryAdapter();

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
      memoryAdapter.create('user', userData, function (err, results) {
        if (err) done(err);
        done();
      });
    });

    it('should remove a single record', function (done) {
      var userData = {
        first_name: 'please',
        last_name: 'deleteme'
      };
      memoryAdapter.destroy('user', {where: {username: 'deleteme'}}, function (err, results) {
        assert(!err);
        assert(results);
        done();
      });
    });

  });

});

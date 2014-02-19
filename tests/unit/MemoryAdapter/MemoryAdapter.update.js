var assert = require('assert');
var MemoryAdapter = require('../../../lib/adapters/MemoryAdapter');

var memoryAdapter = new MemoryAdapter();

describe('Memory adapter', function () {

  describe('.update()', function () {

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

    after(function (done) {
      memoryAdapter.destroy('user', {where: {username: 'deleteme'}}, function (err, results) {
        if (err) done(err);
        done();
      });
    });

    it('should update a single record', function (done) {
      var userData = {
        first_name: 'please',
        last_name: 'deleteme'
      };
      memoryAdapter.update('user', {where: {username: 'deleteme'}}, userData, function (err, results) {
        assert(!err);
        assert(results);
        done();
      });
    });

  });

});

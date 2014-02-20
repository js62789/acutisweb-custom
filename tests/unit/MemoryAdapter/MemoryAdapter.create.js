var assert = require('assert');
var MemoryAdapter = require('../../../lib/adapters/MemoryAdapter');

var memoryAdapter = new MemoryAdapter();

describe('Memory adapter', function () {

  describe('.create()', function () {

    after(function (done) {
      memoryAdapter.destroy('user', {where: {username: ['deleteme', 'deleteme2']}}, function (err, results) {
        if (err) done(err);
        done();
      });
    });

    it('should create a single record', function (done) {
      var userData = {
        email: 'deleteme@test.com',
        password: 'deleteme',
        username: 'deleteme',
        first_name: 'delete',
        last_name: 'me'
      };
      memoryAdapter.create('user', userData, function (err, results) {
        assert(!err);
        assert(results);
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

      memoryAdapter.create('user', userData, function (err, id) {
        assert(!err);
        assert(id);
        done();
      });
    });

  });

});

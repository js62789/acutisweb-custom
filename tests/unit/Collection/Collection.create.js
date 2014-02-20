var assert = require('assert');
var MemoryAdapter = require('../../../lib/adapters/MemoryAdapter');
var Collection = require('../../../lib/Collection');

var memoryAdapter = new MemoryAdapter();

var collection = new Collection({
  name: 'user',
  adapter: memoryAdapter
});

describe('Collection', function () {

  describe('.create()', function () {

    after(function (done) {
      collection.destroy({where: {username: ['deleteme', 'deleteme2']}}, function (err, results) {
        if (err) done(err);
        done();
      });
    });

    it('should create a record', function (done) {
      var userData = {
        email: 'deleteme@test.com',
        password: 'deleteme',
        username: 'deleteme',
        first_name: 'delete',
        last_name: 'me'
      };
      collection.create(userData, function (err, user) {
        assert(!err);
        assert(user.id);
        assert(user.email === 'deleteme@test.com');
        done();
      });
    });

    it('should return the last record created', function (done) {
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

      collection.create(userData, function (err, user) {
        assert(!err);
        assert(user.id);
        assert(user.email === 'deleteme2@test.com');
        done();
      });
    });

  });

});

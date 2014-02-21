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
      collection.destroy({where: {username: 'deleteme'}}, function (err, results) {
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
      collection.create(userData, function (err, id) {
        assert(!err);
        assert(id);
        done();
      });
    });

  });

});

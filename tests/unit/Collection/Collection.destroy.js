var assert = require('assert');
var MemoryAdapter = require('../../../lib/adapters/MemoryAdapter');
var Collection = require('../../../lib/Collection');

var memoryAdapter = new MemoryAdapter();

var collection = new Collection({
  name: 'user',
  adapter: memoryAdapter
});

describe('Collection', function () {

  describe('.destroy()', function () {

    before(function (done) {
      var userData = {
        email: 'deleteme@test.com',
        password: 'deleteme',
        username: 'deleteme',
        first_name: 'delete',
        last_name: 'me'
      };
      collection.create(userData, function (err, results) {
        if (err) done(err);
        done();
      });
    });

    it('should delete a record', function (done) {
      collection.destroy({where: {username: 'deleteme'}}, function (err, user) {
        assert(!err);
        done();
      });
    });

  });

});

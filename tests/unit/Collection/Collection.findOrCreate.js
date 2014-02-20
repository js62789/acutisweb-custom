var assert = require('assert');
var MemoryAdapter = require('../../../lib/adapters/MemoryAdapter');
var Collection = require('../../../lib/Collection');

var memoryAdapter = new MemoryAdapter();

var collection = new Collection({
  name: 'user',
  adapter: memoryAdapter
});

describe('Collection', function () {

  describe('.findOrCreate()', function () {

    it('should return an existing record', function (done) {
      var userData = {
        email: 'test@test.com',
        password: 'test',
        username: 'test',
        first_name: 'test',
        last_name: 'test'
      };
      collection.findOrCreate({where: {username: 'test'}}, userData, function (err, result) {
        assert(!err);
        assert(result.id);
        assert(result.email === 'test@test.com');
        done();
      });
    });

  });

});

var assert = require('assert');
var MemoryAdapter = require('../../../lib/adapters/MemoryAdapter');
var Collection = require('../../../lib/Collection');

var memoryAdapter = new MemoryAdapter();

var collection = new Collection({
  name: 'user',
  adapter: memoryAdapter
});

describe('Collection', function () {

  describe('.findOne()', function () {

    it('should get a single record', function (done) {
      collection.findOne({}, function (err, user) {
        assert(!err);
        assert(user);
        done();
      });
    });

  });

});

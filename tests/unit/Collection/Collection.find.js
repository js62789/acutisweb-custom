var assert = require('assert');
var MemoryAdapter = require('../../../lib/adapters/MemoryAdapter');
var Collection = require('../../../lib/Collection');

var memoryAdapter = new MemoryAdapter();

var collection = new Collection({
  name: 'user',
  adapter: memoryAdapter
});

describe('Collection', function () {

  describe('.find()', function () {

    it('should get records', function (done) {
      collection.find({}, function (err, user) {
        assert(!err);
        done();
      });
    });

  });

});

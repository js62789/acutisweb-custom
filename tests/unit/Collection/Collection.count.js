var assert = require('assert');
var MemoryAdapter = require('../../../lib/adapters/MemoryAdapter');
var Collection = require('../../../lib/Collection');

var memoryAdapter = new MemoryAdapter();

var collection = new Collection({
  name: 'user',
  adapter: memoryAdapter
});

describe('Collection', function () {

  describe('.count()', function () {

    it('should count records', function (done) {
      collection.count({}, function (err, numUsers) {
        assert(!err);
        assert(typeof numUsers === 'number');
        done();
      });
    });

  });

});

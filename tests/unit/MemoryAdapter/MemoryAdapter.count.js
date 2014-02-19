var assert = require('assert');
var MemoryAdapter = require('../../../lib/adapters/MemoryAdapter');

var memoryAdapter = new MemoryAdapter();

describe('Memory adapter', function () {

  describe('.count()', function () {

    it('should count records', function (done) {
      memoryAdapter.count('user', {}, function (err, numUsers) {
        assert(!err);
        assert(typeof numUsers === 'number');
        done();
      });
    });

  });

});

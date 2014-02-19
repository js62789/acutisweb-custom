var assert = require('assert');
var MemoryAdapter = require('../../../lib/adapters/MemoryAdapter');

var memoryAdapter = new MemoryAdapter();

describe('Memory adapter', function () {

  describe('.findOne()', function () {

    it('should get a single record', function (done) {
      memoryAdapter.findOne('user', {}, function (err, user) {
        assert(!err);
        assert(user);
        done();
      });
    });

  });

});

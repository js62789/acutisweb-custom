var assert = require('assert');
var MemoryAdapter = require('../../../lib/adapters/MemoryAdapter');

var memoryAdapter = new MemoryAdapter();

describe('Memory adapter', function () {

  describe('.find()', function () {

    it('should get records', function (done) {
      memoryAdapter.find('user', {}, function (err, users) {
        assert(!err);
        assert(users instanceof Array);
        done();
      });
    });

  });

});

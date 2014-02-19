var assert = require('assert');
var Table = require('../../../lib/Table');

describe('Table', function () {

  describe('.create()', function () {

    it('should set defaults', function (done) {
      var table = new Table({
        defaults: {
          active: true
        }
      });

      table.create({
        name: 'test'
      }, function (err, created) {
        assert(!err);
        assert(created);
        assert(created.active === true);
        done();
      });
    });

    it('should set defaults as functions', function (done) {
      var table = new Table({
        defaults: {
          created_at: function () {
            return new Date();
          }
        }
      });

      table.create({
        name: 'test'
      }, function (err, created) {
        assert(!err);
        assert(created);
        assert(created.created_at instanceof Date);
        done();
      });
    });

  });

});

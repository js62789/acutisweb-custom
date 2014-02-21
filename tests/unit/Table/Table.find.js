var assert = require('assert');
var Table = require('../../../lib/Table');

describe('Table', function () {

  describe('.find()', function () {

    var records = [
      {
        id: 1,
        name: 'test1'
      },
      {
        id: 2,
        name: 'test2'
      },
      {
        id: 3,
        name: 'test3'
      }
    ];

    it('should find records', function (done) {
      var table = new Table({
        records: records
      });

      table.find({}, function (err, records) {
        assert(!err);
        assert(records);
        assert(records.length === 3);
        done();
      });
    });

    it('should find records with properties', function (done) {
      var table = new Table({
        records: records
      });
      
      table.find({where: {name: 'test1'}}, function (err, records) {
        assert(!err);
        assert(records);
        assert(records.length === 1);
        done();
      });
    });

    it('should find records with properties in an array', function (done) {
      var table = new Table({
        records: records
      });

      table.find({where: {id: [1, 2]}}, function (err, records) {
        assert(!err);
        assert(records);
        assert(records.length === 2);
        done();
      });
    });

  });

});

var assert = require('assert');
var Table = require('../../../lib/Table');

describe('Table', function () {

  describe('.destroy()', function () {

    var records = [
      {
        id: 1,
        name: 'test1'
      },
      {
        id: 2,
        name: 'test1'
      },
      {
        id: 3,
        name: 'test3'
      }
    ];

    it('should remove a record', function (done) {
      var table = new Table({
        records: records
      });

      table.destroy({where: {id: 1}}, function (err, results) {
        assert(!err);
        assert(table.records.length === 2);
        done();
      });
    });

    it('should remove many records', function (done) {
      var table = new Table({
        records: records
      });
      
      table.destroy({where: {name: 'test1'}}, function (err, results) {
        assert(!err);
        assert(table.records.length === 1);
        done();
      });
    });

  });

});

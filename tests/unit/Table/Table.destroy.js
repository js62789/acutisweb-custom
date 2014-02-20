var assert = require('assert');
var Table = require('../../../lib/Table');

describe('Table', function () {

  describe('.find()', function () {

    var table;

    before(function () {
      table = new Table({
        records: [
          {
            id: 1,
            name: 'test1',
            age: 3
          },
          {
            id: 2,
            name: 'test1',
            age: 3
          },
          {
            id: 3,
            name: 'test3',
            age: 3
          }
        ]
      });
    });

    it('should remove a record', function (done) {
      table.destroy({where: {id: 1}}, function (err, results) {
        assert(!err);
        assert(table.records.length === 2);
        done();
      });
    });

    it('should remove many records', function (done) {
      table.destroy({where: {age: 3}}, function (err, results) {
        assert(!err);
        assert(table.records.length === 0);
        done();
      });
    });

  });

});

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

    it('should update a record', function (done) {
      table.update({where: {id: 1}}, {name: 'test3'}, function (err, results) {
        assert(!err);
        table.find({where: {name: 'test3'}}, function (err, records) {
          assert(!err);
          assert(records);
          assert(records.length === 2);
          done();
        });
      });
    });

    it('should update many records', function (done) {
      table.update({where: {age: 3}}, {age: 4}, function (err, records) {
        assert(!err);
        table.find({where: {age: 4}}, function (err, records) {
          assert(!err);
          assert(records);
          assert(records.length === 3);
          done();
        });
      });
    });

  });

});

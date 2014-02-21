var assert = require('assert');
var Table = require('../../../lib/Table');

describe('Table', function () {

  describe('.update()', function () {

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

    it('should clone records', function (done) {
      var a = {id: 1};
      var b = {id: 2};
      var c = [a,b];
      var table = new Table({
        records: c
      });
      table.update({where: {id: 1}}, {id: 2}, function (err, results) {
        assert(a.id === 1);
        done();
      });
    });

    it('should update a record', function (done) {
      var table = new Table({
        records: records
      });

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
      var table = new Table({
        records: records
      });

      table.update({where: {name: 'test1'}}, {name: 'test4'}, function (err, records) {
        assert(!err);
        table.find({where: {name: 'test4'}}, function (err, records) {
          assert(!err);
          assert(records);
          assert(records.length === 2);
          done();
        });
      });
    });

    it('should return updated records', function (done) {
      var table = new Table({
        records: records
      });

      table.update({where: {name: 'test1'}}, {name: 'test3'}, function (err, records) {
        assert(!err);
        assert(records.length === 2);
        assert(records[0].name === 'test3');
        done();
      });
    });

  });

});

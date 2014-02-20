var assert = require('assert');
var Table = require('../../../lib/Table');

describe('Table', function () {

  describe('.create()', function () {

    it('should set id', function (done) {
      var table = new Table({
        defaults: {
          active: true
        }
      });

      table.create({
        name: 'test'
      }, function (err, id) {
        assert(!err);
        assert(id);
        done();
      });
    });

    it('should set defaults', function (done) {
      var table = new Table({
        defaults: {
          active: true
        }
      });

      table.create({
        name: 'test'
      }, function (err, id) {
        assert(!err);
        table.find({where: {id: id}}, function (err, results) {
          assert(!err);
          assert(results.length === 1);
          assert(results[0].active);
          done();
        });
      });
    });

    it('should set defaults as functions', function (done) {
      var table = new Table({
        defaults: {
          id: function () {
            return (this.records.length ? this.records[this.records.length-1].id + 1 : 1);
          },
          created_at: function () {
            return new Date();
          }
        }
      });

      table.create({
        name: 'test'
      }, function (err, id) {
        assert(!err);
        assert(id);
        table.find({where: {id: id}}, function (err, results) {
          assert(!err);
          assert(results.length === 1);
          assert(results[0].created_at);
          done();
        });
      });
    });

    it('should create an array of records', function (done) {
      var table = new Table({
        defaults: {
          id: function () {
            return (this.records.length ? this.records[this.records.length-1].id + 1 : 1);
          },
          created_at: function () {
            return new Date();
          }
        }
      });

      var numRecords = table.records.length;
      table.create([{name: 'test'}, {name: 'test2'}], function (err, id) {
        assert(!err);
        assert(id);
        assert(table.records.length === (numRecords + 2));
        done();
      });
    });

  });

});

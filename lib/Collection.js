var Collection = function () {
  this.init.apply(this, arguments);
};

Collection.prototype.attributes = {

};

Collection.prototype.init = function (opts) {
  opts = opts || {};
  this.adapter = opts.adapter;
  this.name = opts.name || this.name || '';
};

Collection.prototype.findOne = function (opts, cb) {
  opts.limit = 1;
  this.find(opts, function (err, results) {
    if (err) return cb(err);
    if (results.length < 1) return cb(err);
    cb(null, results[0]);
  });
};

Collection.prototype.find = function (opts, cb) {
  opts = opts || {};
  this.adapter.find(this.name, opts, function (err, results) {
    if (err) return cb(err);
    cb(null, this.typecast(results));
  }.bind(this));
};

Collection.prototype.findOrCreate = function (opts, data, cb) {
  opts = opts || {};
  this.findOne(opts, function (err, result) {
    if (err) return cb(err);
    if (result) {
      cb(null, result);
    } else {
      this.create(data, cb);
    }
  }.bind(this));
};

Collection.prototype.create = function (data, cb) {
  this.adapter.create(this.name, this.typecast(data), function(err, id) {
    if (err) return cb(err);
    this.findOne({where: {id: id}}, cb);
  }.bind(this));
};

Collection.prototype.update = function (opts, data, cb) {
  this.adapter.update(this.name, opts, data, cb);
};

Collection.prototype.destroy = function (opts, cb) {
  this.adapter.destroy(this.name, opts, cb);
};

Collection.prototype.count = function (opts, cb) {
  this.find(opts, function (err, results) {
    if (err) return cb(err);
    cb(null, results.length);
  });
};

Collection.prototype.typecast = function (results) {
  if (results instanceof Array) {
    for (var i=0, numR=results.length; i<numR; i++) {
      results[i] = this.typecastOne(results[i]);
    }
    return results;
  } else {
    return this.typecastOne(results);
  }
};

Collection.prototype.typecastOne = function (result) {
  var attributes = this.attributes || {};
  for (var attr in attributes) {
    if (result.hasOwnProperty(attr)) {
      switch (attributes[attr]) {
        case 'string':
          result[attr] = result[attr].toString();
          break;

        case 'date':
          result[attr] = new Date(result[attr]);
          break;

        case 'integer':
          result[attr] = parseInt(result[attr], 10);
          break;

        case 'float':
          result[attr] = parseFloat(result[attr]);
          break;

        case 'boolean':
          if(parseInt(result[attr], 10) === 0) result[attr] = false;
          if(parseInt(result[attr], 10) === 1) result[attr] = true;
          break;
      }
    }
  }
  return result;
};

module.exports = Collection;

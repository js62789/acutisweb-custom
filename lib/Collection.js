/**
 * Represents a collection of data
 * @class Collection
 * @constructor
 */
var Collection = function () {
  this.init.apply(this, arguments);
};

/**
 * A mapping for typecasting of field: type
 * can be string, integer, float, boolean, or date
 * @property attributes
 * @type     Object
 * @default  {}
 */
Collection.prototype.attributes = {

};

/**
 * Runs immediately upon instantiation
 * @method init
 * @param  {Object} opts Settings
 */
Collection.prototype.init = function (opts) {
  opts = opts || {};
  this.adapter = opts.adapter;
  this.name = opts.name || this.name || '';
};

/**
 * Find a single record
 * @method findOne
 * @param  {Object}   opts Filter parameters
 * @param  {Function} cb An optional callback (err, result)
 * @return {Object}   Deferred instance
 */
Collection.prototype.findOne = function (opts, cb) {
  if (typeof cb !== 'function')       
  opts.limit = 1;
  this.find(opts, function (err, results) {
    if (err) return cb(err);
    if (results.length < 1) return cb(err);
    cb(null, results[0]);
  });
};

/**
 * Find records
 * @method find
 * @param  {Object}   opts Filter parameters
 * @param  {Function} cb An optional callback (err, results)
 * @return {Object}   Deferred instance
 */
Collection.prototype.find = function (opts, cb) {
  opts = opts || {};
  
  this.adapter.find(this.name, opts, function (err, results) {
    if (err) return cb(err);
    cb(null, this.typecast(results));
  }.bind(this));
};

/**
 * Find a record and create it if it doesn't exist
 * @param  {Object}   opts Filter parameters
 * @param  {Object}   data Record to be created
 * @param  {Function} cb A callback(err, result)
 * @return {[type]}
 */
Collection.prototype.findOrCreate = function (opts, data, cb) {
  opts = opts || {};

  this.findOne(opts, function (err, result) {
    if (err) return cb(err);
    if (result) {
      cb(null, result);
    } else {
      this.create(data, function (err, id) {
        this.findOne({where: {id: id}}, cb);
      }.bind(this));
    }
  }.bind(this));
};

/**
 * Create a record
 * @method create
 * @param  {Object|Array} data Record or array of records
 * @param  {Function}     cb An optional callback (err, id)
 * @return {Object}       Deferred instance
 */
Collection.prototype.create = function (data, cb) {
  this.adapter.create(this.name, this.typecast(data), cb);
};

/**
 * Update records
 * @method update
 * @param  {Object}   opts Filter parameters
 * @param  {Object}   data Data overrides
 * @param  {Function} cb An optional callback (err)
 * @return {Object}   Deferred instance
 */
Collection.prototype.update = function (opts, data, cb) {
  this.adapter.update(this.name, opts, data, cb);
};

/**
 * Destroy records
 * @method destroy
 * @param  {Object}   opts Filter parameters
 * @param  {Function} cb An optional callback (err)
 * @return {Object}   Deferred instance
 */
Collection.prototype.destroy = function (opts, cb) {
  this.adapter.destroy(this.name, opts, cb);
};

/**
 * Count records
 * @method count
 * @param  {Object}   opts Filter parameters
 * @param  {Function} cb An optional callback (err, num)
 * @return {Object}   Deferred instance
 */
Collection.prototype.count = function (opts, cb) {
  this.find(opts, function (err, results) {
    if (err) return cb(err);
    cb(null, results.length);
  });
};

/**
 * Typecast record(s)
 * @method results
 * @param  {Object|Array} results A record or an array of records
 * @return {Object|Array} A typecasted record or an array of them
 */
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

/**
 * Typecast JSON object according to attributes
 * @method typecastOne
 * @param  {Object} result A record
 * @return {Object} A typecasted record
 */
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

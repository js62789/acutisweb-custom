var where = function (records, properties) {
  var matches = [];
  for (var i=0, numItems=records.length; i<numItems; i++) {
    var record = records[i];
    var isMatching = true;
    for (var property in properties) {
      var desiredVal = properties[property];
      if (isMatching) {
        if (property === 'like') {
          var comparisons = properties[property];
          var compares = false;
          for (var comp in comparisons) {
            compares = compares || (record[comp].toLowerCase().indexOf(comparisons[comp].toLowerCase()) !== -1);
          }
          isMatching = compares;
        } else if (isArray(desiredVal)) {
          isMatching = (desiredVal.indexOf(record[property]) !== -1);
        } else {
          isMatching = (record[property] === properties[property]);
        }
      }
    }
    if (isMatching) matches.push(record);
  }
  return matches;
};

var isArray = function (data) {
  return (data instanceof Array);
};

var isFunction = function (fn) {
  return (typeof fn === 'function');
};

var isDate = function (date) {
  return (date instanceof Date);
};

var cloneArray = function (arr) {
  return arr.map(function(obj){
    if (isArray(obj)) {
      return cloneArray(obj);
    } else if (isDate(obj)) {
      return new Date(obj);
    } else {
      return extend({}, obj);
    }
  });
};

var extend = function(out) {
  out = out || {};

  for (var i = 1; i < arguments.length; i++) {
    if (!arguments[i])
      continue;

    for (var key in arguments[i]) {
      if (arguments[i].hasOwnProperty(key))
        out[key] = arguments[i][key];
    }
  }

  return out;
};

var deepExtend = function(out) {
  out = out || {};

  for (var i = 1; i < arguments.length; i++) {
    var obj = arguments[i];

    if (!obj)
      continue;

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object')
          deepExtend(out[key], obj[key]);
        else
          out[key] = obj[key];
      }
    }
  }

  return out;
};

/**
 * A js representation of a db table
 * @class Table
 * @contstructor
 */
var Table = function () {
  this.init.apply(this, arguments);
};

/**
 * Default fields on a new record
 * @property defaults
 * @type     Object
 * @default  {id: Function}
 */
Table.prototype.defaults = {
  id: function () {
    return (this.records.length ? this.records[this.records.length-1].id + 1 : 1);
  }
};

/**
 * Runs immediately upon instantiation
 * @method init
 * @param  {Object} opts Settings (records, defaults)
 */
Table.prototype.init = function (opts) {
  this.records = (opts.records ? cloneArray(opts.records) : []);
  this.defaults = extend({}, this.defaults, opts.defaults);
};

/**
 * Find records
 * @method find
 * @param  {Object}   opts Filter parameters
 * @param  {Function} cb A callback (err, results)
 * @return {Array}    An array of records
 */
Table.prototype.find = function (opts, cb) {
  var records = cloneArray(this.records);

  if (opts.where) {
    records = where(records, opts.where);
  }

  if (opts.limit) {
    records = records.slice(0, opts.limit);
  }

  if (isFunction(cb)) cb(null, records);

  return records;
};

/**
 * Create record(s)
 * @method create
 * @param  {Object|Array} data A record or array of records
 * @param  {Function}     cb A callback (err, lastId)
 * @return {Object|Array} The created record id(s)
 */
Table.prototype.create = function (data, cb) {
  if (isArray(data)) {
    data = data.map(this.create.bind(this));
    cb(null, data[data.length-1]);
    return data;
  }

  var defaults = this.defaults;
  for (var attr in defaults) {
    if (!data.hasOwnProperty(attr)) {
      var defaultValue = defaults[attr];
      if (typeof defaultValue === 'function') {
        defaultValue = defaultValue.call(this);
      }
      data[attr] = defaultValue;
    }
  }

  this.records.push(data);
  if (isFunction(cb)) cb(null, data.id);
  return data.id;
};

/**
 * Update record(s)
 * @method update
 * @param  {Object}   opts Filter parameters
 * @param  {Object}   data Data overrides
 * @param  {Function} cb A callback (err, results)
 * @return {Array}    The updated records
 */
Table.prototype.update = function (opts, data, cb) {
  var records = this.find(opts);
  records = records.map(function(r){
    var index = this.indexOf(r.id);
    return this.updateAt(index, data);
  }.bind(this));

  cb(null, records);

  return records;
};

/**
 * Update a record based on index
 * @method updateAt
 * @param  {Number} i Index of desired record
 * @param  {Object} data Data overrides
 */
Table.prototype.updateAt = function (i, data) {
  for (var attr in data) {
    this.records[i][attr] = data[attr];
  }
  return this.records[i];
};

/**
 * Get the index of a record by id
 * @method indexOf
 * @param  {Number} id The id of the record being seeked
 * @return {Number} Index of the record
 */
Table.prototype.indexOf = function (id) {
  var records = this.records;
  for (var i=0, num=records.length; i<num; i++) {
    if (records[i].id === id) {
      return i;
    }
  }
};

/**
 * Destroy record(s)
 * @method destroy
 * @param  {Object}   opts Filter parameters
 * @param  {Function} cb A callback (err)
 */
Table.prototype.destroy = function (opts, cb) {
  var records = this.find(opts);
  while(records.length) {
    var index = this.records.indexOf(records.pop());
    this.destroyAt(index);
  }
  cb(null, {});
};

/**
 * Destroy a record based on index
 * @method destroyAt
 * @param  {[type]} index
 */
Table.prototype.destroyAt = function (index) {
  this.records.splice(index, 1);
};

module.exports = Table;

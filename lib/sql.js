var mysql = require('mysql');

var isDate = function (date) {
  return (isDate instanceof Date);
};

var isFunction = function (fn) {
  return (typeof fn === 'function');
};

var isArray = function (arr) {
  return (arr instanceof Array);
};

var isBoolean = function (boo) {
  return (typeof boo === typeof true);
};

var rTrim = function (str, remove) {
  return str.replace(new RegExp(remove + "*$"), '');
};

/**
 * A collection of sql query building methods
 * @class  sql
 */
var sql = {
  
  /**
   * Creates a SELECT query
   * @method selectQuery
   * @param  {String} collectionName Table name
   * @param  {Object} opts Filter parameters
   * @return {String} The select statement
   */
  selectQuery: function (collectionName, opts) {
    var query = 'SELECT * FROM ' + sql.prepareAttribute(collectionName) + ' ';
    query += sql.serializeOptions(opts);
    return query;
  },

  /**
   * Creates an INSERT query
   * @method insertQuery
   * @param  {String}       collectionName Table name
   * @param  {Object|Array} data Record data
   * @param  {Boolean}      ignore Determines if INSERT IGNORE
   * @return {String}       The insert statement
   */
  insertQuery: function (collectionName, data, ignore) {
    var query = 'INSERT ';
    if (ignore) query += 'IGNORE ';
    query += 'INTO ' + sql.prepareAttribute(collectionName) + ' ';

    if (isArray(data)) {
      query += '(' + sql.attributes(data[0]) + ')';
    } else {
      query += '(' + sql.attributes(data) + ')';
    }

    query += ' VALUES ';

    if (isArray(data)) {
      query += data.map(function(record){return '(' + sql.values(record) + ')';}).join(',');
    } else {
      query += '(' + sql.values(data) + ')';
    }

    return query;
  },

  /**
   * Creates an UPDATE query
   * @param  {String} collectionName Table name
   * @param  {Object} opts Filter parameters
   * @param  {Object} data Data overrides
   * @return {String} The update statement
   */
  updateQuery: function (collectionName, opts, data) {
    var query = 'UPDATE ' + sql.prepareAttribute(collectionName) + ' ';
    query += 'SET ' + sql.updateCriteria(data) + ' ';
    query += sql.serializeOptions(opts);
    return query;
  },

  /**
   * Creates a DELETE query
   * @method deleteQuery
   * @param  {String} collectionName Table name
   * @param  {Object} opts Filter parameters
   * @return {String} The delete statement
   */
  deleteQuery: function (collectionName, opts) {
    var query = 'DELETE FROM ' + sql.prepareAttribute(collectionName) + ' ';
    query += sql.serializeOptions(opts);
    return query;
  },

  /**
   * Creates the segment following SET in an UPDATE statement
   * @method updateCriteria
   * @param  {Object} data Record being created
   * @return {String} Escaped update criteria
   */
  updateCriteria: function (data) {
    var queryPart = '';
    var separator = ',';
    for (var attr in data) {
      queryPart += sql.prepareAttribute(attr) + ' = ';
      queryPart += sql.prepareValue(data[attr]);
      queryPart += separator;
    }
    queryPart = rTrim(queryPart, separator);
    return queryPart;
  },

  /**
   * Creates a comma separated list of escaped fields
   * @method attributes
   * @param  {Object} data Object with keys representing fields
   * @return {String} Comma separated & escaped fields
   */
  attributes: function (data) {
    var queryPart = '';
    for (var attr in data) {
      queryPart += sql.prepareAttribute(attr);
      queryPart += ',';
    }
    queryPart = queryPart.slice(0, -1);
    return queryPart;
  },

  /**
   * Creates a comma separated list of escaped values
   * @method values
   * @param  {Object} data Object with values representing field values
   * @return {String} Comma separated & escaped values
   */
  values: function (data) {
    var queryPart = '';
    for (var attr in data) {
      queryPart += sql.prepareValue(data[attr]);
      queryPart += ',';
    }
    queryPart = queryPart.slice(0, -1);
    return queryPart;
  },
  
  /**
   * Serializes the secondary options for a query
   * @method serializeOptions
   * @param  {Object} opts Filter parameters
   * @return {String} The last half of a sql statement
   */
  serializeOptions: function(opts) {
    opts = opts || {};
    var queryPart = '';

    if (opts.where) {
      queryPart += 'WHERE ' + sql.where(opts.where) + ' ';
    }

    if (opts.limit) {
      queryPart += 'LIMIT ' + opts.limit + ' ';
    }

    return queryPart;
  },

  /**
   * Formats a value for a sql statement
   * @method prepareValue
   * @param  {String} value The value of a record
   * @return {String} A properly escaped value
   */
  prepareValue: function(value) {

    // Cast dates to SQL
    if (isDate(value)) {
      value = sql.toDate(value);
    }

    // Cast functions to strings
    if (isFunction(value)) {
      value = value.toString();
    }

    // Escape (also wraps in quotes)
    return mysql.escape(value);
  },

  /**
   * Formats a field for a sql statement
   * @method prepareAttribute
   * @param  {String} attrName A field name
   * @return {String} An escaped field
   */
  prepareAttribute: function(attrName) {
    return mysql.escapeId(attrName);
  },
  
  /**
   * Creates the segment following WHERE
   * @method where
   * @param  {Object} where A JSON representation of filters
   * @return {String} Escaped where criteria
   */
  where: function(where) {
    var queryPart = '';
    var separator = ' AND ';
    for (var attr in where) {
      if (attr === 'like') {
        queryPart += sql.like(where[attr]);
      } else {
        queryPart += sql.equals(attr, where[attr]);
      }
      queryPart += separator;
    }
    queryPart = rTrim(queryPart, separator);
    return queryPart;
  },

  /**
   * Creates a piece of a WHERE statement for LIKE criteria
   * @method like
   * @param  {Object} like A JSON represenation of LIKE criteria
   * @return {String} A segment for like criteria
   */
  like: function (like) {
    var queryPart = '';
    var separator = ' OR ';
    queryPart += '(';
    for (var attr in like) {
      queryPart += sql.prepareAttribute(attr);
      queryPart += ' LIKE ';
      queryPart += sql.prepareValue('%' + like[attr] + '%');
      queryPart += separator;
    }
    queryPart = rTrim(queryPart, separator);
    queryPart += ')';
    return queryPart;
  },

  /**
   * Creates a comparison segment of a sql statement
   * @method equals
   * @param  {String}       attr Field name
   * @param  {String|Array} value The right side of the comparison
   * @return {String}       A comparison string
   */
  equals: function (attr, value) {
    var queryPart = '';

    queryPart += sql.prepareAttribute(attr);
    if (isArray(value)) {
      queryPart += ' IN (';
      queryPart += sql.prepareValue(value);
      queryPart += ')';
    } else {
      queryPart += ' = ';
      queryPart += sql.prepareValue(value);
    }
    return queryPart;
  },

  /**
   * Converts a Date instance to a msyql date string
   * @method toDate
   * @param  {Object} date A date instance
   * @return {String} A mysql formatted date
   */
  toDate: function (date) {

    date = date.getUTCFullYear() + '-' +
      ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
      ('00' + date.getUTCDate()).slice(-2) + ' ' +
      ('00' + date.getUTCHours()).slice(-2) + ':' +
      ('00' + date.getUTCMinutes()).slice(-2) + ':' +
      ('00' + date.getUTCSeconds()).slice(-2);

    return date;
  }
};

module.exports = sql;

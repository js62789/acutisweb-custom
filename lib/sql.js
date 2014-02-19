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

var rTrim = function (str, remove) {
  return str.replace(new RegExp(remove + "*$"), '');
};

var sql = {
  
  selectQuery: function (collectionName, opts) {
    var query = 'SELECT * FROM ' + sql.prepareAttribute(collectionName) + ' ';
    query += sql.serializeOptions(opts);
    return query;
  },

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

  updateQuery: function (collectionName, opts, data) {
    var query = 'UPDATE ' + sql.prepareAttribute(collectionName) + ' ';
    query += 'SET ' + sql.updateCriteria(data) + ' ';
    query += sql.serializeOptions(opts);
    return query;
  },

  deleteQuery: function (collectionName, opts) {
    var query = 'DELETE FROM ' + sql.prepareAttribute(collectionName) + ' ';
    query += sql.serializeOptions(opts);
    return query;
  },

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

  attributes: function (data) {
    var queryPart = '';
    for (var attr in data) {
      queryPart += sql.prepareAttribute(attr);
      queryPart += ',';
    }
    queryPart = queryPart.slice(0, -1);
    return queryPart;
  },

  values: function (data) {
    var queryPart = '';
    for (var attr in data) {
      queryPart += sql.prepareValue(data[attr]);
      queryPart += ',';
    }
    queryPart = queryPart.slice(0, -1);
    return queryPart;
  },
  
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

  prepareAttribute: function(attrName) {
    return mysql.escapeId(attrName);
  },
  
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

  equals: function (attr, value) {
    var queryPart = '';
    queryPart += sql.prepareAttribute(attr);
    queryPart += ' = ';
    queryPart += sql.prepareValue(value);
    return queryPart;
  },

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

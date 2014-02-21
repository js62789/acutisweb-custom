var Collection = require('../Collection');
var util = require('util');

/**
 * A collection of articles
 * @class InquiryCollection
 * @constructor
 */
var InquiryCollection = function () {
  Collection.apply(this, arguments);
};

util.inherits(InquiryCollection, Collection);

/**
 * The name of the table holding inquiry records
 * @property name
 * @type String
 */
InquiryCollection.prototype.name = 'inquiry';

module.exports = InquiryCollection;

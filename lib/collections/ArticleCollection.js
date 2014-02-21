var Collection = require('../Collection');
var util = require('util');

/**
 * A collection of articles
 * @class ArticleCollection
 * @constructor
 */
var ArticleCollection = function () {
  Collection.apply(this, arguments);
};

util.inherits(ArticleCollection, Collection);

/**
 * The name of the table holding user records
 * @property name
 * @type String
 */
ArticleCollection.prototype.name = 'article';

/**
 * Sets the updated_at field to the date updated and
 * hands the arguments off to the original update method
 * @method update
 * @param  {Object}   opts Filter parameters
 * @param  {Object}   data Data overrides
 * @param  {Function} cb An optional callback (err)
 */
ArticleCollection.prototype.update = function (opts, data, cb) {
  data.updated_at = new Date();
  return Collection.prototype.update.call(this, opts, data, cb);
};

module.exports = ArticleCollection;

var Collection = require('../Collection');
var util = require('util');

/**
 * A collection of users
 * @class UserCollection
 * @constructor
 */
var UserCollection = function () {
  Collection.apply(this, arguments);
};

util.inherits(UserCollection, Collection);

/**
 * The name of the table holding user records
 * @property name
 * @type String
 */
UserCollection.prototype.name = 'user';

/**
 * Sets the challenge field to a hex string and hands
 * the arguments off to the original create method
 * TODO Support arrays of records
 * @method create
 * @param  {Object}   data Record to be created
 * @param  {Function} cb An optional callback (err, id)
 * @return {Object} Deferred instance
 */
UserCollection.prototype.create = function (data, cb) {
  data.challenge = new Date().getTime().toString(16);
  return Collection.prototype.create.call(this, data, cb);
};

/**
 * Sets the updated_at field to the date updated and
 * hands the arguments off to the original update method
 * @method update
 * @param  {Object}   opts Filter parameters
 * @param  {Object}   data Data overrides
 * @param  {Function} cb An optional callback (err)
 */
UserCollection.prototype.update = function (opts, data, cb) {
  data.updated_at = new Date();
  return Collection.prototype.update.call(this, opts, data, cb);
};

module.exports = UserCollection;

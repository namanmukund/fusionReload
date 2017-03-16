
var localCache = new Mongo.Collection("cache_" + "rest");

Meteor.methods({
        'set': function (key, value) {
  localCache.insert(
    {
      key: key,
      value: value,
      createdAt: new Date()
    }
  );
  }
    });

/**
 * Get value from the cache
 * @param key to search for
 * @returns found value
 *  or undefined if not found
 */
Meteor.methods({
        'get': function (key) {
  var value = localCache.findOne({key: key}, {_id: false, value: true});
  if (value) {
    return value.value;
  }
  return value;
  }
    });


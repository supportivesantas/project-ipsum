var lookup = {};

// storage for hash to ID
// switch to redis later or some other LRU implementation
lookup._name2Hash = {};
lookup._hash2ID = {};

lookup.name2Hash = function (hash) {
  if (!hash) {
    return null;
  }

  return this._name2Hash[hash] || null;
};

lookup.storeName2Hash = function (ip, appname) {
  if (!ip || !appname) {
    return null;
  }

  // fix me later?  
  var hash = ip + appname;
  var result = [ip, appname];
  
  lookup._name2Hash[hash] = result;

  return hash;
};

lookup.hash2ID = function (hash) {
  if (!hash) {
    return null;
  }

  return this._hash2ID[hash] || null;
};

lookup.storeHash2ID = function (hash, serverID, appID) {
  if (!hash || !serverID || !appID) {
    return null;
  }
  
  var result = [serverID, appID];
  this._hash2ID[hash] = result;
  
  return result;
};

module.exports = lookup;
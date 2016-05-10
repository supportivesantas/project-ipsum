"use strict";

class stats {
  constructor(userID, username, statServer, statApp, maxHits, time) {
    this.userID = userID;
    this.username = username,
    this.statServer = statServer;
    this.statApp = statApp;
    this.maxHits = maxHits;
    this.clientApps_id = statApp.id;
    this.clientServers_id = statServer.id;
    this.stats = [];
    this.time = time;
    this.saved = false;
  }

  buildStats() {
    for (let i = 0; i < this.statApp.routes.length; i++) {
      let thisQuery = '';
      let hits = Math.ceil(Math.random() * this.maxHits);

      thisQuery = 'INSERT INTO "stats" ("users_id", "clientApps_id", "clientServers_id", "statName", "statValue", created_at, updated_at) VALUES ($1, ' +
        this.statApp.id + ', ' + this.statServer.id + ', \'' + this.statApp.routes[i] + '\', ' + hits.toString() + ', $2, $2' + ')';
      this.stats.push(thisQuery);
    }

    return this.stats;
  }

  saveHash(client) {
    var hash = this.statServer.ip + this.statApp.appname;
    
    return client.query('INSERT INTO "hashes" ("users_id", "clientApps_id", "clientServers_id", "hash", "username", "ip", "appname") VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT ("hash") DO NOTHING',
      [this.userID, this.statApp.id, this.statServer.id, hash, this.username, this.statServer.ip, this.statApp.appname])
      .catch((error) => {
        console.log('ERROR: Failed to save hash', error);
      });
  }

  save(client, completed) {
    return client.tx((t) => t.batch(this.stats.map((myquery) => client.none(myquery, [this.userID, this.time]))));
  }  
}

module.exports = stats;
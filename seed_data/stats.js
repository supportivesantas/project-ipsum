"use strict";

class stats {
  constructor(userID, statServer, statApp, maxHits, time) {
    this.userID = userID;
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
    
    client.query('INSERT INTO "hashes" ("users_id", "clientApps_id", "clientServers_id", "hash", "username", "ip", "appname") VALUES ($1, $2, $3, $4, (SELECT username FROM users WHERE id = 1) , $4, $5) ON CONFLICT ("hash") DO NOTHING',
      [this.userID, this.statApp.id, this.statServer.id, hash, this.statServer.ip, this.statApp.appname])
      .then((results) => {
        // do nothing
      })
      .catch((error) => {
        console.log('ERROR: Failed to save hash', error);
      });
  }

  save(client, completed) {
    if (!this.saved) {
      let completedTransactions = 0;
      
      for (let i = 0; i < this.stats.length; i++) {
        client.query(this.stats[i], [this.userID, this.time])
          .then((result) => {
            if (++completedTransactions >= this.stats.length - 1) {
              completed();
            }
          })
          .catch((error) => {
            console.log('ERROR: Failed to insert into stats:', error);
          });
      }
      this.saved = true;
    }
  }  
}

module.exports = stats;
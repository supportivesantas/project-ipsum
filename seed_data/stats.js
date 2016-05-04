"use strict";

class stats {
  constructor(statServer, statApp, maxHits, time) {
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

      thisQuery = 'INSERT INTO "stats" ("clientApps_id", "clientServers_id", "statName", "statValue", created_at, updated_at) VALUES (' +
        this.statApp.id + ', ' + this.statServer.id + ', \'' + this.statApp.routes[i] + '\', ' + hits.toString() + ', $1, $1' + ')';
      this.stats.push(thisQuery);
    }

    return this.stats;
  }

  save(client, completed) {
    if (!this.saved) {
      let completedTransactions = 0;
      
      for (let i = 0; i < this.stats.length; i++) {
        client.query(this.stats[i], [this.time])
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
"use strict";

class server {
  constructor(userID, hostname) {
    this.userID = userID;
    this.id = null;
    this.ip = null;
    this.hostname = hostname;
    this.platform = null;
    this.server_id = null;
    this.saved = false;
  }

  randomizeIP() {
    //255.255.255.255
    this.ip = '';
    for (let i = 0; i < 4; i++) {
      let randomOctet = Math.ceil(Math.random() * 255) + 1;
      randomOctet = (randomOctet > 254) ? 254 : randomOctet;
      this.ip += randomOctet.toString() + ((i !== 3) ? '.' : '');
    }
  }

  save(client) {
    let self = this;
    if (!this.saved) {
      client.query('INSERT INTO "clientServers" (users_id, ip, hostname) VALUES ($1, $2, $3) RETURNING id', [this.userID, this.ip, this.hostname])
        .then((result) => {
          self.id = result[0].id;
        })
        .catch((error) => {
          console.log('ERROR: Failed to insert into clientApps:', error);
        });
      this.saved = true;
    }
  }
}

module.exports = server;
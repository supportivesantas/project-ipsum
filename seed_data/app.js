"use strict";

class app {
  constructor(userID, appname) {
    this.userID = userID;
    this.id = null;
    this.appname = appname;
    this.routes = [];
    this.saved = false;
    this.port = null;
  }

  buildRoutes(numRoutes, maxDepth, randomRoute) {
    // randomize a port number between 8000 and 9000
    this.port = 8000 + Math.floor(Math.random() * 1000);
    for (let i = 0; i < numRoutes; i++) {
      let depth = Math.ceil(Math.random() * maxDepth); // get random depth
      let route = [''];

      for (let j = 0; j < depth; j++) {
        // append random route name
        let thisRoute = Math.floor(Math.random() * randomRoute.length);
        route.push(randomRoute[thisRoute]);
      }
      
      this.routes.push(route.join('/'));
    }
  }

  save(client) {
    let self = this;
    return client.query('INSERT INTO "clientApps" (users_id, appname, port) VALUES ($1, $2, $3) RETURNING id', [this.userID, this.appname, this.port])
      .then((result) => {
        self.id = result[0].id;
      })
      .catch((error) => {
        console.log('ERROR: Failed to insert into clientApps:', error);
      });
  }
}


module.exports =  app;
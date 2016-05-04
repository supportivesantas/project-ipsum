"use strict";

class app {
  constructor(appname) {
    this.id = null;
    this.appname = appname;
    this.routes = [];
    this.saved = false;
  }

  buildRoutes(numRoutes, maxDepth, randomRoute) {
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
    if (!this.saved) {
      client.query('INSERT INTO "clientApps" (appname) VALUES ($1) RETURNING id', [this.appname])
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


module.exports =  app;
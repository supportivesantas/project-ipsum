var path = require('path');
var knex = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
  searchPath: 'knex,public'
});
var db = require('bookshelf')(knex);

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function(user) {
      user.increments('id').primary();
      user.string('username', 20).unique();
      user.string('email', 20).unique();
      user.string('phoneNumber', 20);
      user.string('password', 20);
    }).then(function(table) {
      console.log('Created User Table', table);
    });
  }
});

db.knex.schema.hasTable('clientApps').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('clientApps', function(clientApp) {
      clientApp.increments('id').primary();
      // clientApp.integer('user_id').references('users.id'); // comment out for now
      clientApp.string('appname');
    }).then(function(table) {
      console.log('Created Client App Table', table);
    });
  }
});

db.knex.schema.hasTable('clientServers').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('clientServers', function(clientServer) {
      clientServer.increments('id').primary();
      // clientServer.integer('user_id').references('users.id'); // comment out for now
      clientServer.string('ip');
      clientServer.string('hostname');
      clientServer.string('platform');
      clientServer.string('server_id');
    }).then(function(table) {
      console.log('Created Client Server Table', table);
    });
  }
});

db.knex.schema.hasTable('events').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('events', function(event) {
      event.increments('id').primary();
      event.integer('userId');
    }).then(function(table) {
      console.log('Created Event Table', table);
    });
  }
});

db.knex.schema.hasTable('serviceCreds').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('serviceCreds', function(serviceCred) {
      serviceCred.increments('id').primary();
      serviceCred.integer('userId');
    }).then(function(table) {
      console.log('Created Service Cred Table', table);
    });
  }
});

db.knex.schema.hasTable('stats').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('stats', function(stat) {
      stat.increments('id').primary();
      stat.integer('clientApps_id').references('clientApps.id').onDelete('CASCADE');
      stat.integer('clientServers_id').references('clientServers.id').onDelete('CASCADE');
      stat.string('statName');
      stat.integer('statValue');
      stat.timestamps();
    }).then(function(table) {
      console.log('Created Stat Table', table);
    });
  }
});

db.knex.schema.hasTable('hashes').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('hashes', function(stat) {
      stat.increments('id').primary();
      stat.integer('clientApps_id').references('clientApps.id');
      stat.integer('clientServers_id').references('clientServers.id');
      stat.string('hash');
      stat.string('ip');
      stat.string('appname');
    }).then(function(table) {
      console.log('Created Stat Table', table);
    });
  }
});

module.exports = db;

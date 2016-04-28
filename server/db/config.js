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
    db.knex.schema.createTable('clientApps', function(event) {
      clientApp.increments('id').primary();
      clientApp.integer('userId');
    }).then(function(table) {
      console.log('Created Client App Table', table);
    });
  }
});

db.knex.schema.hasTable('clientServers').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('clientServers', function(user) {
      clientServer.increments('id').primary();
      clientServer.integer('userId');
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
    db.knex.schema.createTable('serviceCreds', function(user) {
      serviceCred.increments('id').primary();
      serviceCred.integer('userId');
    }).then(function(table) {
      console.log('Created Service Cred Table', table);
    });
  }
});

db.knex.schema.hasTable('stats').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('stats', function(event) {
      stat.increments('id').primary();
      stat.integer('userId');
    }).then(function(table) {
      console.log('Created Stat Table', table);
    });
  }
});

module.exports = db;

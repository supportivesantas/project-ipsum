var path = require('path');
var knex = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING
});
var db = require('bookshelf')(knex);

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function(user) {
      user.increments('id').primary();
      user.string('username', 20).unique();
      user.string('email').unique();
      user.string('phoneNumber', 20);
      user.string('password', 20);
      user.string('githubid');
      user.string('githubemail');
      user.string('githubtoken');
    }).then(function(table) {
      console.log('Created User Table', table);
    });
  }
});

db.knex.schema.hasTable('clientApps').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('clientApps', function(clientApp) {
      clientApp.increments('id').primary();
      clientApp.integer('users_id').references('users.id').onDelete('CASCADE');
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
      clientServer.integer('users_id').references('users.id').onDelete('CASCADE');
      clientServer.string('ip');
      clientServer.string('hostname');
      clientServer.string('platform');
      clientServer.string('server_id');
      clientServer.integer('serviceCreds_id').references('serviceCreds.id').onDelete('SET NULL');
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
      serviceCred.integer('users_id');
      serviceCred.string('platform');
      serviceCred.string('value');
    }).then(function(table) {
      console.log('Created Service Cred Table', table);
    });
  }
});

db.knex.schema.hasTable('stats').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('stats', function(stat) {
      stat.increments('id').primary();
      stat.integer('users_id').references('users.id').onDelete('CASCADE');
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
      stat.integer('users_id').references('users.id').onDelete('CASCADE');
      stat.integer('clientApps_id').references('clientApps.id').onDelete('CASCADE');
      stat.integer('clientServers_id').references('clientServers.id').onDelete('CASCADE');
      stat.string('hash').unique();
      stat.string('username');
      stat.string('ip');
      stat.string('appname');
    }).then(function(table) {
      console.log('Created Stat Table', table);
    });
  }
});

db.knex.schema.hasTable('serversummaries').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('serversummaries', function(serversummaries) {
      serversummaries.increments('id').primary();
      serversummaries.string('serverid');
      serversummaries.integer('users_id').references('users.id').onDelete('CASCADE');
      serversummaries.string('route');
      serversummaries.string('value');
      serversummaries.string('day');
      serversummaries.string('month');
      serversummaries.string('year');
      serversummaries.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    }).then(function(table) {
      console.log('Created Server Summaries Table', table);
    });
  }
});

db.knex.schema.hasTable('appsummaries').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('appsummaries', function(appsummaries) {
      appsummaries.increments('id').primary();
      appsummaries.integer('users_id').references('users.id').onDelete('CASCADE');
      appsummaries.string('appid');
      appsummaries.string('route');
      appsummaries.string('value');
      appsummaries.string('day');
      appsummaries.string('month');
      appsummaries.string('year');
      appsummaries.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    }).then(function(table) {
      console.log('Created App Summaries Table', table);
    });
  }
});

module.exports = db;

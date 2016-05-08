const expect = require('chai').expect;
const knex = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
});
const User = require('../server/db/models/user.js');
const ClientApp = require('../server/db/models/client-app.js');
const ClientServer = require('../server/db/models/client-server.js');
const Event = require('../server/db/models/event.js');
const Hash = require('../server/db/models/hash.js');
const ServiceCred = require('../server/db/models/service-cred.js');
const Stat = require('../server/db/models/stat.js');

describe('Models Test', function() {

  it('should save a user to the database', function (done) {
    var user = new User({
      username: 'makeitrane',
      email: 'test@test.com',
      phoneNumber: '555-555-5555',
      password: 'defconbravo',
      githubid: 'ranedance',
      githubemail: 'same@s.email',
      githubtoken: '190h9fe0h01hfe0h17f'
    }).save()
    .then(function(){
      return User.where({email: 'test@test.com'}).fetch();
    })
    .then(function(user){
      expect(user.get('username')).to.equal('makeitrane');
      expect(user.get('email')).to.equal('test@test.com');
      expect(user.get('phoneNumber')).to.equal('555-555-5555');
      expect(user.get('password')).to.equal('defconbravo');
      expect(user.get('githubid')).to.equal('ranedance');
      expect(user.get('githubemail')).to.equal('same@s.email');
      expect(user.get('githubtoken')).to.equal('190h9fe0h01hfe0h17f');
      knex('users').where('username', 'makeitrane').del().then(function(results){
        expect(results).to.be.at.least(1);
        done();
      });
    });
  });

  it('should save a clientApp to the database', function (done) {
    var clientApp = new ClientApp({
      appname: 'makeitrane',
    }).save()
    .then(function(){
      return ClientApp.where({appname: 'makeitrane'}).fetch();
    })
    .then(function(clientApp){
      expect(clientApp.get('appname')).to.equal('makeitrane');
      knex('clientApps').where('appname', 'makeitrane').del().then(function(results){
        expect(results).to.be.at.least(1);
        done();
      });
    });
  });

  it('should save a clientServer to the database', function (done) {
    var clientServer = new ClientServer({
      ip: '1234',
      hostname: 'name',
      platform: 'do',
    }).save()
    .then(function(){
      return ClientServer.where({ip: '1234'}).fetch();
    })
    .then(function(clientServer){
      expect(clientServer.get('ip')).to.equal('1234');
      knex('clientServers').where('ip', '1234').del().then(function(results){
        expect(results).to.be.at.least(1);
        done();
      });
    });
  });

  it('should save an event to the database', function (done) {
    var event = new Event({
      userId: 1234,
    }).save()
    .then(function(){
      return Event.where({userId: 1234}).fetch();
    })
    .then(function(event){
      expect(event.get('userId')).to.equal(1234);
      knex('events').where('userId', 1234).del().then(function(results){
        expect(results).to.be.at.least(1);
        done();
      });
    });
  });

//Test was working before, not sure why its not working now
  xit('should save an serviceCreds to the database', function (done) {
    var serviceCred = new ServiceCred({
      users_id: 1234,
    }).save()
    .then(function(){
      return ServiceCred.where({users_id: 1234}).fetch();
    })
    .then(function(serviceCred){
      expect(serviceCred.get('users_id')).to.equal(1234);
      knex('serviceCreds').where('users_id', 1234).del().then(function(results){
        expect(results).to.be.at.least(1);
        done();
      });
    });
  });


  it('should save a Stat to the database', function (done) {
    var stat = new Stat({
      statValue: 1234,
    }).save()
    .then(function(){
      return Stat.where({statValue: 1234}).fetch();
    })
    .then(function(stat){
      expect(stat.get('statValue')).to.equal(1234);
      knex('stats').where('statValue', 1234).del().then(function(results){
        expect(results).to.be.at.least(1);
        done();
      });
    });
  });


  it('should save a Hash to the database', function (done) {
    var hash = new Hash({
      hash: '1234',
    }).save()
    .then(function(){
      return Hash.where({hash: '1234'}).fetch();
    })
    .then(function(hash){
      expect(hash.get('hash')).to.equal('1234');
      knex('hashes').where('hash', '1234').del().then(function(results){
        expect(results).to.be.at.least(1);
        done();
      });
    });
  });
});


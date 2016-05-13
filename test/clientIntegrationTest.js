const mocha = require('mocha');
const chai = require('chai');
const requestP = require('request-promise');
const pgp = require('pg-promise')({});
const expect = chai.expect;
const assert = chai.assert;
const summCtrl = require('../server/controllers/summaryController.js');

/* simulate production env for testing */
process.env.NODE_ENV = 'production';
process.env.testing = 'true';
const app = require('../server/server');

describe('Client Integration Tests', () => {
  // just describe needed vars
  var server, port;
  var client = pgp({
    connectionString: process.env.PG_CONNECTION_STRING,
  });

  // stuff we need to keep track of
  var hash = null;
  var userID = null;
  var appID = null;
  var serverID = null;
  var lbID = null;
  // describe setup
  before((next) => {
    // creating listener with random port
    server = app.listen(() => {
      // store port when its ready
      port = server.address().port;

      // setup db connection
      client.connect()
        .then(() => {
          return client.query('DELETE FROM "clientServers" WHERE ip = ${ip};' +
            'DELETE FROM "clientApps" WHERE "appname" = ${appname};' +
            'DELETE FROM "users" WHERE "username" = ${username}', {
              ip: '127.0.0.1',
              appname: 'testapp',
              username: 'testuser',
            });
        })
        .then(() => {
          // don't really care about the result
          next();
        })
        .catch((error) => {
          console.log('ERROR: Failed in setting up database connection.', error);
        });
    });
  });

  // tests
  it('should return a hash when registering', (done) => {
    // do a simple request to /api/some
    requestP({
      method: 'POST',
      uri: 'http://localhost:' + port + '/stats/register',
      json: true,
      body: {
        username: 'testuser',
        ip: '127.0.0.1',
        hostname: 'testhost',
        appname: 'testapp',
        port: 8080,
      },
    })
      .then((response) => {
        expect(response).to.exist;
        hash = response;
        done();
      })
      .catch((error) => {
        expect(error).to.not.exist;
        done();
      });
  });

  it('should find an entry for the user', (done) => {
    client.one('SELECT * FROM "users" WHERE "username" = ${username}', { username: 'testuser' })
      .then((result) => {
        expect(result).to.exist;
        expect(result.username).to.equal('testuser');
        userID = result.id;
        done();
      })
      .catch((error) => {
        console.log(error);
        expect(error).to.not.exist;
        done();
      });
  });

  it('should find an entry for the server', (done) => {
    client.one('SELECT * FROM "clientServers" WHERE "ip" = ${ip}', { ip: '127.0.0.1' })
      .then((result) => {
        expect(result).to.exist;
        expect(result.ip).to.equal('127.0.0.1');
        expect(result.hostname).to.equal('testhost');
        serverID = result.id;
        done();
      })
      .catch((error) => {
        console.log(error);
        expect(error).to.not.exist;
        done();
      });
  });

  it('should find an entry for the app', (done) => {
    client.one('SELECT * FROM "clientApps" WHERE "appname" = ${appname}', { appname: 'testapp' })
      .then((result) => {
        expect(result).to.exist;
        expect(result.appname).to.equal('testapp');
        expect(result.port).to.equal(8080);
        appID = result.id;
        done();
      })
      .catch((error) => {
        console.log(error);
        expect(error).to.not.exist;
        done();
      });
  });

  it('should accept statistics POST', (done) => {
    requestP({
      method: 'POST',
      uri: 'http://localhost:' + port + '/stats',
      json: true,
      body: {
        hash: hash,
        token: null,
        statistics: {
          dummyPath: 3,
          dummyPath2: 12,
        },
      },
    })
      .then(() => {
        //DO THING HERE
        done();
      })
      .catch((error) => {
        expect(error).to.not.exist;
        done();
      });
  });

  xit('should accept single server stats POST', (done) => {
    requestP({
      method: 'POST',
      uri: 'http://localhost:' + port + '/getStats/server',
      json: true,
      body: {
        serverId: 1,
        hours: 24,
      },
    })
      .then((response) => {
        expect(response[0].route).to.equal('Total');
        done();
      })
      .catch((error) => {
        console.log(error);
        expect(error).to.not.exist;
        done();
      });
  });

    xit('should accept single app stats POST', (done) => {
    requestP({
      method: 'POST',
      uri: 'http://localhost:' + port + '/getStats/app',
      json: true,
      body: {
        appId: 1,
        hours: 24,
      },
    })
      .then((response) => {
        expect(response[0].route).to.equal('Total');
        done();
      })
      .catch((error) => {
        console.log(error);
        expect(error).to.not.exist;
        done();
      });
  });

  it('should store statistics in stats table 1', (done) => {
    client.query('SELECT * FROM "stats" WHERE "clientApps_id" = ${appID} AND "clientServers_id" = ${serverID} AND "statName" = ${statName}',
      { appID: appID, serverID: serverID, statName: 'dummyPath' })
      .then((result) => {
        expect(result).to.have.length(1);
        expect(result[0].statName).to.equal('dummyPath');
        expect(result[0].statValue).to.equal(3);
        done();
      })
      .catch((error) => {
        expect(error).to.not.exist;
        done();
      });
  });

  it('should store statistics in stats table 2', (done) => {
    client.query('SELECT * FROM "stats" WHERE "clientApps_id" = ${appID} AND "clientServers_id" = ${serverID} AND "statName" = ${statName}',
      { appID: appID, serverID: serverID, statName: 'dummyPath2' })
      .then((result) => {
        expect(result).to.have.length(1);
        expect(result[0].statName).to.equal('dummyPath2');
        expect(result[0].statValue).to.equal(12);
        done();
      })
      .catch((error) => {
        expect(error).to.not.exist;
        done();
      });
  });

  it('should get app data for user', (done) => {
    requestP({
      method: 'GET',
      uri: 'http://localhost:' + port + '/user/userapps?id=' + userID,
      json: true,
    })
      .then((response) => {
        expect(response[0].appname).to.equal('testapp');
        done();
      })
      .catch((error) => {
        expect(error).to.not.exist;
        done();
      });
  });

  it('should get server data for user', (done) => {
    requestP({
      method: 'GET',
      uri: 'http://localhost:' + port + '/user/userservers?id=' + userID,
      json: true,
    })
      .then((response) => {
        expect(response[0].ip).to.equal('127.0.0.1');
        done();
      })
      .catch((error) => {
        expect(error).to.not.exist;
        done();
      });
  });

  it('should post user credentials', (done) => {
    requestP({
      method: 'POST',
      uri: 'http://localhost:' + port + '/user/usercreds',
      json: true,
      body: {
        id: userID,
        platform: 'Donald Trump',
        value: 'Make America Great Again',
      },
    })
      .then(() => {
        client.query('SELECT * FROM "serviceCreds" WHERE "users_id" = ' + userID)
          .then((result) => {
            expect(result[0].value).to.equal('Make America Great Again');
            done();
          })
          .catch((error) => {
            expect(error).to.not.exist;
            done();
          });
      })
      .catch((error) => {
        expect(error).to.not.exist;
        done();
      });
  });

  it('should get user credentials', (done) => {
    requestP({
      method: 'GET',
      uri: 'http://localhost:' + port + '/user/usercreds?id=' + userID,
      json: true,
    })
      .then((response) => {
        expect(response[0].value).to.equal('Make America Great Again');
        done();
      })
      .catch((error) => {
        expect(error).to.not.exist;
        done();
      });
  });

  it('should get init data', (done) => {
    requestP({
      method: 'GET',
      uri: 'http://localhost:' + port + '/user/init',
      json: true,
    })
      .then((response) => {
        expect(response).to.be.an.Object;
        expect(response.servers).to.be.an.Array;
        expect(response.apps).to.be.an.Array;
        done();
      })
      .catch((error) => {
        expect(error).to.not.exist;
        done();
      });
  });

  it('should add a load balancer', (done) => {
    requestP({
      method: 'POST',
      uri: 'http://localhost:' + port + '/nginx/balancers',
      json: true,
      body: {
        ip: '1.1.1.1',
        port: '1337',
        zone: 'MAGA',
        owner: userID,
      },
    })
      .then(() => {
        client.query('SELECT * FROM "loadbalancers" WHERE "users_id" = ' + userID)
          .then((result) => {
            expect(result[0].zone).to.equal('MAGA');
            lbID = result[0].id;
            done();
          })
          .catch((error) => {
            expect(error).to.not.exist;
            done();
          });
      })
      .catch((error) => {
        expect(error).to.not.exist;
        done();
      });
  });

  it('should add a slave to balancer', (done) => {
    requestP({
      method: 'POST',
      uri: 'http://localhost:' + port + '/nginx/slaves',
      json: true,
      body: {
        id: serverID,
        master: lbID,
      },
    })
      .then(() => {
        client.query('SELECT * FROM "clientServers" WHERE "id" = ' + serverID)
          .then((result) => {
            expect(result[0].master).to.equal(lbID);
            done();
          })
          .catch((error) => {
            expect(error).to.not.exist;
            done();
          });
      })
      .catch((error) => {
        expect(error).to.not.exist;
        done();
      });
  });

  it('should remove a load balancer', (done) => {
    requestP({
      method: 'DELETE',
      uri: 'http://localhost:' + port + '/nginx/balancers',
      json: true,
      body: {
        id: lbID,
      },
    })
      .then(() => {
        client.query('SELECT * FROM "loadbalancers" WHERE "users_id" = ' + userID)
          .then((result) => {
            expect(result.length).to.equal(0);
            client.query('SELECT * FROM "clientServers" WHERE "users_id" = ' + userID)
              .then((res) => {
                expect(res[0].master).to.equal(null);
                done();
              })
              .catch((err) => {
                expect(err).to.not.exist;
                done();
              });
          })
          .catch((error) => {
            expect(error).to.not.exist;
            done();
          });
      })
      .catch((error) => {
        expect(error).to.not.exist;
        done();
      });
  });


  it('should retreive list of servers ids from DB', (done) => {
    summCtrl.getAllServerIds((idArr) => {
      expect(idArr).to.be.an.Array;
      expect(idArr.length).to.not.equal(0);
      done();
    });
  });

  it('should retreive list of app ids from DB', (done) => {
    summCtrl.getAllAppIds((idArr) => {
      expect(idArr).to.be.an.Array;
      expect(idArr.length).to.not.equal(0);
      done();
    });
  });
  
  // teardown
  after('Destory temp items', () => {
    // stop listening that port
    client.query('DELETE FROM "clientServers" WHERE ip = ${ip};' +
      'DELETE FROM "clientApps" WHERE "appname" = ${appname};' +
      'DELETE FROM "users" WHERE "username" = ${username}' +
      'DELETE FROM "serviceCreds" WHERE "users_id" = ${id}' +
      'DELETE FROM "loadbalancers" WHERE "users_id" = ${id}',
      {
        ip: '127.0.0.1',
        appname: 'testapp',
        username: 'testuser',
        id: userID,
      });
    server.close();
  });
});

const mocha = require('mocha');
const chai = require('chai');
const requestP = require('request-promise');
const pgp = require('pg-promise')({});
const nock = require('nock');
const internalTasks = require('../server/controllers/internal_tasks');
const expect = chai.expect;
const assert = chai.assert;

let list_all_servers = JSON.stringify({
  "droplets": [
    {
      "id": 14839098,
      "name": "ubuntu-512mb-sfo1-01",
      "memory": 512,
      "vcpus": 1,
      "disk": 20,
      "locked": false,
      "status": "active",
      "kernel": null,
      "created_at": "2016-05-07T02:14:04Z",
      "features": [
        "virtio"
      ],
      "backup_ids": [],
      "next_backup_window": null,
      "snapshot_ids": [],
      "image": {
        "id": 17154032,
        "name": "14.04.4 x64",
        "distribution": "Ubuntu",
        "slug": "ubuntu-14-04-x64",
        "public": true,
        "regions": [
          "nyc1",
          "sfo1",
          "nyc2",
          "ams2",
          "sgp1",
          "lon1",
          "nyc3",
          "ams3",
          "fra1",
          "tor1",
          "sfo2"
        ],
        "created_at": "2016-05-04T22:25:47Z",
        "min_disk_size": 20,
        "type": "snapshot",
        "size_gigabytes": 19.68
      },
      "drives": [],
      "size": {
        "slug": "512mb",
        "memory": 512,
        "vcpus": 1,
        "disk": 20,
        "transfer": 1,
        "price_monthly": 5,
        "price_hourly": 0.00744,
        "regions": [
          "ams1",
          "ams2",
          "ams3",
          "fra1",
          "lon1",
          "nyc1",
          "nyc2",
          "nyc3",
          "sfo1",
          "sgp1",
          "tor1"
        ],
        "available": true
      },
      "size_slug": "512mb",
      "networks": {
        "v4": [
          {
            "ip_address": "127.0.0.1",
            "netmask": "255.255.255.0",
            "gateway": "192.241.217.1",
            "type": "public"
          }
        ],
        "v6": []
      },
      "region": {
        "name": "San Francisco 1",
        "slug": "sfo1",
        "sizes": [
          "32gb",
          "16gb",
          "2gb",
          "1gb",
          "4gb",
          "8gb",
          "512mb",
          "64gb",
          "48gb"
        ],
        "features": [
          "private_networking",
          "backups",
          "ipv6",
          "metadata"
        ],
        "available": true
      },
      "tags": []
    }
  ],
  "links": {},
  "meta": {
    "total": 1
  }
});

/* simulate production env for testing */
process.env.NODE_ENV = 'production';

describe('Internal Tasks Tests', () => {
  // just describe needed vars
  let userID = null;
  let credID = null;
  let client = pgp({
    connectionString: process.env.PG_CONNECTION_STRING,
  });

  // describe setup
  before((next) => {

    // setup db connection
    client.connect()
      .then((result) => {
        return client.query('DELETE FROM "clientServers" WHERE ip = ${ip};' +
          'DELETE FROM "clientApps" WHERE "appname" = ${appname};' +
          'DELETE FROM "users" WHERE "username" = ${username};' +
          'DELETE FROM "serviceCreds" WHERE "value" = ${value};' +
          'DELETE FROM "loadbalancers" WHERE "ip" = ${lbip}', {
            ip: '127.0.0.1',
            appname: 'testapp',
            username: 'testuser',
            value: 'mydigitaltoken',
            lbip: '127.0.0.2',
          });
      })
      .then((result) => {
        return client.query('INSERT INTO "users" ("username") VALUES(${username}) RETURNING id;', {
          username: 'testuser',
        });
      })
      .then((result) => {
        userID = result[0].id;
        next();
      })
      .catch((error) => {
        console.log('ERROR: Failed in setting up database connection.', error);
      });
  });

  // tests
  it('should associate servers with platforms', (done) => {
    let digitalOcean = nock('https://api.digitalocean.com')
      .get('/v2/droplets')
      .reply(200, list_all_servers);

    client.query('INSERT INTO "serviceCreds" ("users_id", "platform", "value") VALUES(${users_id}, ${platform}, ${value}) RETURNING id', {
      users_id: userID,
      platform: 'digital_ocean',
      value: 'mydigitaltoken'
    })
      .then((result) => {
        credID = result[0].id;
        return client.query('INSERT INTO "clientServers" ("users_id", "ip", "hostname") VALUES(${users_id}, ${ip}, ${hostname})', {
          users_id: userID,
          ip: '127.0.0.1',
          hostname: 'testhost'
        });
      })
      .then((result) => {
        return internalTasks.syncServersToPlatforms(userID);
      })
      .then((result) => {
        //don't care about result
        return client.query('SELECT * FROM "clientServers" WHERE ip = ${ip}', {
          ip: '127.0.0.1'
        });
      })
      .then((result) => {
        expect(result).to.exist;
        expect(result).to.have.length(1);
        expect(result[0].platform).to.equal('digital_ocean');
        expect(result[0].serviceCreds_id).to.equal(credID);
        done();
      })
      .catch((error) => {
        console.log(error);
        expect(error).to.not.exist;
        done();
      });
  });


  it('should associate servers with load balancer', (done) => {
    let lbid = null;
    let lb = nock('http://127.0.0.2:8080')
      .get('/upstream_conf')
      .query({
        upstream: 'testzone',
        verbose: ''
      })
      .reply(200, 'server 127.0.0.1:4568; # id=0\n');

    client.query('INSERT INTO "loadbalancers" ("users_id", "ip", "port", "zone") VALUES(${users_id}, ${ip}, ${port}, ${zone}) RETURNING id', {
      users_id: userID,
      ip: '127.0.0.2',
      port: 8080,
      zone: 'testzone'
    })
      .then((result) => {
        lbid = result[0].id;
        return internalTasks.syncServersToLB(userID);
      })
      .then((result) => {
        return client.query('SELECT * FROM "clientServers" WHERE "ip" = ${ip}', {ip: '127.0.0.1'});
      })
      .then((result) => {
        expect(result).to.exist;
        expect(result).to.have.length(1);
        expect(result[0].master).to.equal(lbid);
        done();
      })
      .catch((error) => {
        console.log(error);
        done();
      });
  });
});
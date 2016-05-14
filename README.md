# DJ Deploy
![Travis Build Image](https://travis-ci.org/supportivesantas/project-ipsum.svg?branch=master)

## Table of Contents
1. [Team](#team)
2. [Usage](#usage)
  2.1 [Basic Installation](#basic-intallation)  
  2.2 [Auto Scaling](#auto-scaling) 
3. [Development](#development)
  3.1. [Requirements](#requirements)
  3.2. [Installing Dependencies](#installing-dependencies)
  3.3. [Getting Started](#getting-started) 
  3.4. [Requirements](#requirements)
4. [Contributing](#contributing)
5. [License](https://github.com/supportivesantas/project-ipsum/blob/master/LICENSE.md)

## Team
  - __Product Owner__: [Jonathan Mah](https://github.com/zelifus)
  - __Scrum Master__: [Rane Gridley](https://github.com/ranebo)
  - __Development Team Members__: [Matt Bresnan](https://github.com/mbresnan1701), [Roland Fung](https://github.com/rolandfung)


## Usage

### Basic installation
DJ Deploy runs as middleware in your Express application. Follow these steps get started.

1. To install, run: `npm install --save dj-deploy`
2. Configure your application information, using `sample.js` as an example. You MUST use the same Github handle you plan to use to login with to see your application in the web app.
3. Import our middleware from `lib/libstats.js` and drop it into the routes you want to monitor in your application. For example, to use on all routes:

```
var express = require('express');
var libstats = require('./lib/libstats');
var app = express();

app.use(libstats.initClient(app, {
  username: 'zelifus',     /* your github username                  */
  name: 'test',            /* your app name                         */
  port: 8080,              /* your app port number                  */
  interval: 600000,        /* suggested reporting interval: 10 min) */
  url: 'http://djdeploy.com/stats'
}));
```

If you only intend to use DJ Deploy for monitoring, you're all done! Log into www.DJDeploy.com with the same Github credentials to see traffic information. The middlware will register your application with us automatically.

### Auto-Scaling
If you have your application running on a Nginx load balancer, DJ Deploy can auto-scale your application based on custom triggers. DJ Deploy's autoscaling is supported on the following platforms: DigitalOcean.

#### How it works
DJ Deploy continually compares the traffic information to the scaling thresholds set for that application. When triggered, DJ Deploy will call on the platform API to spin up or destroy servers on your behalf, then instruct your Nginx load balancer to add it as a slave.

#### Enabling auto-scale
1. Create a new API token for us to use. From the DigitalOcean homepage, for example, you can do this from 'API > Generate New Token'.
3. Add this token to your profile at www.DJDeploy.com
2. Create a snapshot image of your DJ Deploy'ed application for us to use. From a DigitalOcean droplet page, for example, this can be done from 'Snapshots' in the droplet's menu.
4. At www.DJDeploy.com, you will see a list of images you created. Match the correct one to your application.
5. Set scaling thresholds and specify the max number of servers. You're done! We'll let you know when a scaling operation is performed via your Github email.




## Development

### Requirements
- Node 5.x
- Redis 3.x
- Postgresql 9.5.x
- **Nginx+ load balanced system to run scaling features**

### Installing Dependencies
Run `npm install` from the root directory.

### Getting Started
- Start the web server with `npm start`
- Redis: This application uses Redis for session persistence. 
    - Run `brew install redis` to install
    - Run `redis-server` to start the serve
  
### Example Data and Application
- Generate example traffic data:
```
node seed_data/index.js EXAMPLE_USER_NAME
```
- Generate example summary data:
```
node server/summaries/generateSummaries.js
```
- You can run a sample user application to start sending data to your DJ Deploy instance by running the following file
``` 
node middleware/sample.js
```
- Set the correct environment variables:
```
export PG_CONNECTION_STRING=postgres://localhost
export GITHUB_CLIENT_SECRET=YOUR_SECRET_HERE
export MAILGUN_SECRET=YOUR_SECRET_HERE
```

### Testing
Run the test Mocha-Chai suite with `npm test`





## Application Architecture ##

```
  +----------------+                             +---------------------------+
  | User interface |    Credentials, commands    |                           |
  | * add app (LB) +----------------------------->                           |
  | * add creds    |                             |                           |
  | * see stats    |Email and text notifications |                           |
  |                <-----------------------------+                           |
  +----------------+                             |         DJ Deploy         |
  +----------------+                             |                           |
  |                |                             | *collect stats            |
  | Redis Session  +-----------------------------> *prepare summaries        |
  |     Store      |    Github OAuth2 based      | *associate LB to ser^ers  |
  |                |   session authentication    | *command LB and platform  |
  |                <-----------------------------+  apis                     |
  +----------------+     Platform API calls      |                           |
  +----------------+                             |                           |
  |                |                             |                           |
  |   PostgreSQL   +----------------------------->                           |
  |                |    User and application     |                           |
  |                |       traffic data          |                           |
  |                <-----------------------------+                           |
  +----------------^                             |                           |
                     Platform API calls          |                           |
   +---------------------------------------------+                           |
   |  +------------------------------------------>                           |
   |  |             Droplet and image info       +-----------^-+----^--------+
   |  |                                                      | |    |
   |  |                                                      | |    |
+--v--+--------+   +-----------------------+                 | |    |
|              |   |                       |                 | |    |
|  Deployment  |   |                       |                 | |    |
| Platform API |   |         NGINX         |                 | |    |
|              |   |     Load Balancer     |   Load balance  | |    |
+--+-----------+   |                       |   configuration | |    |
   |               |                       +-----------------+ |    |
   |               |                       <-------------------+    |
   |               |                       |    Unhook/hookup       |
   |               |                       |   new app servers      |
   |               +---------+-+-+---------+                        |
   |                         | | |                                  |
   | Create/destroy          | | |    Route web                     |
   | droplet from            | | |    Traffic                       |
   | an image                | | |                                  |
   |                  +------v-v-v-------+                          |
   |                  |                  |                          |
   |                  |                  |                          |
   |                  |   Droplet 1      |                          |
   |                  |   ...            +--------------------------+
   |                  |   Droplet n      |   Traffic information
   +--------------------> Droplet n+1    |
                      |                  |
                      |                  |
                      +------------------+


```



## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

### License
See [License](https://github.com/supportivesantas/project-ipsum/blob/master/LICENSE)




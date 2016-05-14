# DJ Deploy
![Travis Build Image](https://travis-ci.org/supportivesantas/project-ipsum.svg?branch=master)

## Table of Contents
1. [Team](#team)
2. [Usage](#usage)
  2.1 [Install Middleware](#installing-middleware)  
  2.2 [Register Your App](#register-your-app)
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

### Installing Middleware

### Register Your App 



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
- Start a sample user application with the following command, after changing the appropriate fields in middleware/sample.js
``` 
node middleware/sample.js
```

### Testing
Run the test Mocha-Chai suite with `npm test`





## Application Architecture ##

<!-- View the project roadmap [here](LINK_TO_PROJECT_ISSUES) -->
```
                                                 +---------------------------+
                                                 |                           |
  +----------------+                             |         DJ Deploy         |
  | User interface |    Credentials, commands    |                           |
  | * add app (LB) +-----------------------------> *collect stats            |
  | * add creds    |                             | *prepare summaries        |
  | * see stats    |     Alerts, metrics         | *associate LB to servers  |
  |                <-----------------------------+ *command LB and platform  |
  +----------------+                             |  apis                     |
                                                 |                           |
  +-----------------+                            |                           |
  |                 |      Requested Data        |                           |
  |   PostgreSQL    +---------------------------->                           |
  |                 |                            |                           |
  |                 |       Compiled Data        |                           |
  |                 <----------------------------+                           |
  +-----------------^                            |                           |
                                                 |                           |
                           Instructions          |                           |
   +---------------------------------------------+                           |
   |                                             +-------------+----^--------+
   |                                                           |    |
   |                                                           |    |
+--v-----------+   +-----------------------+                   |    |
|              |   |                       |                   |    |
|  Deployment  |   |                       |                   |    |
| Platform API |   |  nginx load balancer  |                   |    |
|              |   |                       |                   |    |
+--+-----------+   |                       |                   |    |
   |               |                       |                   |    |
   |               |                       <-------------------+    |
   |               |                       |  Nginx API calls       |
   |               |                       |  * Add/del from LB     |
   |               +-----------+-----------+                        |
   |                           |                                    |
   | Create/destroy            | Route web                          |
   | droplet from              | Traffic                            |
   | an image                  |                                    |
   |                  +--------v---------+                          |
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




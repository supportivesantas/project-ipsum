# Project Name

## Team

  - __Product Owner__: Jonathan Mah
  - __Scrum Master__: Rane Gridley
  - __Development Team Members__: Matt Bresnan, Roland Fung

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

> Some usage instructions

## Requirements

- Node 0.10.x
- Redis 2.6.x
- Postgresql 9.1.x
- etc
- etc

## Development

### Installing Dependencies

From within the root directory:

`npm install
`

### Testing
`npm test`

### Roadmap

View the project roadmap [here](LINK_TO_PROJECT_ISSUES)
```
                                                 +---------------------------+
                                                 |                           |
  +----------------+                             |      PROJECT IPSUM        |
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
|  Deployment  |   |                       |                   |    |
| Platform API |   |                       |                   |    |
|(DigitalOcean)|   |  nginx load balancer  |                   |    |
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

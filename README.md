# Project Name

> Pithy project description

## Team

  - __Product Owner__: teamMember
  - __Scrum Master__: teamMember
  - __Development Team Members__: teamMember, teamMember

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

```sh
sudo npm install -g bower
npm install
bower install
```

### Roadmap

View the project roadmap [here](LINK_TO_PROJECT_ISSUES)
```
                                                 +--------------------+
                                                 |                    |
  +----------------+  Preferences, credentials,  |                    |
  |                |  commands                   |  OUR AWESOME APP   |
  |     User       +-----------------------------+                    |
  |   Dashboard    |                             |                    |
  |                |     Alerts, metrics         |                    |
  |                <-----------------------------+                    |
  +----------------+                             |                    |
                                                 |                    |
  +-----------------+                            |                    |
  |                 |      Requested Data        |                    |
  |   PostgreSQL    +---------------------------->                    |
  |                 |                            |                    |
  |   Users, Apps   |       Compiled Data        |                    |
  |                 <----------------------------+                    |
  +-----------------^                            |                    |
                                                 |     Controller     |
                           Instructions          |      DOProxy       |
        +----------------------------------------+                    |
        |                                        +-------------^----^-+
        |                                                      |    |
        |                                                      |    |
+-------v------+   +-----------------------+                   |    |
|              |   |                       |                   |    |
| DigitalOcean |   |                       |                   |    |
|      API     |   |        HAProxy        |                   |    |
|              |   |                       |                   |    |
+-------+------+   |     Load Balancer     |                   |    |
        |          |                       |                   |    |
        |          |                       +-------------------+    |
        |          |                       |  Routing info          |
        |          |                       |                        |
        |          +-----------+-----------+                        |
        |                      |                                    |
        | Add or               | Route web                          |
        | Delete               | Traffic                            |
        |                      |                                    |
        |             +--------v---------+                          |
        |             |                  |                          |
        |             |                  |                          |
        |             |   Droplet 1      |                          |
        |             |   ...            +--------------------------+
        |             |   Droplet n      |    Droplet info
        +---------------> Droplet n+1    |
                      |                  |
                      |                  |
                      +------------------+
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

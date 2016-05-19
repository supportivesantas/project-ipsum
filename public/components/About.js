import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import NavigationBarLogin from './NavigationBarLogin.js';
import { Grid, Col, Row, Jumbotron, Image, PageHeader, Modal, Button } from 'react-bootstrap';

var teamMembers = [
  {
    name: 'Matt Bresnan',
    imageUrl: 'https://avatars0.githubusercontent.com/u/15022604?v=3&s=460',
    githubUrl: 'https://github.com/mbresnan1701'
  },
  {
    name: 'Rane Grildley',
    imageUrl: 'https://avatars1.githubusercontent.com/u/15720430?v=3&s=460',
    githubUrl: 'https://github.com/ranebo'
  },
  {
    name: 'Jonathan Mah',
    imageUrl: 'https://avatars0.githubusercontent.com/u/9397100?v=3&s=460',
    githubUrl: 'https://github.com/zelifus'
  },
  {
    name: 'Roland Fung',
    imageUrl: 'https://avatars2.githubusercontent.com/u/16583445?v=3&s=460',
    githubUrl: 'https://github.com/rolandfung'
  }
]

export default class About extends React.Component {

  constructor(props) {
    super(props);
    this.state = {showModal: false};
  }

  close() {
     this.setState({ showModal: false });
   }

   open() {
     this.setState({ showModal: true });
   }

  render() {
    return (
      <Grid>
      <Row>
      <Col>
        <NavigationBarLogin />
      </Col>
      </Row>

      <Row>      
      <Col md={12}>
        <PageHeader>About <small>DJ Deploy</small></PageHeader>
      </Col>
      </Row>

      <Row>      
      <Col md={6}>
        <h2>How it works</h2>
        <h3>Overview</h3>
        <p>The core of DJ Deploy runs as middleware in your Express application. Simply 
        install it with <code>npm install lib-dj-deploy</code>, set it up on a 
        route you want to monitor, and login at www.djdeploy.com to see the data in a quick and
        and easy to read format. Sub-select data by route, server or app,, and check server statuses. See
        the Readme at the repo for <a href="https://github.com/supportivesantas/project-ipsum">details</a>.</p>
        
        <p>Other convenient features include text and email alerts if we detect an abnormal event.</p>

        <h3>Advanced Features</h3>
        <p>DJ Deploy can also be configured as a no-frills auto-scaling tool for your 
        Nginx load balanced deployments* on select platforms (currently only DigitalOcean).</p>
        <p>Our service compares the traffic to the scaling thresholds 
        you set for a particular application. When triggered, DJ Deploy will call on the platform API 
        to spin up or destroy servers on your behalf, then instruct your load balancer
        to make the appropriate update. Check out the <a href="https://github.com/supportivesantas/project-ipsum">repo</a> for details.</p>
        <p><small>* Currently requires the use of NginxPlus</small></p>
        <h2>Security</h2>
        <p>Security is a top priority at DJ Deploy. We know you trust us with your data and API tokens. 
        All and web traffic and authentication is sent over a secure HTTPS channel.</p>
      </Col>



      <Col md={6} className='team-member'>

      <Image width="400" responsive src="/assets/img/architecture.png" thumbnail />
      <Button
        style={{marginTop: '1em'}}
        bsStyle="primary"
        bsSize="medium"
        onClick={this.open.bind(this)}> 
          Expand
      </Button>
      
        <Modal bsSize="large" show={this.state.showModal} onHide={this.close.bind(this)}>
        <Modal.Header closeButton>
        <Modal.Title>DJ Deploy Architecture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Image responsive src="/assets/img/architecture.png" thumbnail />
        </Modal.Body>
        <Modal.Footer>
        <Button onClick={this.close.bind(this)}>Close</Button>
        </Modal.Footer>
        </Modal>

      </Col>
      </Row>

      <Row>
      <Col md={12} > 
      <hr />
        <h2>Development Team</h2>
        <Grid fluid>
          <Row>
          {
            teamMembers.map( (person, i) => {
              return (
                <Col key={i} className="team-member" xs={6} md={3} style={{marginBottom: '1em', display: 'flex', alignItems: 'center', justifyContent: 'space-around', alignContent: 'center'}}>
                  <Image width="130" src={person.imageUrl} responsive circle /><br />
                  <p><a href={person.githubUrl}>{person.name}</a></p>
                </Col>
              )
            })
          }
          </Row>
        </Grid> 
      </Col>
      </Row>

      <Row>
        <Col sm={12} md={12} xs={12}>
          <h2> Built On </h2> 
          <div className="technologies">
            <img className='techbadge' src="/assets/badges/react.png"/>
            <img className='techbadge' src="/assets/badges/redux.png"/>
            <img className='techbadge' src="/assets/badges/node.png"/>
            <img className='techbadge' src="/assets/badges/express.png"/>
            <img className='techbadge' src="/assets/badges/psql.png"/>
            <img className='techbadge' src="/assets/badges/redis.png"/>
            <img className='techbadge' src="/assets/badges/docker.png"/>
            <img className='techbadge' src="/assets/badges/nginx.png"/>
          </div>
          <br />
        </Col>
      </Row>

      </Grid>
      ) 
    
  }
}
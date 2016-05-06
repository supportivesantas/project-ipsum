import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import maps from '../mappingFunctions.js';
import { Button, ButtonToolbar, Panel, Col } from 'react-bootstrap';
import _ from 'underscore';

class MainPageAppView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  getNumServers() {
    const appServers = _.filter(this.props.state.servers, (item) => {
      return item.app === this.props.selected.appname;
    });
    const activeServers = _.filter(appServers, (item) => {
      return item.active === 'active';
    });
    return { active: activeServers, total: appServers };
  }

  generateHeader() {
    return (
      <div className="AppViewHeaderText">{this.props.selected.appname} - 3/5 </div>
    );
  }

  render() {
    return (
      <Col xs={12} sm={6} md={6}>
        <div className="MainPageAppView">
          <Panel header={this.generateHeader()}>
            <Panel>
              GRAPH GOES HERE
            </Panel>
            <ButtonToolbar>
              <Button bsSize="xsmall">Graph Option 1</Button>
              <Button bsSize="xsmall">Graph Option 2</Button>
              <Button bsSize="xsmall">Graph Option 3</Button>
            </ButtonToolbar>

            Panel content <br />
            Panel content<br />
            Panel content<br />
            Panel content<br />
            Panel content<br />
          </Panel>
        </div>
      </Col>
    );
  }
}

MainPageAppView = connect(state => ({ state: state }))(MainPageAppView);
export default MainPageAppView;

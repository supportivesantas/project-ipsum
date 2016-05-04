import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import maps from '../mappingFunctions.js';
import { Button, ButtonToolbar, Panel, Col } from 'react-bootstrap';

class MainPageAppView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  generateHeader() {
    return (
      <div className="AppViewHeaderText">DONALD TRUMP - {this.props.selected.id} - 3/5 </div>

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

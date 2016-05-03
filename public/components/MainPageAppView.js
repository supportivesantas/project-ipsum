import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import maps from '../mappingFunctions.js';
import { Panel, Col } from 'react-bootstrap';

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
      <div className="MainPageAppView">
        <Col xs={10} xsOffset={1} >
          <Panel header={this.generateHeader()}>
            Panel content <br />
            Panel content<br />
            Panel content<br />
            Panel content<br />
            Panel content<br />
          </Panel>
        </Col>
      </div>
    );
  }
}

MainPageAppView = connect(state => ({ state: state }))(MainPageAppView);
export default MainPageAppView;

import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import { addData, renderChart } from '../D3graphTemplate';
// import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


class MyServer extends React.Component {
  constructor(props) {
    super(props);
    this.setInt = null;
    this.state = {
    };
  }

  componentDidMount() {
    this.props.state.graphData.map(graph =>
      renderChart(graph.route)
    );

    var that = this;
    this.setInt = setInterval(function() {
      addData();
      that.props.state.graphData.map(graph => {
        renderChart(graph.route);
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.setInt);
  }

  render() {
    return (
      <div> THIS is the Selected Server Page.
      List of routes graphs goes here.
       {this.props.state.graphData.map(graph =>
          <div>
            <h3>{graph.route}</h3>
            <div id={graph.route} style={{position:'relative'}}>
            </div>
          </div>
        )}
      </div>
    );
  }
}

MyServer = connect(state => ({ state: state }))(MyServer);
export default MyServer;

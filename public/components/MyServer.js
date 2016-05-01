import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import {print, addData, renderChart } from '../D3graphTemplate';
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
      renderChart(graph)
    );

    var that = this;
    this.setInt = setInterval(function() {
      console.log('intervalling');
        addData();
      that.props.state.graphData.map(graph => {
        renderChart(graph);
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
            <h3>{graph}</h3>
            <div id={graph} style={{position:'relative'}}>
            </div>
          </div>
        )}

      </div>
    );
  }
}

        // {this.props.state.graphData.map(graph =>
        //   {setTimeout(function(){
        //     renderChart(graph)
        //   }, 50)}
        // )}
MyServer = connect(state => ({ state: state }))(MyServer);
export default MyServer;

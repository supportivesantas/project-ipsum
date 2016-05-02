import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


const selectRowProp = {
  mode: 'checkbox',  //checkbox for multi select, radio for single select.
  clickToSelect: true,   //click row will trigger a selection on that row.
  bgColor: 'rgb(238, 193, 213)',  //selected row background color
};

class AllServers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  getSelectedRowKeys() {
    console.log(this.refs.table.state.selectedRowKeys);
  }

  addServer(e) {
    e.preventDefault();
    this.props.dispatch(actions.ADD_SERVER('6.6.6.6', 'Azure', 'CoolAppThingy', 'True'));
  }

  removeServers(servArr) {

  }

  render() {
    return (
      <div>

        <button type="submit" onClick={this.addServer.bind(this)} > Add a server </button>
        <button onClick={this.getSelectedRowKeys.bind(this)}>Get selected row keys</button>

        <BootstrapTable ref='table' data={this.props.state.servers} striped={true} hover={true}   selectRow={selectRowProp} search={true}>
          <TableHeaderColumn dataField="id" isKey={true} dataAlign="center" dataSort={true}>Server ID</TableHeaderColumn>
          <TableHeaderColumn dataField="ip" dataAlign="center" dataSort={true}>Server IP</TableHeaderColumn>
          <TableHeaderColumn dataField="platform" dataSort={true}>Platform</TableHeaderColumn>
          <TableHeaderColumn dataField="app" dataSort={true}>Application</TableHeaderColumn>
          <TableHeaderColumn dataField="active" dataSort={true}>Active?</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}


AllServers = connect(state => ({ state: state }))(AllServers);
export default AllServers;

import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import request from '../util/restHelpers.js';
import { Button, Col, ControlLabel, FormControl, FormGroup, Grid, Panel, Row } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

class Tokens extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      platform: 'digital_ocean',
      value: '',
      showError: false
    };

    this.cellEditProp = {
      mode: 'click',
      blurToSave: false,
      afterSaveCell: this.onAfterSaveCell
    };

    this.selectRowProp = {
      mode: 'checkbox',
      clickToSelect: true
    };

    this.options = {
      afterDeleteRow: this.afterDeleteRow
    };
  }

  componentDidMount() {
    this.getCredentials();
  }

  getCredentials() {
    request.get('/user/usercreds',
      (err, res) => {
        if (err) { console.log('Error getting tokens', err); }
        if (!res.body) { return; }
        this.props.dispatch(actions.POPULATE_TOKENS(res.body));
      });
  }

  onAfterSaveCell(row, cellName, cellValue) {
    request.put('/user/usercreds',
      row,
      (err, res) => {
        console.log(res);
        if (err) { console.log('Error putting token', err); }
      });
  }

  afterDeleteRow(rowKeys) {
    request.del('/user/usercreds',
      { ids: rowKeys },
      (err, res) => {
        if (err) { console.log('Error putting token', err); }
      });
  }

  getValidationState() {
    return true;
  }

  processNewToken(e) {
    e.preventDefault();
    if (!this.state.platform || !this.state.value) {
      console.log('ERROR: No Value for Platform or Token');
      this.setState({
        showError: true
      });

      this.setState({
        showError: false
      });
      return;
    }

    request.post('/user/usercreds',
      {
        platform: this.state.platform,
        value: this.state.value
      },
      (err, res) => {
        if (err) { console.log('Error putting token', err); }
        this.setState({
          showError: false,
          platform: 'digital_ocean',
          value: ''
        });
        this.getCredentials();
      });
  }

  handleSelect(e) {
    this.setState({
      platform: e.target.value
    });
  }

  handleValue(e) {
    this.setState({
      value: e.target.value
    });
  }

  render() {
    return (
      <Grid><Row><Col md={12} xs={12}>
        <Panel header={<h1>Token Management</h1>}>
          <BootstrapTable data={this.props.state.tokens} striped={true} hover={true} cellEdit={this.cellEditProp} options={this.options} deleteRow={true} selectRow={this.selectRowProp}>
            <TableHeaderColumn dataField="id" isKey={true} dataAlign="center" dataSort={true} width="75" editable={false}>ID</TableHeaderColumn>
            <TableHeaderColumn dataField="platform" dataAlign="center" dataSort={true} width="175" editable={{type: "select", options: {values: ['digital_ocean','aws','azure']}}}>Platform</TableHeaderColumn>
            <TableHeaderColumn dataField="value"dataAlign="center" dataSort={true} editable={true}>Token</TableHeaderColumn>
          </BootstrapTable>
          <form>
            <FormGroup>
              <ControlLabel>Attach A New Token {this.state.showError ? 'ERROR: Cannot have empty fields!' : ''}</ControlLabel>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Platform</ControlLabel>
              <FormControl componentClass="select" placeholder="select" onChange={this.handleSelect.bind(this) } value={this.state.platform}>
                <option value="digital_ocean">digital_ocean</option>
                <option value="aws">aws</option>
                <option value="azure">azure</option>
              </FormControl>
              <FormGroup>
                <ControlLabel>Token</ControlLabel>
                <FormControl type="text" placeholder="Enter Token Here" onChange={this.handleValue.bind(this)} value={this.state.value} />
              </FormGroup>
            </FormGroup>
            <Button type="submit" onClick={this.processNewToken.bind(this)}>Submit</Button>
          </form>
        </Panel>
      </Col></Row></Grid>
    );
  }
}

Tokens = connect(state => ({ state: state }))(Tokens);
export default Tokens;

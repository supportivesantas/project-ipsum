import React from 'react';
import ReactDom from 'react-dom';
import actions from '../actions/ipsumActions.js';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import request from '../util/restHelpers';
import _ from 'underscore';
import { Panel, Grid, Row, Col, Clearfix, PageHeader, ListGroup, ListGroupItem } from 'react-bootstrap';
import barGraph from './AllAppsBarGraph'

class MyAppHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterMode: 'total', // 'total', 'route', or 'server'
      filterOptions: [], // an array 
      days: null,
      graphData: null
    };
  }

  graphIt(){
    this.formatGraphData(); 
    if (this.state.graphData) {
      barGraph('historyBargraph', this.state.graphData)
    }
  }

  getData() {
    request.post('/getStats/myAppSummary', {
      userId: 1,
      appId: 1,
      days: 7
    }, (err, resp) => {
      console.log(err, resp)
    // parse the data object for route and server totals
      var data = JSON.parse(resp.text);
      var parsedData = this.parseHistoryResponse(data);
      console.log(data);
      // var parsedData = this.parseHistoryResponse(sampledata);
      // save parsed and formatted data to store
      this.props.dispatch(actions.ADD_MYAPP_HISTORY(parsedData));
    });
  }

  parseHistoryResponse(response) {  
    // make a copy
    var parsed = Object.assign({}, response);
    // collect server names for <Select>
    parsed.serverNames = parsed.Servers.map( Server => {
      return {
        value: Server.server, 
        label: _.findWhere(this.props.state.servers, {id: Number(Server.server)} ).hostname 
      };
    });
    // collect routenames for <Select>
    parsed.routeNames = parsed.Routes.map( Route => {
      return {
        value: Route.route, 
        label: Route.route
      }; 
    });
    // collect dates for Graph
    parsed.dates = parsed.Total.map( Total => Total.date);
    // sort the totals by date
    parsed.Total.sort( (day1, day2) => (day1.date) - (day2.date));
    parsed.Routes.forEach( Route => {
      Route.data.sort( (day1, day2) => (day1.date) - (day2.date));
    });
    parsed['Servers'].forEach( Server => {
      Server.data.sort( (day1, day2) => (day1.date) - (day2.date));
    });
    return parsed;
  }

  formatGraphData() {
    var data = this.props.state.myAppHistory;
    var mode = this.state.filterMode;

    if (mode === 'total') {

      this.setState({graphData: data.Total});
      return;

    } else  {

      if (mode === 'server') {
        var identifier = 'server';
        var raw = this.props.state.myAppHistory.Servers;
      } else {
        var identifier = 'route';
        var raw = this.props.state.myAppHistory.Routes;
      }

      var results = {};

      raw.forEach( item => {
        if (_.findWhere(this.state.filterOptions, {value: item[identifier]}).selected) {
          var days = item.data;
          days.forEach( day => {
            // add the label to the results if not present
            if (!results.hasOwnProperty(day.date)) {
              results[day.date] = {date: day.date, value: 0}
            }
            results[day.date].value += day.value;
          })
        }
      })

      var arr = Object.keys(results).map( key => results[key]);
      arr.sort( (a, b) => {
        return a.date - b.date;
      });

      this.setState({graphData: arr});
    }
  }

  selectDays(event) {
    this.setState({days: event.target.value }, () => this.getData());
  }

  selectFilterMode(event) {
    var filterForm = document.getElementById('filter-options-form');
    if (filterForm) { filterForm.reset(); }

    if (event.target.value === 'server') { this.setState({filterMode: 'server'})}
    else if (event.target.value === 'route') { this.setState({filterMode: 'route'})}
    else { this.setState({filterMode: 'total'})}

    var mode = {
      'route': this.props.state.myAppHistory.routeNames,
      'server': this.props.state.myAppHistory.serverNames
    };

    var options = mode[event.target.value] || [];

    if (options.length) {
      _.each(options, option => option.selected = false );
      this.setState({filterOptions: options});
    } else {
      this.setState({filterOptions: []});
    }
  }

  toggleFilterOption(event) {
    var options = this.state.filterOptions.slice();
    var target = _.findWhere(options, {value: event.target.value});
    if (target) {target.selected = !(target.selected);}
    this.setState({filterOptions: options});
  }

  render() {

    var dayOptions = [
      {'value': 1},
      {'value': 3},
      {'value': 7},
      {'value': 14},
      {'value': 21},
      {'value': 30}
    ];

    return (
      <Row>
      <Col xs={12} md={12}>
      <h2>Look back</h2>
      <Panel header={<h1>Selected History</h1>}>
        <Grid fluid>
        <Row>
          <Col xs={12} md={4}>

            <h3 className="section-heading">How far back?</h3>
            <form id='days-form'>
              {
                dayOptions.map( (option, i) => {
                  return (
                  <div key={i}>
                    <input name="day" type="radio" onChange={this.selectDays.bind(this)} value={option.value}></input> 
                    <label>{option.value} days</label>
                  </div>
                  )
                })
              }
            </form>

            {this.state.days ? (
              <div>
              <h3 className="section-heading">Filter results by:</h3>
              <form id='filter-mode-form'>
                <div><input name="mode" type="radio" onChange={this.selectFilterMode.bind(this)} value='total'></input> <label>None</label></div>
                <div><input name="mode" type="radio" onChange={this.selectFilterMode.bind(this)} value='route'></input> <label>By route(s)</label></div>
                <div><input name="mode" type="radio" onChange={this.selectFilterMode.bind(this)} value='server'></input> <label>By server(s)</label></div>
              </form>
              </div>
              ) : null}

            {this.state.filterOptions.length ? (
              <div>
              <h3 className="section-heading">Options</h3>
                <form id="filter-options-form">
                  {
                    this.state.filterOptions.map( (option, i) => {
                      return (
                      <div key={i}>
                        <input name="option" type="checkbox" onChange={this.toggleFilterOption.bind(this)} value={option.value}></input> 
                        <label>{option.label}</label>
                      </div>
                      )
                    })
                  }
                </form></div>
              ) : null}

            {this.state.filterOptions ? (
            
              <button onClick={this.graphIt.bind(this)}>Graph It</button>

            ) : null}  
           

          </Col>
          <Col xs={12} md={8}>
            <h3>Selected Data</h3>
            <div id='historyBargraph'></div>

          </Col>
        </Row>
        </Grid>
      </Panel>
      </Col>
      </Row>
    )
  }
}

MyAppHistory = connect(state => ({ state: state }))(MyAppHistory);
export default MyAppHistory
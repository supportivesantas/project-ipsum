import React from 'react';
import ReactDom from 'react-dom';
import actions from '../actions/ipsumActions.js';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import request from '../util/restHelpers';
import _ from 'underscore';
import { Panel, Grid, Row, Col, Clearfix, PageHeader, ListGroup, ListGroupItem } from 'react-bootstrap';
import barGraph from './BarGraph';
import RadioGroup from 'react-radio-group';
import CheckboxGroup from 'react-checkbox-group';

var sampledata = {
  "Total": [ 
    {date: 20160508, value: 1234}, 
    {date: 20160509, value: 2846}
  ],
  "Routes": [
    {route: 'route1', data: 
      [{
        "route": "route1",
        "date": 20160509,
        "value": 1158836
      },
      {
        "route": "route1",
        "date": 852016,
        "value": 26213
      }]
    },
    {route: 'route2', data: 
      [{
        "route": "route2",
        "date": 20160509,
        "value": 1158836
      },
      {
        "route": "route2",
        "date": 852016,
        "value": 26213
      }]
    }],
  "Servers": [
    {serverid: 'server1', data: 
      [{
        "serverid": "server1",
        "date": 20160509,
        "value": 1158836
      },
      {
        "serverid": "server1",
        "date": 852016,
        "value": 26213
      }]
    },
    {serverid: 'server2', data: 
      [{
        "serverid": "server2",
        "date": 20160509,
        "value": 1158836
      },
      {
        "serverid": "server2",
        "date": 852016,
        "value": 26213
      }]
    }
  ]
};

class MyAppHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterMode: 'total', // 'total', 'route', or 'server'
      filterOptions: [], // an array 
      days: 7,
      graphData: null
    };
  }

  componentWillMount(){
    this.getData();
  }

  getData() {
    // request.post('/getStats/serverTotalsForApp', {
    //   userid: 1,
    //   appid: 1,
    //   days: 1
    // }, (err, resp) => {
    // parse the data object for route and server totals
      // var data = JSON.parse(resp.text);
      var parsedData = this.parseHistoryResponse(sampledata);
      // save parsed and formatted data to store
      this.props.dispatch(actions.ADD_MYAPP_HISTORY(parsedData));
      this.formatGraphData();
    // });
  }

  componentDidMount() {
    // draw bargraph
  }

  parseHistoryResponse(response) {
    // make a copy
    var parsed = Object.assign({}, response);
    // collect server names for <Select>
    parsed.serverNames = parsed.Servers.map( Server => {return {value: Server.serverid, label: Server.serverid}; });
    // collect routenames for <Select>
    parsed.routeNames = parsed.Routes.map( Route => {return {value: Route.route, label: Route.route}; });
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
        var identifier = 'serverId';
        var raw = this.props.state.myAppHistory.Servers[0].data;
      } else {
        var identifier = 'route';
        var raw = this.props.state.myAppHistory.Routes[0].data;
      }

      var results = {};
      console.log(raw);

      raw.forEach( item => {
        if ( this.state.filterOptions.indexOf(item[identifier]) !== -1 ) { 

          if (!results.hasOwnProperty(item.date)) {
            results[item.date] = {date: item.date};
          }
          var day = results[item.date];
          if (!day.hasOwnProperty(item[identifier])) {
            day[item[identifier]] = 0;
          }
          day[identifier] += item.value;
        }
      })

      this.setState({graphData: results})
    }
  }

  selectDays(event) {
    this.setState({days: event.target.value });

  }

  selectFilterMode(event) {
    // console.log(event.target.value);

    if (event.target.value === 'server') { this.setState({filterMode: 'server'})}
    else if (event.target.value === 'route') { this.setState({filterMode: 'route'})}
    else { this.setState({filterMode: 'total'}, this.getData.bind(this))}

    var mode = {
      'route': this.props.state.myAppHistory.routeNames,
      'server': this.props.state.myAppHistory.serverNames
    };

    var options = mode[event.target.value] || [];
    // console.log(options)

    if (options.length) {
      options.forEach( option => option.selected = false );
      this.setState({filterOptions: options}, this.formatGraphData.bind(this));
    } else {
      this.setState({filterOptions: {}}, this.formatGraphData.bind(this));
    }

    this.formatGraphData();
  }

  toggleFilterOptions(event) {
    var options = Object.assign(this.state.filterOptions);
    var target = _.findWhere(options, {value: event.target.value});
    target.selected = !(target.selected);
    this.setState({filterOptions: options}, this.formatGraphData.bind(this));
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
            <form>
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


            <h3 className="section-heading">Filter results by:</h3>
              <form>
                <div><input name="mode" type="radio" onChange={this.selectFilterMode.bind(this)} value='total'></input> <label>None</label></div>
                <div><input name="mode" type="radio" onChange={this.selectFilterMode.bind(this)} value='route'></input> <label>By route(s)</label></div>
                <div><input name="mode" type="radio" onChange={this.selectFilterMode.bind(this)} value='server'></input> <label>By server(s)</label></div>
              </form>

            {this.state.filterOptions.length ? (
              <div>
              <h3 className="section-heading">Options</h3>
                <form>
                  {
                    this.state.filterOptions.map( (option, i) => {
                      return (
                      <div key={i}>
                        <input name="option" type="checkbox" onChange={this.toggleFilterOptions.bind(this)} value={option.value}></input> 
                        <label>{option.value}</label>
                      </div>
                      )
                    })
                  }
                </form></div>
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
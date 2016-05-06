import React from 'react';

export default class BarGraph extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'd3BarGraph';
  }

  componentDidMount() {
    /* Taken from: https://bost.ocks.org/mike/bar/2/ */
    var data = this.props.data;

    var width = document.querySelector(".barGraph").clientWidth,
      barHeight = 20;
      console.log(width);

    var x = d3.scale.linear()
    .range([0, width]);

    x.domain([0, d3.max(data, function(d) { return d.value; })]);

    var chart = d3.select(".barGraph")
    .attr("width", width);

    var bar = chart.selectAll("g")
      .data(data)
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

    bar.append("rect")
      .attr("width", function(d) { return x(d.value); })
      .attr("height", barHeight - 1);

    bar.append("text")
      .attr("x", function(d) { return x(d.value) - 3; })
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .text(function(d) { return d.label; }); 
  }

  render() {
    return (
        <svg className="barGraph"></svg>   
      );
  }
}

// ensure the data is present before trying to render
BarGraph.propTypes = { data: React.PropTypes.array.isRequired };

import d3 from 'd3';
import d3tip from 'd3-tip';

module.exports = function(divId, data) {

//clear out any current graph/content in the target div
var outerDiv = document.getElementById(divId);
if (outerDiv) { outerDiv.innerHTML = '';}

var margin = {top: 20, right: 20, bottom: 30, left: 60},
    width = document.querySelector("#"+divId).clientWidth - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5);

var svg = d3.select("#" + divId).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tip = d3tip(d3)
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Hits:</strong> <span>" + Number(d.value).toLocaleString() + "</span>";
  })

svg.call(tip);

  x.domain(data.map(function(d) { return d.date.toString().slice(6, 8); }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]);

  svg.append("g")
      .attr("class", "x axisM")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axisM")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("value");

  svg.selectAll(".appsbar")
      .data(data)
    .enter().append("rect")
      .attr("class", "appsbar")
      .attr("x", function(d) { return x(d.date.toString().slice(6, 8)); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

function type(d) {
  d.value = +d.value;
  return d;
}
}

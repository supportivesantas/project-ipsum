export function renderChart(graphId, data) {
  // element.clientWidth to adjust graph size to div
  var m = [20, 80, 20, 80]; // margins
  var w = 700 - m[1] - m[3]; // width
  var h = 400 - m[0] - m[2]; // height

  var maxY = 0;
  var findMaxY = function() {
    for (var i = 0; i < data.length; i++) {
      if (maxY < data[i].hits) {
        maxY = data[i].hits;
      }
    }
  };

  findMaxY(data);
  var x = d3.scale.linear().domain([data[data.length - 1].time, data[0].time ]).range([0, w]);
  var y = d3.scale.linear().domain([0, maxY + 5]).range([h, 0]);
  // create a line function that can convert data into x and y points
  var line = d3.svg.line()
    .x(function(d,i) { return x(d.time); })
    .y(function(d) { return y(d.hits); });

    // Add an SVG element with the desired dimensions and margin.
  var graph = d3.select("#"+graphId).append("svg:svg")
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2])
        .attr("id", graphId)
      .append("svg:g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

  // create yAxis
  var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
  // Add the x-axis.
  graph.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis);


  // create left yAxis
  var yAxisLeft = d3.svg.axis().scale(y).ticks(5).orient("left");
  var yAxisRight = d3.svg.axis().scale(y).ticks(5).orient("right");
  // Add the y-axis to the left
  graph.append("svg:g")
        .attr("class", "y axis")
        // .attr("transform", "translate(-25,0)")
        .call(yAxisLeft);

  // var adjustYright = w + 25; //for formating Y axis
  graph.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + w + " ,0)")
        .call(yAxisRight);

    //append line path after so it shows on top
    graph.append("svg:path").attr("d", line(data));
}

var big = "A BIG"
export function print(name) {
  console.log(big + " HELLO " + name);
};
var dataMain = [{val: 10, time: 0}];
var dataRange = 15;  //From User Config

export function addData(graphId) {
  dataMain.push({
    val: Math.floor(Math.random() + 20 * Math.random()),
    time: dataMain.slice(-1)[0].time + 30
  });
  d3.selectAll('svg').remove();
  var data = dataMain.slice(-1 * dataRange);
  // renderChart(graphId);

};
export function renderChart(graphId) {
  var m = [80, 80, 80, 80]; // margins
  var w = 1000 - m[1] - m[3]; // width
  var h = 400 - m[0] - m[2]; // height

  //var dataMain = [{val: 1, time: 0}];
  // var dataRange = 15;
  var data = dataMain.slice(-1 * dataRange);

  var maxY = 0;
  var findMaxY = function() {
    for (var i = 0; i < data.length; i++) {
      if (maxY < data[i].val) {
        maxY = data[i].val;
      }
    }
  };

  findMaxY(data);
  var x = d3.scale.linear().domain([data[0].time, data[data.length - 1].time]).range([0, w]);
  var y = d3.scale.linear().domain([0, maxY + 5]).range([h, 0]);
  // create a line function that can convert data into x and y points
  var line = d3.svg.line()
    .x(function(d,i) { return x(d.time); })
    .y(function(d) { return y(d.val); });

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
    var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
    // Add the y-axis to the left
    graph.append("svg:g")
          .attr("class", "y axis")
          .attr("transform", "translate(-25,0)")
          .call(yAxisLeft);

      //append line path after so it shows on top
      graph.append("svg:path").attr("d", line(data));
}
//renderChart("graph");

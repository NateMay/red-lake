// https://bl.ocks.org/mbostock/4136647

var n8_indicies = {};
var names = {};

positives.forEach(function (d) {
  n8_indicies[d.id] = d.n8;
  names[d.id] = d.name;
});
negatives.forEach(function (d) {
  n8_indicies[d.id] = d.n8;
  names[d.id] = d.name;
});

var width = 960,
  height = 600;
var color_domain = [
  -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6,
];
var legend_labels = [
  "6",
  "5",
  "4",
  "3",
  "2",
  "1",
  "0",
  "-1",
  "-2",
  "-3",
  "-4",
  "-5",
  "-6",
];

var color = d3.scaleLinear().domain(color_domain).range(red_greens);


var svg6 = d3
  .select("#svg-map2")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .style("margin", "-15px auto");

var defs6 = svg6.select("defs");
var path6 = d3.geoPath();

defs6
  .append("path")
  .attr("id", "nation")
  .attr("d", path6(topojson.feature(usa, usa.objects.nation)));

svg6
  .append("g")
  .attr("class", "county")
  .selectAll("path")
  .data(topojson.feature(usa, usa.objects.counties).features)
  .enter()
  .append("path")
  .attr("d", path6)
  .attr("id", (d) => d.id)
  .style("fill", (d) => color(n8_indicies[d.id]))
  // .on("mouseover", (county) => {
  //   tooltip.style("opacity", 0.9);
  //   tooltip
  //     .text(names[county.id] + ": " + n8_indicies[county.id])
  //     .style("left", d3.event.pageX + "px")
  //     .style("top", d3.event.pageY - 28 + "px");
  // })
  // .on("mouseout", (county) => tooltip.style("opacity", 0));

svg6
  .append("g")
  .attr("class", "county")
  .selectAll("path")
  .data(topojson.feature(usa, usa.objects.states).features)
  .enter()
  .append("path")
  .attr("d", path6)
  .style("stroke-width", 1.5)
  .style("stroke", "#555")
  .style("fill", "transparent")
  .style("pointer-events", "none");

var legend = svg
  .selectAll("g.legend")
  .data(color_domain.map((n) => n - 1))
  .enter()
  .append("g")
  .attr("class", "legend");

var ls_w = 20,
  ls_h = 20;

legend
  .append("rect")
  .attr("x", (_c, i) => 40 + i * ls_w - ls_w)
  .attr("y", 560)
  .attr("width", ls_w)
  .attr("height", ls_h)
  .style("fill", (d) => color(d));

legend
  .append("text")
  .attr("x", (_c, i) => 40 + i * ls_w - ls_w)
  .attr("y", 600)
  .text((_c, i) =>
    i % 2 == 0 ? legend_labels[legend_labels.length - 1 - i] : ""
  );

svg6
  .append("text")
  .attr("x", 20)
  .attr("y", 550)
  .attr("class", "legend_title")
  .text("Natural amenities scale");

svg6
  .append("line")
  .style("stroke", "red")
  .style("stroke-width", 2)
  .style("pointer-events", "none")
  .style("opacity", 0.8)
  .attr("x1", "51.3%")
  .attr("y1", 94)
  .attr("x2", "57%")
  .attr("y2", 65);

svg6
  .append("text")
  .attr("x", "58%")
  .style("font-size", "1rem")
  .style("fill", "red")
  .attr("y", 65)
  .text("Red Lake: -6.4");

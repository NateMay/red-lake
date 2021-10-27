// https://bl.ocks.org/mbostock/4136647

var amenity_scores = {};
var names = {};

amenities.forEach(function (d) {
  amenity_scores[d.id] = +d.nat_score;
  names[d.id] = d.name;
});

var width = 960,
  height = 600;
var color_domain = [
  -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
];
var legend_labels = [
  "12+",
  "11",
  "10",
  "9",
  "8",
  "7",
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

const greens = [
  "#b369a3",
  "#ab71a3",
  "#a577a3",
  "#a07ca3",
  "#9b81a3",
  "#9686a3",
  "#928aa3",
  "#8e8ea3",
  "#8a92a2",
  "#8696a2",
  "#8399a2",
  "#7f9da2",
  "#7ca0a2",
  "#79a3a2",
  "#75a7a2",
  "#72aaa2",
  "#6fada2",
  "#6cb0a2",
  "#69b3a2",
];
const red_greens = [
  "#7d4972",
  "#926688",
  "#a8839f",
  "#bea1b6",
  "#d3bfce",
  "#e9dfe6",
  "#ffffff",
  "#eff4f3",
  "#e0e8e7",
  "#d0dddc",
  "#c1d2d0",
  "#b2c7c5",
  "#a3bcb9",
  "#94b1ae",
  "#85a7a3",
  "#769c98",
  "#67928d",
  "#588782",
  "#497d78",
];

var color = d3.scaleLinear().domain(color_domain).range(red_greens);

// Define the div for the tooltip
var tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

var svg = d3
  .select("#svg")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .style("margin", "-15px auto");

var defs4 = svg.select("defs");
var path = d3.geoPath();

defs4
  .append("path")
  .attr("id", "nation")
  .attr("d", path(topojson.feature(usa2, usa2.objects.nation)));

svg
  .append("g")
  .attr("class", "county")
  .selectAll("path")
  .data(topojson.feature(usa2, usa2.objects.counties).features)
  .enter()
  .append("path")
  .attr("d", path)
  .attr("id", (d) => d.id)
  .style("fill", (d) => color(amenity_scores[d.id]))
  .on("mouseover", (county) => {
    tooltip.style("opacity", 0.9);
    tooltip
      .text(names[county.id] + ": " + amenity_scores[county.id])
      .style("left", d3.event.pageX + "px")
      .style("top", d3.event.pageY - 28 + "px");
  })
  .on("mouseout", (county) => tooltip.style("opacity", 0));

svg
  .append("g")
  .attr("class", "county")
  .selectAll("path")
  .data(topojson.feature(usa2, usa2.objects.states).features)
  .enter()
  .append("path")
  .attr("d", path)
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

svg
  .append("text")
  .attr("x", 20)
  .attr("y", 550)
  .attr("class", "legend_title")
  .text("Natural amenities scale");

svg
  .append("line")
  .style("stroke", "red")
  .style("stroke-width", 2)
  .style("pointer-events", "none")
  .style("opacity", 0.8)
  .attr("x1", "51.3%")
  .attr("y1", 94)
  .attr("x2", "57%")
  .attr("y2", 65);

svg
  .append("text")
  .attr("x", "58%")
  .style("font-size", "1rem")
  .style("fill", "red")
  .attr("y", 65)
  .text("Red Lake: -6.4");

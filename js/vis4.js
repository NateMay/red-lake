// console.log(amenities);

// Map reference
// http://bl.ocks.org/jadiehm/af4a00140c213dfbc4e6

var amenity_scores = {};
var names = {};

amenities.forEach(function (d) {
  amenity_scores[d.id] = +d.nat_score;
  names[d.id] = d.name;
});
console.log(amenity_scores)

var width = 960,
  height = 600;
var color_domain = [
   -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
];
var legend_labels = [
  "< 500",
  "500+",
  "1000+",
  "1500+",
  "2000+",
  "2500+",
  "3000+",
  "3500+",
  "4000+",
  "4500+",
  "5000+",
  "5500+",
  "6000+",
];

const greens = ['#b369a3', '#ab71a3', '#a577a3', '#a07ca3', '#9b81a3', '#9686a3', '#928aa3', '#8e8ea3', '#8a92a2', '#8696a2', '#8399a2', '#7f9da2', '#7ca0a2', '#79a3a2', '#75a7a2', '#72aaa2', '#6fada2', '#6cb0a2', '#69b3a2']
var color = d3.scale
  .threshold()
  .domain(color_domain)
  .range(greens);

var color = d3.scale
  .threshold()
  .domain(color_domain)
  .range(greens);

var div = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

var svg = d3
  .select("#map")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("margin", "-15px auto");
var path = d3.geo.path();

//Moves selction to front
d3.selection.prototype.moveToFront = function () {
  return this.each(function () {
    this.parentNode.appendChild(this);
  });
};

//Moves selction to back
d3.selection.prototype.moveToBack = function () {
  return this.each(function () {
    var firstChild = this.parentNode.firstChild;
    if (firstChild) {
      this.parentNode.insertBefore(this, firstChild);
    }
  });
};

svg
  .append("g")
  .attr("class", "county")
  .selectAll("path")
  .data(topojson.feature(usa, usa.objects.counties).features)
  .enter()
  .append("path")
  .attr("d", path)
  .style("fill", function (d) {
    if (amenity_scores[d.id]) {
      console.log(color(amenity_scores[d.id]))
    }

    return color(amenity_scores[d.id]);
  })
  .style("opacity", 0.8)
  .on("mouseover", function (d) {
    var sel = d3.select(this);
    sel.moveToFront();
    d3.select(this)
      .transition()
      .duration(300)
      .style({ opacity: 1, stroke: "black", "stroke-width": 1.5 });
    div.transition().duration(300).style("opacity", 1);
    div
      .text(names[d.id] + ": " + amenity_scores[d.id])
      .style("left", d3.event.pageX + "px")
      .style("top", d3.event.pageY - 30 + "px");
  })
  .on("mouseout", function () {
    var sel = d3.select(this);
    sel.moveToBack();
    d3.select(this)
      .transition()
      .duration(300)
      .style({ opacity: 0.8, stroke: "white", "stroke-width": 1 });
    div.transition().duration(300).style("opacity", 0);
  });

var legend = svg
  .selectAll("g.legend")
  .data(color_domain.map(n => n-1))
  .enter()
  .append("g")
  .attr("class", "legend");

var ls_w = 73,
  ls_h = 20;

legend
  .append("rect")
  .attr("x", function (d, i) {
    return width - i * ls_w - ls_w;
  })
  .attr("y", 550)
  .attr("width", ls_w)
  .attr("height", ls_h)
  .style("fill", function (d, i) {
    return color(d);
  })
  .style("opacity", 0.8);

legend
  .append("text")
  .attr("x", function (d, i) {
    return width - i * ls_w - ls_w;
  })
  .attr("y", 590)
  .text(function (d, i) {
    return legend_labels[i];
  });

var legend_title = "Number of independent farms";

svg
  .append("text")
  .attr("x", 10)
  .attr("y", 540)
  .attr("class", "legend_title")
  .text(function () {
    return legend_title;
  });

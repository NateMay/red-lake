const min_2020_change =
  ordered_2020_rates[ordered_2020_rates.length - 1].percentChange2020;

const ordered_2010_rates = _.orderBy(rates, ["percentChange2010"], ["desc"]);

const max_2010_change = ordered_2010_rates[0].percentChange2010;
const min_2010_change =
  ordered_2010_rates[ordered_2010_rates.length - 1].percentChange2010;

// set the dimensions and margins of the graph
var margin = { top: 10, right: 10, bottom: 30, left: 30 },
  width2 = 450 - margin.left - margin.right,
  height2 = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg2 = d3
  .select("#pop_growth_scatter_1")
  .append("svg")
  .attr("width", width2 + margin.left + margin.right)
  .attr("height", height2 + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// X scale and Axis
var x2 = d3
.scaleLinear()
.domain([min_2010_change * 100, max_2010_change * 100]) // This is the min and the max of the data: 0 to 100 if percentages
.range([0, width2] );

svg2.append("g").attr("transform", "translate(0," + height2 + ")").call(d3.axisBottom(x2));

// Y scale and Axis
var y2 = d3
  .scaleLinear()
  .domain([min_2020_change * 100, max_2020_change * 100]) // This is the min and the max of the data: 0 to 100 if percentages
  .range([height2, 0]);

svg2
.append("g")

.call(d3.axisLeft(y2));



svg2
.selectAll("whatever")
.data(ordered_2020_rates)
.enter()
.append("circle")
.attr("cx", (county) => x2(county.percentChange2010 * 100))
.attr("cy", (county) => y2(county.percentChange2020 * 100))
.attr("r", 3)
.style("fill", "#69b3a2")
.style("opacity", "0.3")
.classed("top_10_2020", (county) => _.find(top_10_2020, county))
.on("mouseover", (county) => {
  tooltip.transition().duration(200).style("opacity", 0.9);
  tooltip
    .html(
      `${county.area}, ${county.state} <br> ${Math.trunc(
        county.percentChange2020 * 100
      )}% in 2020 <br> ${Math.trunc(county.percentChange2010 * 100)}% in 2010`
    )
    .style("left", d3.event.pageX + "px")
    .style("top", d3.event.pageY - 28 + "px");
})
.on("mouseout", (county) => {
  tooltip.transition().duration(500).style("opacity", 0);
});

// positive - negative boundaries
svg2
  .append("line")
  .style("stroke", "grey")
  .style("stroke-width", 1)
  .style("pointer-events", "none")
  .style("opacity", 0.4)
  .attr("x1", x2(min_2020_change))
  .attr("y1", 0)
  .attr("x2", x2(min_2020_change))
  .attr("y2", height2);


svg2
  .append("line")
  .style("stroke", "grey")
  .style("stroke-width", 1)
  .style("pointer-events", "none")
  .style("opacity", 0.4)
  .attr("y1", y2(min_2010_change))
  .attr("x1", 0)
  .attr("y2", y2(min_2010_change))
  .attr("x2", width2);

// axis labels
svg2
  .append("text")
  .attr("text-anchor", "end")
  .style("fill", "grey")
  .style("font-size", ".75em")
  .attr("y", 6)
  .attr("dy", ".75em")
  .attr("transform", "rotate(-90)")
  .text("% change 2010-2020");


svg2
.append("text")
.attr("text-anchor", "end")
.style("fill", "grey")
.style("font-size", ".75em")
.attr("y", height2 - 20)
.attr("x", width2)
.attr("dy", ".75em")
.text("% change 2000-2010");


// legend
svg2
  .append("rect")
  .attr("x", 260)
  .attr("y", 20)
  .attr("rx", "8px")
  .attr("width", 140)
  .attr("height", 40)
  .style("stroke", "grey")
  .style("fill", "transparent")
  .style("stroke-width", 1)
  .style("pointer-events", "none")
  .style("opacity", 0.4);

svg2
.append("circle")
.attr("cx", 275)
.attr("cy", 40)
.attr("r", 6)
.style("fill", "#B369A3")

svg2
.append("text")
// .attr("text-anchor", "end")
.style("font-size", ".75em")
.attr("x", 290)
.attr("y", 44)
.text("Top 10 in 2020");

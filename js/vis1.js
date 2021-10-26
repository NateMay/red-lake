
const _2020_rates = _.orderBy(rates, ["percentChange2020"], ["desc"]);

const _2020_max = _.first(_2020_rates).percentChange2020;
const _2020_min = _.last(_2020_rates).percentChange2020;


// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 10, left: 30 },
  width = 450 - margin.left - margin.right,
  height = 200 - margin.top - margin.bottom;

  // Define the div for the tooltip
var tooltip = d3.select("body").append("div")	
  .attr("class", "tooltip")				
  .style("opacity", 0);

// append the svg object to the body of the page
var svg1 = d3
  .select("#pop_growth_bar_1")
  .append("svg")
  .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
  // .attr("width", width + margin.left + margin.right)
  // .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// X scale and Axis
var x1 = d3
  .scaleLinear()
  .domain([0, 100]) // This is the min and the max of the data: 0 to 100 if percentages
  .range([0, width]); // This is the corresponding value I want in Pixel

// Y scale and Axis
var y1 = d3
  .scaleLinear()
  .domain([_2020_min * 100, _2020_max * 100]) // This is the min and the max of the data: 0 to 100 if percentages
  .range([height, 0]); // This is the corresponding value I want in Pixel
svg1.append("g").call(d3.axisLeft(y1));

// tooltips
const showTooltip = (county) => {
  tooltip.transition().duration(200).style("opacity", 0.9);
  tooltip
    .html(`${county.name}, ${county.state} <br> ${Math.trunc(county.percentChange2020 * 100)}%`)
    .style("left", d3.event.pageX + "px")
    .style("top", d3.event.pageY - 28 + "px");
}
const hideTooltip = (county) => tooltip.transition().duration(500).style("opacity", 0);

// add the data
svg1
.selectAll("whatever")
  .data(_.take(_2020_rates, 10))
  .enter()
  .append("rect")
  .attr("x", (_c, i) => x1(1 + i * 5))
  .attr("y", (county) => y1(county.percentChange2020 * 100))
  .attr("width", 18)
  .attr("height", (county) => height - y1(county.percentChange2020 * 100) + ((_2020_min - .02) * 100))
  .style("fill", "#69b3a2")
  .on("mouseover", showTooltip)
  .on("mouseout", hideTooltip);


svg1
.selectAll("whatever")
  .data(_.takeRight(_2020_rates, 10))
  .enter()
  .append("rect")
  .attr("x", (_c, i) => x1(1 + (i + 10) * 5))
  .attr("y", y1(0))
  .attr("width", 18)
  .attr("height", (county) => y1(county.percentChange2020 * 100) - y1(0) )
  .style("fill", "#B369A3")
  .on("mouseover", showTooltip)
  .on("mouseout", hideTooltip);

// y=0 line
svg1
  .append("line")
  .style("stroke", "black")
  .style("stroke-width", 1)
  .style("pointer-events", "none")
  .style("opacity", 0.7)
  .attr("x1", 0)
  .attr("y1", y1(0))
  .attr("x2", width)
  .attr("y2", y1(0));


// legend
svg1
.append("rect")
.attr("x", 230)
.attr("y", 10)
.attr("rx", "8px")
.attr("width", 162)
.attr("height", 60)
.style("stroke", "grey")
.style("fill", "transparent")
.style("stroke-width", 1)
.style("pointer-events", "none")
  .style("opacity", 0.4);



svg1
.append("circle")
.attr("cx", 245)
.attr("cy", 30)
.attr("r", 6)
.style("fill", "#69b3a2")

svg1
.append("text")
.style("font-size", ".75em")
.attr("x", 260)
.attr("y", 34)
.text("Population growth");

svg1
.append("circle")
.attr("cx", 245)
.attr("cy", 50)
.attr("r", 6)
.style("fill", "#B369A3")

svg1
.append("text")
// .attr("text-anchor", "end")
.style("font-size", ".75em")
.attr("x", 260)
.attr("y", 54)
.text("Population decline");

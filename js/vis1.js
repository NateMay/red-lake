
const ordered_2020_rates = _.orderBy(rates, ["percentChange2020"], ["desc"]);

const max_2020_change = ordered_2020_rates[0].percentChange2020;

const top_10_2020 = ordered_2020_rates.slice(0, 10)

// set the dimensions and margins of the graph
var margin = { top: 10, right: 10, bottom: 10, left: 30 },
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
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// X scale and Axis
var x = d3
  .scaleLinear()
  .domain([0, 100]) // This is the min and the max of the data: 0 to 100 if percentages
  .range([0, width]); // This is the corresponding value I want in Pixel

// Y scale and Axis
var y = d3
  .scaleLinear()
  .domain([0, max_2020_change * 100]) // This is the min and the max of the data: 0 to 100 if percentages
  .range([height, 0]); // This is the corresponding value I want in Pixel
svg1.append("g").call(d3.axisLeft(y));


// add the data
svg1
  .selectAll("whatever")
  .data(top_10_2020)
  .enter()
  .append("rect")
  .attr("x", (_c, i) => x(5 + i * 10))
  .attr("y", (county) => y(county.percentChange2020 * 100))
  .attr("width", 25)
  .attr("height", (county) => height - y(county.percentChange2020 * 100))
  .style("fill", "#69b3a2")
  .on("mouseover", (county) => {
    tooltip.transition().duration(200).style("opacity", 0.9);
    tooltip
      .html(`${county.area}, ${county.state} <br> +${Math.trunc(county.percentChange2020 * 100)}%`)
      .style("left", d3.event.pageX + "px")
      .style("top", d3.event.pageY - 28 + "px");
  })
  .on("mouseout", (county) => {
    tooltip.transition().duration(500).style("opacity", 0);
  });

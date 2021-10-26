const addN8Index = (county) => ({
  ...county,
  n8:
    county.percentChange2000 *
    county.percentChange2010 *
    county.percentChange2020,
});

const pos_multiplier = 10;
const positives = _.orderBy(
  rates
    .filter(
      (county) =>
        county.percentChange2000 >= 0 &&
        county.percentChange2010 >= 0 &&
        county.percentChange2020 >= 0
    )
    .map(addN8Index),
  ["n8"],
  ["desc"]
);
const maxN8 = _.first(positives).n8;

const neg_multiplier = 1000;
const negatives = _.orderBy(
  rates
    .filter(
      (county) =>
        county.percentChange2000 <= 0 &&
        county.percentChange2010 <= 0 &&
        county.percentChange2020 <= 0
    )
    .map(addN8Index),
  ["n8"],
  ["asc"]
);
const minN8 = _.first(negatives).n8;

// set the dimensions and margins of the graph
var margin3 = { top: 10, right: 30, bottom: 10, left: 30 },
  width3 = 450 - margin3.left - margin3.right,
  height3 = 200 - margin3.top - margin3.bottom;

// append the svg object to the body of the page
var svg3 = d3
  .select("#n8_index")
  .append("svg")
  .attr("viewBox", `0 0 ${width3 + margin3.left + margin3.right} ${height3 + margin3.top + margin3.bottom}`)
  .append("g")
  .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");

// X scale and Axis
var x3 = d3
  .scaleLinear()
  .domain([0, 100]) // This is the min and the max of the data: 0 to 100 if percentages
  .range([0, width3]); // This is the corresponding value I want in Pixel

// Y scale and Axis
var y3 = d3
  .scaleLinear()
  .domain([minN8 * neg_multiplier, maxN8 * pos_multiplier]) // This is the min and the max of the data: 0 to 100 if percentages
  .range([height3, 0]); // This is the corresponding value I want in Pixel

svg3.append("g").call(d3.axisLeft(y3));

// add the data
svg3
  .selectAll("whatever")
  .data(_.take(positives, 10))
  .enter()
  .append("rect")
  .attr("x", (_c, i) => x3(1 + i * 5))
  .attr("y", (county) => y3(county.n8 * pos_multiplier))
  .attr("width", 18)
  .attr("height", (county) => height3 - y3(county.n8 * pos_multiplier) - 105)
  .style("fill", "#69b3a2")
  .on("mouseover", (county) => {
    tooltip.transition().duration(200).style("opacity", 0.9);
    tooltip
      .html(
        `${county.name}, ${county.state} <br> ${parseFloat(
          county.n8 * pos_multiplier
        ).toFixed(2)}`
      )
      .style("left", d3.event.pageX + "px")
      .style("top", d3.event.pageY - 28 + "px");
  })
  .on("mouseout", hideTooltip);

svg3
  .selectAll("whatever")
  .data(_.take(negatives, 10).reverse())
  .enter()
  .append("rect")
  .attr("x", (_c, i) => x3(1 + (i + 10) * 5))
  .attr("y", y3(0))
  .attr("width", 18)
  .attr("height", (county) => y3(county.n8 * neg_multiplier) - y3(0))
  .style("fill", "#B369A3")
  .on("mouseover", (county) => {
    tooltip.transition().duration(200).style("opacity", 0.9);
    tooltip
      .html(
        `${county.name}, ${county.state} <br> ${parseFloat(
          county.n8 * neg_multiplier
        ).toFixed(2)}`
      )
      .style("left", d3.event.pageX + "px")
      .style("top", d3.event.pageY - 28 + "px");
  })
  .on("mouseout", hideTooltip);

// y=0 line
svg3
  .append("line")
  .style("stroke", "black")
  .style("stroke-width", 1)
  .style("pointer-events", "none")
  .style("opacity", 0.7)
  .attr("x1", 0)
  .attr("y1", y3(0))
  .attr("x2", width3)
  .attr("y2", y3(0));

// legend
svg3
  .append("rect")
  .attr("x", 260)
  .attr("y", -10)
  .attr("rx", "8px")
  .attr("width", 132)
  .attr("height", 60)
  .style("stroke", "grey")
  .style("fill", "transparent")
  .style("stroke-width", 1)
  .style("pointer-events", "none")
  .style("opacity", 0.4);

svg3
  .append("circle")
  .attr("cx", 280)
  .attr("cy", 10)
  .attr("r", 6)
  .style("fill", "#69b3a2");

svg3
  .append("text")
  .style("font-size", ".75em")
  .attr("x", 300)
  .attr("y", 14)
  .text("Desirable");

svg3
  .append("circle")
  .attr("cx", 280)
  .attr("cy", 30)
  .attr("r", 6)
  .style("fill", "#B369A3");

svg3
  .append("text")
  .style("font-size", ".75em")
  .attr("x", 300)
  .attr("y", 34)
  .text("Undesirable");

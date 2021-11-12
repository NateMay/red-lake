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
var margin3 = { top: 0, right: 30, bottom: 30, left: 30 },
  width3 = 450 - margin3.left - margin3.right,
  height3 = 454 - margin3.top - margin3.bottom;

// append the svg object to the body of the page
var svg3 = d3
  .select("#n8_index")
  .append("svg")
  .attr(
    "viewBox",
    `0 0 ${width3 + margin3.left + margin3.right} ${
      height3 + margin3.top + margin3.bottom
    }`
  )
  .append("g")
  .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");

// Y scale and Axis
var x3 = d3
  .scaleLinear()
  .domain([minN8 * neg_multiplier, maxN8 * pos_multiplier]) // This is the min and the max of the data: 0 to 100 if percentages
  .range([0, width3]); // This is the corresponding value I want in Pixel
// This is the corresponding value I want in Pixel

svg3
  .append("g")
  .attr("transform", "translate(0," + height3 + ")")
  .call(d3.axisBottom(x3));

// X scale and Axis
var y3 = d3
  .scaleLinear()
  .domain([0, 100]) // This is the min and the max of the data: 0 to 100 if percentages
  .range([height3, 0]);

// add the data
const pos_gs = svg3
  .selectAll("whatever")
  .data(_.take(positives, 10))
  .enter()
  .append("g");

pos_gs
  .append("rect")
  .attr("y", (_c, i) => 1 + i * 20)
  .attr("x", (county) => x3(0))
  .attr("height", 16)
  .attr("width", (county) => x3(county.n8 * pos_multiplier) - x3(0))
  .style("fill", "#69b3a2")
  .style("cursor", "pointer")
  .on("click", (d) => {
    openComparer()
    selectCounty(d.id);
  })

pos_gs
  .append("text")
  .text((county) => `${county.name}, ${county.state}`)
  .attr("y", (_c, i) => 12 + i * 20)
  .attr("x", (county) => x3(0) - 6)
  .attr("text-anchor", "end")
  .attr("font-size", "11px")
  .attr("fill", "#555")
  .style("cursor", "pointer")
  .on("click", (d) => {
    openComparer()
    selectCounty(d.id);
  })

pos_gs
  .append("text")
  .text((county) => parseFloat(county.n8 * pos_multiplier).toFixed(2))
  .attr("y", (_c, i) => 12 + i * 20)
  .attr("x", (county) => x3(0) + 6)
  .attr("text-anchor", "start")
  .attr("font-size", "11px")
  .attr("fill", "#fff")

const rl_data = negatives.find(r => r.id == red_lake)
    
// negatives
const neg_gs = svg3
  .selectAll("whatever")
  .data([rl_data, ..._.take(negatives, 10).reverse()])
  .enter()
  .append("g")

neg_gs
  .append("rect")
  .attr("y", (_c, i) => 202 + i * 20)
  .attr("x", (county) => x3(-minN8 * neg_multiplier) - x3(-county.n8 * neg_multiplier))
  .attr("height", 16)
  .attr("width", (county) => x3(-county.n8 * neg_multiplier) - x3(0))
  .style("fill", c => c.id == red_lake ? "red" : "#B369A3")
  .style("cursor", "pointer")
  .on("click", (d) => {
    openComparer()
    selectCounty(d.id);
  })

neg_gs
  .append("text")
  .text((county) => `${county.name}, ${county.state}`)
  .attr("y", (_c, i) => 214 + i * 20)
  .attr("x", (county) => x3(0) + 6)
  .attr("text-anchor", "start")
  .attr("font-size", "11px")
  .attr("fill", c => c.id == red_lake ? "red" : "#555")
  .style("cursor", "pointer")
  .on("click", (d) => {
    openComparer()
    selectCounty(d.id);
  })

neg_gs
  .append("text")
  .text((county) => parseFloat(county.n8 * neg_multiplier).toFixed(2))
  .attr("y", (_c, i) => 214 + i * 20)
  .attr("x", (county) => x3(0) - 6)
  .attr("text-anchor", "end")
  .attr("font-size", "11px")
  .attr("fill", c => c.id == red_lake ? "red" : "#fff");

// y=0 line
svg3
  .append("line")
  .style("stroke", "black")
  .style("stroke-width", 1)
  .style("pointer-events", "none")
  .style("opacity", 0.7)
  .attr("x1", x3(0))
  .attr("y1", 0)
  .attr("x2", x3(0))
  .attr("y2", height3);



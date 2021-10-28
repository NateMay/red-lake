const states_only = _.filter(
  unempoyment,
  (u) =>
    !["", "100"].includes(u.household_income_percent_of_state) &&
    !["US", "AK", "HI"].includes(u.state)
);
const red_lake_unemploy = unempoyment.find((u) => u.id == 27125);
const us_unemploy = unempoyment.find((u) => u.id == 0);

const unemploy_trend = [];
const red_lake_trend = [];

for (let year = 2000; year <= 2020; year++) {
  const yStr = year.toString();

  red_lake_trend.push({
    x: +yStr,
    y: +red_lake_unemploy[yStr],
  });

  unemploy_trend.push({
    x: +yStr,
    y: +us_unemploy[yStr],
    CI_left: +_.minBy(states_only, (c) => +c[yStr] || Infinity)[yStr],
    CI_right: +_.maxBy(states_only, (c) => +c[yStr])[yStr],
  });
}

const overall_max = _.maxBy(unemploy_trend, (y) => y.CI_right).CI_right;

// set the dimensions and margins of the graph
var margin = { top: 0, right: 30, bottom: 30, left: 20 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3
  .select("#my_dataviz2")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Read the data

// Add X axis --> it is a date format
var x = d3.scaleLinear().domain([2000, 2020]).range([0, width]);
svg
  .append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x).tickFormat(d3.format("d")));

// Add Y axis
var y = d3.scaleLinear().domain([0, overall_max]).range([height, 0]);
svg.append("g").call(d3.axisLeft(y));

// Show confidence interval
svg
  .append("path")
  .datum(unemploy_trend)
  .attr("fill", "#afd4cc")
  .attr("stroke", "none")
  .attr(
    "d",
    d3
      .area()
      .x((d) => x(d.x))
      .y0((d) => y(d.CI_right))
      .y1((d) => y(d.CI_left))
  );

// Add the line Red Lake
svg
  .append("path")
  .datum(red_lake_trend)
  .attr("fill", "none")
  .attr("stroke", "red")
  .attr("stroke-width", 2)
  .attr(
    "d",
    d3
      .line()
      .x((d) => x(d.x))
      .y((d) => y(d.y))
  );

// Add the USA line
svg
  .append("path")
  .datum(unemploy_trend)
  .attr("fill", "none")
  .attr("stroke", "#29627e")
  .attr("stroke-width", 1)
  .attr(
    "d",
    d3
      .line()
      .x((d) => x(d.x))
      .y((d) => y(d.y))
  );

// axis labels
svg
  .append("text")
  .attr("text-anchor", "end")
  .style("fill", "grey")
  .style("font-size", ".65em")
  .attr("y", 6)
  .attr("dy", ".75em")
  .attr("transform", "rotate(-90)")
  .text("unemployment %");

svg
  .append("text")
  .attr("x", 40)
  .attr("y", 255)
  .style("font-size", ".65em")
  .style("font-weight", "bold")
  .style("fill", "red")
  .text("Red Lake");

svg
  .append("text")
  .attr("x", 40)
  .attr("y", 325)
  .style("font-size", ".65em")
  .style("fill", "#29627e")
  .text("National average");

svg
  .append("text")
  .attr("x", 245)
  .attr("y", 10)
  .style("font-size", ".65em")
  .style("fill", "#555")
  .text("Highest county unemplyment");

svg
  .append("line")
  .style("stroke", "#555")
  .style("stroke-width", 1)
  .style("pointer-events", "none")
  .style("opacity", 0.8)
  .attr("x1", 295)
  .attr("y1", 20)
  .attr("x2", 285)
  .attr("y2", 60);

svg
  .append("text")
  .attr("x", 205)
  .attr("y", 333)
  .style("font-size", ".65em")
  .style("fill", "#555")
  .text("Lowest county unemplyment");

svg
  .append("line")
  .style("stroke", "#555")
  .style("stroke-width", 1)
  .style("pointer-events", "none")
  .style("opacity", 0.8)
  .attr("x1", 290)
  .attr("y1", 336)
  .attr("x2", 285)
  .attr("y2", 355);

// recession
svg
  .append("rect")
  .attr("x", x(2007.89))
  .attr("y", 0)
  .attr("width", 32)
  .attr("height", height)
  .style("opacity", "0.4")
  .style("fill", "#555")
  .style("pointer-events", "none");

svg
  .append("text")
  .style("fill", "white")
  .style("font-size", ".65em")
  .style("opacity", "0.7")
  .attr("y", 182)
  .attr("x", -200)
  .attr("transform", "rotate(-90)")
  .text("Recession");

const sample = rates.filter((c, i) => i % 7 === 2)

const _2020_rates2 = _.orderBy(sample, ["percentChange2020"], ["desc"]);
const _2020_max2 = _.first(_2020_rates2).percentChange2020;
const _2020_min2 = _.last(_2020_rates2).percentChange2020;

const _2010_rates = _.orderBy(sample, ["percentChange2010"], ["desc"]);
const _2010_max = _.first(_2010_rates).percentChange2010;
const _2010_min = _.last(_2010_rates).percentChange2010;

const _2000_rates = _.orderBy(sample, ["percentChange2000"], ["desc"]);
const _2000_max = _.first(sample).percentChange2000;
const _2000_min = _.last(sample).percentChange2000;


// set the dimensions and margins of the graph
var margin2 = { top: 10, right: 30, bottom: 40, left: 30 },
  width2 = 450 - margin2.left - margin2.right,
  height2 = 400 - margin2.top - margin2.bottom;

// append the svg object to the body of the page
var svg2 = d3
  .select("#pop_growth_scatter_1")
  .append("svg")
  .attr("viewBox", `0 0 ${width2 + margin2.left + margin2.right} ${height2 + margin2.top + margin2.bottom}`)
  .append("g")
  .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

// X scale and Axis
var x2 = d3
  .scaleLinear()
  .domain([_2010_min * 100, _2010_max * 100]) // This is the min and the max of the data: 0 to 100 if percentages
  .range([0, width2]);

svg2
  .append("g")
  .attr("transform", "translate(0," + height2 + ")")
  .call(d3.axisBottom(x2));

// Y scale and Axis
var y2 = d3
  .scaleLinear()
  .domain([_2020_min2 * 100, _2020_max2 * 100]) // This is the min and the max of the data: 0 to 100 if percentages
  .range([height2, 0]);


var z2 = d3
  .scaleSequential(d3.interpolate("#7D4972", "#497D78"))
  .domain([-_2000_max, _2000_max])

svg2
  .append("g")
  .call(d3.axisLeft(y2));

svg2
  .selectAll("whatever")
  .data(sample)
  .enter()
  .append("circle")
  .attr("r", 4)
  .attr("cx", (county) => x2(county.percentChange2010 * 100))
  .attr("cy", (county) => y2(county.percentChange2020 * 100))
  .attr("fill", (county) => z2(county.percentChange2000) )
  .style("opacity", "0.8")
  .on("mouseover", (county) => {
    tooltip.transition().duration(200).style("opacity", 0.9);
    tooltip
      .html(
        `${county.name}, ${county.state} <br> 
        ${Math.trunc(county.percentChange2020 * 100)}% in 2020 <br>
        ${Math.trunc(county.percentChange2010 * 100)}% in 2010 <br>
        ${Math.trunc(county.percentChange2000 * 100)}% in 2000 <br>`
      )
      .style("left", d3.event.pageX + "px")
      .style("top", d3.event.pageY - 28 + "px");
  })
  .on("mouseout", hideTooltip);

// positive - negative boundaries
svg2
  .append("line")
  .style("stroke", "grey")
  .style("stroke-width", 1)
  .style("pointer-events", "none")
  .style("opacity", 0.4)
  .attr("x1", x2(_2020_min2))
  .attr("y1", 0)
  .attr("x2", x2(_2020_min2))
  .attr("y2", height2);

svg2
  .append("line")
  .style("stroke", "grey")
  .style("stroke-width", 1)
  .style("pointer-events", "none")
  .style("opacity", 0.4)
  .attr("y1", y2(_2010_min))
  .attr("x1", 0)
  .attr("y2", y2(_2010_min))
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
  .text("2020 % change");

svg2
  .append("text")
  .attr("text-anchor", "end")
  .style("fill", "grey")
  .style("font-size", ".75em")
  .attr("y", height2 - 20)
  .attr("x", width2)
  .attr("dy", ".75em")
  .text("2010 % change");

// legend
svg2
  .append("rect")
  .attr("x", 40)
  .attr("y", 20)
  .attr("rx", "8px")
  .attr("width", 140)
  .attr("height", 80)
  .style("stroke", "grey")
  .style("fill", "#f3eed5")
  .style("stroke-width", 1)
  .style("pointer-events", "none")

const defs = svg2.append('defs')

const linearGradient = defs
  .append('linearGradient')
  .attr('id', 'myGradient')


linearGradient.append('stop')
  .attr('offset', '5%')
  .attr('stop-color', '#7D4972')

linearGradient.append('stop')
  .attr('offset', '95%')
  .attr('stop-color', '#497D78')

svg2
  .append("text")
  .style("font-size", ".75em")
  .attr("x", 55)
  .attr("y", 44)
  .text("2020 % change");

svg2
  .append("rect")
  .attr("x", 55)
  .attr("y", 50)
  .attr("width", 110)
  .attr("height", 20)
  .style("fill", "url('#myGradient')");

svg2
  .append("text")
  .style("font-size", ".75em")
  .attr("x", 55)
  .attr("y", 84)
  .text("more growth →");

const negatives = _.orderBy(rates
  .filter(county => county.percentChange2000 <= 0 && county.percentChange2010 <= 0 && county.percentChange2020 <= 0)
  .map(addN8Index), ["n8"], ["asc"]);

var margin = { top: 10, right: 10, bottom: 10, left: 30 },
  width4 = 225 - margin.left - margin.right,
  height4 = 200 - margin.top - margin.bottom;

  // Define the div for the tooltip
var tooltip = d3.select("body").append("div")	
  .attr("class", "tooltip")				
  .style("opacity", 0);

// append the svg object to the body of the page
var svg4 = d3
  .select("#n8_index_neg")
  .append("svg")
  .attr("width", width4 + margin.left + margin.right)
  .attr("height", height4 + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // X scale and Axis
var x4 = d3
  .scaleLinear()
  .domain([0, 100]) // This is the min and the max of the data: 0 to 100 if percentages
  .range([0, width4]); // This is the corresponding value I want in Pixel

// Y scale and Axis
var y4 = d3
  .scaleLinear()
  .domain([negatives[0].n8, 0]) // This is the min and the max of the data: 0 to 100 if percentages
  .range([height4, 0]); // This is the corresponding value I want in Pixel

svg4.append("g").call(d3.axisLeft(y4));

console.log(negatives.slice(0, 5))
svg4
  .selectAll("whatever")
  .data(negatives.slice(0, 5).reverse())
  .enter()
  .append("rect")
  .attr("x", (_c, i) => x4(5 + i * 20))
  .attr("y", (county) => 0)
  .attr("width", 25)
  .attr("height", (county) => y4(county.n8))
  .style("fill", "#B369A3")
  .on("mouseover", (county) => {
    tooltip.transition().duration(200).style("opacity", 0.9);
    tooltip
      .html(`${county.area}, ${county.state} <br> ${parseFloat(county.n8).toFixed(4)
    }`)
      .style("left", d3.event.pageX + "px")
      .style("top", d3.event.pageY - 28 + "px");
  })
  .on("mouseout", (county) => {
    tooltip.transition().duration(500).style("opacity", 0);
  });

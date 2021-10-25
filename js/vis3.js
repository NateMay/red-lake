const addN8Index = county => ({
  ...county,
  n8: county.percentChange2000 * county.percentChange2010 * county.percentChange2020 
})

const positives = _.orderBy(rates
    .filter(county => county.percentChange2000 >= 0 && county.percentChange2010 >= 0 && county.percentChange2020 >= 0)
  .map(addN8Index), ["n8"], ["desc"]);
    

var margin = { top: 10, right: 10, bottom: 10, left: 30 },
  width3 = 225 - margin.left - margin.right,
  height3 = 200 - margin.top - margin.bottom;

  // Define the div for the tooltip
var tooltip = d3.select("body").append("div")	
  .attr("class", "tooltip")				
  .style("opacity", 0);

// append the svg object to the body of the page
var svg3 = d3
  .select("#n8_index_pos")
  .append("svg")
  .attr("width", width3 + margin.left + margin.right)
  .attr("height", height3 + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // X scale and Axis
var x3 = d3
  .scaleLinear()
  .domain([0, 100]) // This is the min and the max of the data: 0 to 100 if percentages
  .range([0, width3]); // This is the corresponding value I want in Pixel

// Y scale and Axis
var y3 = d3
  .scaleLinear()
  .domain([0, positives[0].n8]) // This is the min and the max of the data: 0 to 100 if percentages
  .range([height3, 0]); // This is the corresponding value I want in Pixel

svg3.append("g").call(d3.axisLeft(y3));

svg3
  .selectAll("whatever")
  .data(positives.slice(0, 5))
  .enter()
  .append("rect")
  .attr("x", (_c, i) => x3(5 + i * 20))
  .attr("y", (county) => y3(county.n8))
  .attr("width", 25)
  .attr("height", (county) => height3 - y3(county.n8))
  .style("fill", "#69b3a2")
  .on("mouseover", (county) => {
    tooltip.transition().duration(200).style("opacity", 0.9);
    tooltip
      .html(`${county.area}, ${county.state} <br> ${parseFloat(county.n8).toFixed(2)
    }`)
      .style("left", d3.event.pageX + "px")
      .style("top", d3.event.pageY - 28 + "px");
  })
  .on("mouseout", (county) => {
    tooltip.transition().duration(500).style("opacity", 0);
  });

// https://www.d3-graph-gallery.com/graph/violin_jitter.html

const metrics = [
  {
    metric: "Avg. January Temp",
    prop: "jan_temp",
    label: "fahrenheit",
    color: "#69B3A2",
  },
  {
    metric: "Avg. July Temp",
    prop: "july_temp",
    label: "fahrenheit",
    color: "#497D78"
  },
  {
    metric: "Avg. July Humidity",
    prop: "july_hum",
    label: "percent",
    color: "#B369A3"
  },
  {
    metric: "Avg January Sunlight",
    prop: "jan_sun",
    label: "hours",
    color: "#B3A369"
  },
  {
    metric: "Water Coverage",
    prop: "log",
    label: "pecent (log)",
    color: "#7482c3"
  },
];

const viz5charts = []

metrics.forEach((metric) => {
  const metricData = [
    ...amenities.map((c) => ({
      name: c.name,
      state: c.STATE,
      value: c[metric.prop],
      metric: metric.metric,
      nat_amen: c.nat_amen
    })),
  ].filter((c, i) => i % 10 == 0);

  var margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg5 = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Read the data and compute summary statistics for each specie

  // Build and Show the Y scale
  const minVal = _.minBy(metricData, (d) => +d.value).value;
  const maxVal = _.maxBy(metricData, (d) => +d.value).value;
  var y = d3
    .scaleLinear()
    .domain([minVal, maxVal]) // Note that here the Y scale is set manually
    .range([height, 0]);
  svg5.append("g").call(d3.axisLeft(y));

  // Build and Show the X scale. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
  var x = d3
    .scaleBand()
    .range([0, width])
    .domain([metric.metric])
    .padding(0.05); // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.
  svg5
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Features of the histogram
  var histogram = d3
    .histogram()
    .domain(y.domain())
    .thresholds(y.ticks(20)) // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
    .value((d) => d);

  // Compute the binning for each group of the dataset
  var sumstat = d3
    .nest() // nest function allows to group the calculation per level of a factor
    .key((d) => d.metric)
    .rollup((d) => histogram(d.map((g) => g.value)))
    .entries(metricData);

  // What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
  var maxNum = 0;
  for (i in sumstat) {
    allBins = sumstat[i].value;
    lengths = allBins.map((a) => a.length);
    longuest = d3.max(lengths);
    if (longuest > maxNum) {
      maxNum = longuest;
    }
  }

  // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
  var xNum = d3
    .scaleLinear()
    .range([0, x.bandwidth()])
    .domain([-maxNum, maxNum]);

  // Add the shape to this svg!
  svg5
    .selectAll("myViolin")
    .data(sumstat)
    .enter() // So now we are working group per group
    .append("g")
    .attr("transform", (d) => `translate(${x(d.key)},0)`) // Translation on the right to be at the group position
    .append("path")
    .datum((d) => d.value)
    .style("stroke", "none")
    .style("fill", "grey")
    .attr(
      "d",
      d3
        .area()
        .x0(xNum(0))
        .x1((d) => xNum(d.length))
        .y((d) => y(d.x0))
        .curve(d3.curveCatmullRom) // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
    );

  // Add individual points with jitter
  var jitterWidth = 40;
  svg5
    .selectAll("indPoints")
    .data(metricData)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.metric) + x.bandwidth() / 2 - Math.random() * jitterWidth)
    .attr("cy", (d) => y(d.value))
    .attr("r", d => d.name === "RED LAKE" ? 8 : 5)
    .style("opacity", (d) => (d.name === "RED LAKE" ? 1 : 0.5))
    .style("fill", (d) => d.name === "RED LAKE" ? "red" : metric.color)
    .attr("stroke", "white")
    // .on("mouseover", (county) => {
    //   tooltip.style("opacity", 0.9);
    //   tooltip
    //     .text(`${county.name}, ${county.state} = ${county.value}`)
    //     .style("left", d3.event.pageX + "px")
    //     .style("top", d3.event.pageY - 28 + "px");
    // })
    // .on("mouseout", (county) => tooltip.style("opacity", 0));

  svg5
    .append("text")
    .attr("text-anchor", "end")
    .style("fill", "grey")
    .style("font-size", ".75em")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text(metric.label);
  
  viz5charts.push(svg5)
});


viz5charts[0]
  .append("line")
  .style("stroke", "red")
  .style("stroke-width", 2)
  .style("pointer-events", "none")
  .style("opacity", 0.8)
  .attr("x1", 86)
  .attr("y1", 537)
  .attr("x2", 58)
  .attr("y2", 537);

viz5charts[0]
  .append("text")
  .attr("x", 90)
  .attr("y", 542)
  .style("font-size", ".65em")
  .style("fill", "red")
  .style("font-weight", "bold")
  .text("Red Lake");

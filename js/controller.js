const _2020_rates = _.orderBy(rates, ["percentChange2020"], ["desc"]);

const _2020_max = _.first(_2020_rates).percentChange2020;
const _2020_min = _.last(_2020_rates).percentChange2020;

// Define the div for the tooltip
var tooltip = d3
  .select("#tooltip-box")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

const selectEl = document.getElementById("select");

const states = _.groupBy(census, "state");

_.forEach(states, (counties, state) => {
  const group = document.createElement("optgroup");
  group.label = state;
  selectEl.append(group);
  counties.forEach((county) => {
    const option = document.createElement("option");
    option.value = county.id;
    option.innerText = `${county.name}, ${county.state}`;
    group.append(option);
  });
});

const hideTooltip = (county) =>
  tooltip.transition().duration(500).style("opacity", 0);

let comparerOpen = false;
const comparer = document.getElementById("compare-selector");
document.getElementById("close").addEventListener("click", () => {
  comparerOpen ? closeComparer() : openComparer();
});

function openComparer() {
  comparerOpen = true;
  comparer.classList.add("open");
}
function closeComparer() {
  comparerOpen = false;
  comparer.classList.remove("open");
}

const elm = (id) => document.getElementById(id);

function selectCounty(fips) {
  // const county = census.find((county) => county.id == fips);
  const amenity = amenities.find((county) => county.id == fips);
  const rate = rates.find((county) => county.id == fips);

  const name = `${amenity.name}, ${amenity.STATE}`;

  elm("focus-name").innerText = name;
  elm("focus-n8").innerText = !!rate ? addN8Index(rate).n8.toFixed(2) : "N/A";
  elm("focus-amenity").innerText = amenity.nat_amen;
  elm("focus-sunlight").innerText = amenity.jan_sun;
  elm("focus-humidity").innerText = amenity.july_hum;

  updateImage(amenity.name, amenity.STATE);
  selectEl.value = fips;
  updateScatter(fips);
  updateMap(fips);
  updateHistogramFocus(fips);
  addCountyLine(fips, name);
}

selectEl.addEventListener("change", (e) => {
  selectCounty(+e.target.value);
});

const endpoint = "https://customsearch.googleapis.com/customsearch/v1";
// https://programmablesearchengine.google.com/cse/setup/basic?cx=2262297689a09ed37
const engine = "2262297689a09ed37";

const fetchImage = async (search_term) =>
  fetch(
    `${endpoint}?cx=${engine}&exactTerms=${search_term}&key=${SEACRH_APIKEY}`
  ).then((response) => response.json());

function updateImage(county, state) {
  // fetchImage(`${county}, ${abbrMap[state]}`).then((data) => {
  //   try {
  //     elm("focus-image").src = data.items[0].pagemap.cse_image[0].src;
  //   } catch {
  //     fetchImage(`${abbrMap[state]}`).then((data) => {
  //       try {
  //         elm("focus-image").src = data.items[0].pagemap.cse_image[0].src;
  //       } catch {
  //         // alert("Daily Image Search Quota exeeded");
  //       }
  //     });
  //   }
  // });
}

let graphsOnly = false;
function toggleGraphsOnly() {
  graphsOnly
  ? elm("body").classList.remove("graphs-only")
  : elm("body").classList.add("graphs-only");
  graphsOnly = !graphsOnly
}
elm('toggle-text').addEventListener('click', () => toggleGraphsOnly())


const abbrMap = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

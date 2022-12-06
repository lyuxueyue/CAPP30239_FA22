var height = 600,
    width = 960;

var svg3 = d3.select("#map")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

const tooltip = d3.select("body")
  .append("div")
  .attr("class", "svg-tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden");

// Map and projection
var path = d3.geoPath();
var projection = d3.geoNaturalEarth()
    .scale(width / 2 / Math.PI)
    .translate([width / 2, height / 2])
var path = d3.geoPath()
    .projection(projection);

// Data and color scale
var data = d3.map();
var colorScheme = ["#8dd3c7","#ffffb3","#fb8072","#80b1d3","#fdb462","#b3de69"];

colorScheme.unshift("#eee")
var colorScale = d3.scaleThreshold()
    .domain([0.5, 1, 4, 6, 11, 101])
    .range(colorScheme);

// Legend
var g = svg3.append("g")
    .attr("class", "legendThreshold")
    .attr("transform", "translate(20,20)");

    g.append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", -6)
    .text("Ratio Range");
var labels = ['0', '0.5-0.9', '1-3', '4-5', '6-10', '11-100', '> 100'];
var legend = d3.legendColor()
    .labels(function (d) { return labels[d.i]; })
    .shapePadding(4)
    .scale(colorScale);
svg3.select(".legendThreshold")
    .call(legend);

var Country = d3.map();
var ratio_2019 = d3.map();
var ratio_2020 = d3.map();

// Load external data and boot
d3.queue()
    .defer(d3.json, "data/worldmap.json")
    // .defer(d3.json, "http://enjalot.github.io/wwsd/data/world/world-110m.geojson")
    .defer(d3.csv, "data/data_p3.csv", function(d) { data.set(d.iso3, +d.ratio_2021); 
        Country.set(d.iso3, d.Country);
        ratio_2019.set(d.iso3, +d.ratio_2019);
        ratio_2020.set(d.iso3, +d.ratio_2020);
    })
    .await(ready);

function ready(error, topo) {
    if (error) throw error;

    // Draw the map
    svg3.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(topo.features)
        .enter().append("path")
            .attr("fill", function (d){
                // Pull data for this country
                d.ratio = data.get(d.id) || 0;
                // Set the color
                return colorScale(d.ratio);
            })
            .attr("d", path)
        .on("mousemove", tip3.show)
         .on("mouseout", tip3.hide)
        
}

var tip3 = d3.tip()
    .attr('class', 'd3-tip')
    .html(function(d) {
        return "<div style='opacity:0.8;background-color:#329c68;font-family:sans-serif;padding:13px;;color:white'>"+
         Country.get(d.id) + "<br/>"+
        "2021: " + data.get(d.id) +"<br/>"+
        "2020: " + ratio_2020.get(d.id) + "<br/>"+
        "2019: " + ratio_2019.get(d.id) + 
        "</div>";
    })
g.call(tip3)

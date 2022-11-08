/* multiline plot for shot proportion by races */

let height = 200,
    width = 400,
    margin = ({ top: 25, right: 55, bottom: 35, left: 30 })
    innerWidth = width - margin.left - margin.right;

const svg = d3.select("#chart")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

d3.csv("race_month_num.csv").then(data => {
  let timeParse = d3.timeParse("%Y-%m");

  let races = new Set();

  for (let d of data) {
    d.Date = timeParse(d.Date);
    d.Num = +d.Num;
    races.add(d.Race); // push unique values to Set
  }

  let x = d3.scaleTime()
    .domain(d3.extent(data, d => d.Date))
    .range([margin.left, width - margin.right]);

  let y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.Num)).nice()
    .range([height - margin.bottom, margin.top]);

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0).tickSizeInner(0));

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .attr("class", "y-axis")
    .call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat(d => d + "%"));

  let line = d3.line()
    .x(d => x(d.Date))
    .y(d => y(d.Num));
 
  for (let race of races) {
    // .filter to filter data in D3
    let raceData = data.filter(d => d.Race === race);

    let g = svg.append("g")
      .attr("class", "race")
      .on('mouseover', function () {
        // set/remove highlight class
        d3.selectAll(".highlight").classed("highlight", false);
        d3.select(this).classed("highlight", true);
      });

    if (race === "Black") {
      g.classed("highlight", true);
    }

    g.append("path")
      .datum(raceData)
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("d", line)

    let lastEntry = raceData[raceData.length - 1]; //last piece of data to position text x and y

    g.append("text")
      .text(race)
      .attr("x", x(lastEntry.Date))
      .attr("y", y(lastEntry.Num))
      .attr("dx", "5px") // shifting attribute in svg
      .attr("dominant-baseline", "middle")
      .attr("fill", "#999");
  }
  
});
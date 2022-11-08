/* bar chart for shot number by race */

d3.csv("race_total_num.csv").then(data => {

    for (let d of data) {
        d.Num= +d.Num;
    };

    const height = 600,
          width = 600,
          margin = ({top:20, right: 30, bottom: 60, left: 50});

    let svg = d3.select("#chart")
        .append("svg")
        .attr("viewBox", [0,0, width, height]);

    let x = d3.scaleBand()
        .domain(data.map(d => d.Race))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Num)]).nice()
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom + 5})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y));
    
    let bar = svg.selectAll(".bar")
        .append("g")
        .data(data)
        .join("g")
        .attr("class", "bar")

    bar.append("rect")
        .attr("fill","grey")
        .attr("x", d => x(d.Race))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.Num))
        .attr("height", d => y(0) - y(d.Num));
    
    bar.append('text')
        .text(d => d.Num)
        .attr('y', d => y(d.Num) - 5)
        .attr('x', d => x(d.Race) + (x.bandwidth()/2))
        .attr('text-anchor', 'middle')
        .style('fill', 'brown');

});
var width = 1080,
    height = 720,
    margin = {top: 50, bottom: 50, left: 50, right: 50};

var color = ["#8dd3c7","#fdb462","#fb8072"];
var data2 = [];

var svg2 = d3.select('#grouplinechart')
            .style("width",width+"px")
            .append('svg')
            .attr('width', width)
            .attr('height',height); 

d3.csv('data/data_p2.csv').then(function(d) {
    
    for(var i=0;i<d.length;i+=3){
        var item = {};
        item.Country = d[i].Country;
        item.data = [];
        var elect;
        for(var j=i;j<i+3;j++){
            elect = d[j].Electricity;
            elect = elect.substring(0,elect.indexOf(" "));
            item.data.push({t:elect,cd:[
            {year:"2017",v:Number(d[j]["2017"])},
            {year:"2018",v:Number(d[j]["2018"])},
            {year:"2019",v:Number(d[j]["2019"])},
            {year:"2020",v:Number(d[j]["2020"])},
            {year:"2021",v:Number(d[j]["2021"])}
            ]})
        }
        data2.push(item);
        
    }

    for(var i=0;i<data2.length;i++){
        var xScale2 = d3.scalePoint()
            .range([ 0,width/3-margin.left-margin.right])
            .domain(data2[i].data[0].cd.map(function(d) { return d.year; }))
        svg2.append("g")
            .attr("transform", "translate("+(width/3*(i%3)+margin.left)+","+(height/3*(Math.floor(i/3))-margin.bottom+height/3)+")")
            .call(d3.axisBottom(xScale2))
            .data(data2[i].data[0].cd)
            
        var max0 = d3.max(data2[i].data[0].cd,function(d){return d.v;});
        var max1 = d3.max(data2[i].data[1].cd,function(d){return d.v;});
        var max2 = d3.max(data2[i].data[2].cd,function(d){return d.v;});

        var max_p2 = Math.max(max0,max1,max2);

        var yScale2 = d3.scaleLinear()
            .domain([0, max_p2])
            .range([ height/3-margin.bottom-margin.top ,0]);
        svg2.append("g")
            .attr("transform", "translate("+(width/3*(i%3)+margin.left)+","+(height/3*(Math.floor(i/3))+margin.top)+")")
            .call(d3.axisLeft(yScale2))
        
        var pathCon2 = svg2.append("g");
            
        var line_p2 = d3.line()
            .x(function(d) {
                return xScale2(d.year)+margin.left+width/3*(i%3)
            })
            .y(function(d) {
                return yScale2(d.v)+margin.top+height/3*(Math.floor(i/3));
            })

        //plot lines   
        for(var j=0;j<3;j++){
            pathCon2.append("path")
                .attr("fill","none")
                .attr("d", line_p2(data2[i].data[j].cd))
                .style("stroke", color[j]);
            
            var leg2 = svg2.append("g")
            leg2.append("rect")
            .attr("x", width/3*(i%3)+margin.left+j*90)
            .attr("y", height/3*(Math.floor(i/3))+20)
            .attr("width", 15)
            .attr("height", 10)
            .attr("fill", color[j]);
            leg2.append("text")
            .attr("x", width/3*(i%3)+margin.left+j*90+20)
            .attr("y", height/3*(Math.floor(i/3))+25)
            .attr("fill","#333")
            .attr("font-size",10)
            .attr("dominant-baseline","middle")
            .text(data2[i].data[j].t)
        }
            

        svg2.append("g")
        .append("text")
        .attr("x", width/3*(i%3)+width/6)
        .attr("y", height/3*(Math.floor(i/3))+height/3-margin.bottom/3)
        .attr("fill","#333")
        .attr("text-anchor","middle")
        .attr("dominant-baseline","middle")
        .style("font-size","14px")
        .text(data2[i].Country)

        svg2.append("g")
        .append("text")
        .attr("x", width/3*(i%3))
        .attr("y", height/3*(Math.floor(i/3))+margin.top-10)
        .attr("fill","#333")
        .attr("text-anchor","start")
        .attr("dominant-baseline","middle")
        .style("font-size","11px")
        .text("billion kWh")
            
    }

            
});
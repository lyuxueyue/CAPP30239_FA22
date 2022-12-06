var width = 1260,
    height = 650,
    margin = {top: 50, bottom: 50, left: 50, right: 50};

var colors = {generation:"#8dd3c7", fossil:"#ffffb3", renewable:"#fb8072", nonhydro:"#80b1d3"};

var svg = d3.select('#areachart')
            .style("width",width+"px")
			.append('svg')
			.attr('width', width)
			.attr('height',height); 

    svg.append("text")
            .attr("x", width/2.5)
            .attr("y", 40)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Area Chart of World Electricity Generation");

d3.csv('data/data_p1.csv').then(function(data) {
	console.log(data)
		
    data.forEach(d => {
        d.nonhydro = +d.nonhydro;
        d.renewable = +d.renewable;
        d.fossil = +d.fossil;
        d.generation = +d.generation;
        });
    
    var xScale = d3.scalePoint()
        .range([0,width-margin.left-margin.right])
        .domain(data.map(function(d) {return d.year }))

    svg.append("g")
        .attr("transform", "translate("+margin.left+","+(height-margin.bottom)+")")
        .call(d3.axisBottom(xScale).tickValues(xScale.domain().filter((d, i) => i % 2 === 0))) //ref:https://github.com/d3/d3-scale/issues/182
        .data(data)
    
    var max = d3.max(data,function(d){return d.generation});

    var yScale = d3.scaleLinear()
        .domain([0, max])
        .range([ height-margin.bottom-margin.top ,0]);
                  
    var pathCon = svg.append("g");
            
    var yUI = svg.append("g")
            .attr("transform", "translate("+margin.left+","+margin.top+")")
            .call(d3.axisLeft(yScale))

        yUI.selectAll("line")
            .attr("stroke","#ccc")
            .style("stroke-dasharray","4,4")
            .style("stroke-width",1)
            .attr("x1", "0")
            .attr("x2", width-margin.left-margin.right)

    var txtArray = [];
            
    var tipTxt = svg.append("g");
    var tipbg = tipTxt.append("rect")
            .attr("x",width+10)
            .attr("y",margin.top+50)
            .attr("width",200)
            .attr("height",110)
            .attr("fill","#999");

    var tipTitle = tipTxt.append("text")
            .attr("class","tiptxt")
            .attr("x",width-margin.right+10)
            .attr("y",margin.top+70)
            .attr("fill","#fff")
            .style("font-size","13px")
            .style("font-weight","bold");

    var legID = 0;

    for(var item in colors){
        var line = d3.line()
        .x(function(d) {
                return xScale(d.year)+margin.left
            })
        .y(function(d) {
                return yScale(d[item])+margin.top;
            })
        
        var pathStr = line(data);
        pathStr += "L"+(xScale(data[data.length-1].year)+margin.left)+","+(height-margin.bottom);
        pathStr += "L"+(xScale(data[0].year)+margin.left)+","+(height-margin.bottom);

        var path = pathCon
            .append("path")
            .attr("fill",colors[item])
            .attr("d", pathStr);

        var leg = svg.append("g")
        leg.append("rect")
        .attr("x", margin.left+legID*130+30)
        .attr("y", 10)
        .attr("width", 15)
        .attr("height", 10)
        .attr("fill", colors[item]);
        leg.append("text")
        .attr("x", margin.left+legID*130+50)
        .attr("y", 15)
        .attr("fill","#333")
        .attr("font-size",13)
        .attr("dominant-baseline","middle")
        .text(item)

        var txt = tipTxt.append("text")
        .attr("class","tiptxt")
        .attr("x",width-margin.right+10)
        .attr("y",margin.top+90+legID*20)
        .attr("fill","#fff")
        .style("font-size","12px");

        txtArray.push(txt);

        legID++;
    }

    var tipLine = svg.append("line")
        .attr("x1",width+10)
        .attr("x2",width+10)
        .attr("y1",margin.top)
        .attr("y2",height-margin.bottom)
        .style("stroke", "#999");

    svg.append("rect")
        .attr("x",margin.left)
        .attr("y",margin.top)
        .attr("width",width-margin.left-margin.right)
        .attr("height",height-margin.bottom-margin.top)
        .attr("fill","rgba(0,0,0,0)")
        .on("mousemove",function(){
            d3.selectAll(".tiptxt").style("display","block");
            tipbg.style("display","block");
            var mxy = d3.mouse(this);
            var eX = 0;
            for(var i=0;i<data.length;i++){
                if(i<data.length-1){
                    eX = xScale(data[i+1].year);
                }else{
                    eX = width-margin.left;
                }
                if(mxy[0]>=xScale(data[i].year) && mxy[0]<eX){
                    var j = 0;
                    for(var item in colors){
                        txtArray[j].text(item+": "+data[i][item]);
                        j++;
                    }
                    if(mxy[0]>width-200-margin.right){
                        tipbg.attr("x",mxy[0]-200-5);
                        d3.selectAll(".tiptxt").attr("x",mxy[0]-200+5);
                    }else{
                        tipbg.attr("x",mxy[0]+5);
                        d3.selectAll(".tiptxt").attr("x",mxy[0]+15);
                    }
                    tipTitle.text("Year: "+data[i].year);
                    tipLine.attr("x1",mxy[0]).attr("x2",mxy[0])
                    break;
                }
            }
        })
        .on("mouseout",function(){
                
            d3.selectAll(".tiptxt").style("display","none");
            tipbg.style("display","none");
            tipLine.attr("x1",-1000).attr("x2",-1000);
                
        })
        
				
	});
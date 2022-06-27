const margin = {top: 20, right: 60, bottom: 30, left: 60};
var currWaterLevel = 0
var currRainLevel = 0

var graph_height = 380

create_graph_months = function() {

    var graph = d3.select("#graph")
    var currWidth = graph.node().getBoundingClientRect().width - margin.left - margin.right;
    var currHeight = 250 - margin.top - margin.bottom;
    const year = Number(d3.select('p#value-time').text())
    const data = all_data[year]

    graph = d3.select("#graph")
    .append("svg")
        .attr("width", currWidth + margin.left + margin.right)
        .attr("height", currHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    
    // Add X axis --> it is a date format
    const x = d3.scaleTime()
    .domain([new Date((year).toString() + "-01-01"), new Date(year.toString()+ "-12-01")])
    .range([ 0, currWidth-margin.right ])
    graph.append("g")
    .attr("transform", `translate(${margin.left/2}, ${currHeight})`)
    .call(d3.axisBottom(x));

    // Add Y axis
    const water_level = Array.from(data.map(element => element.water_level))
    const yLeft = d3.scaleLinear()
    .domain([Math.min(...water_level) - 1, Math.max(...water_level) + 1])
    .range([ currHeight, 0 ]);
    graph.append("g")
    .call(d3.axisLeft(yLeft));

    const rain_level = Array.from(data.map(element => element.rain_level))
    const yRight = d3.scaleLinear()
    .domain([Math.min(...rain_level) - 1, Math.max(...rain_level) + 1])
    .range([ currHeight, 0 ]);
    graph.append("g")
    .attr("transform", `translate(${currWidth}, 0)`)
    .call(d3.axisRight(yRight));
 
    graph.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
          .attr("x", d => x(d.month))
          .attr("y", d => yRight(d.rain_level))
          .attr("transform", `translate(15,0)`)
          .attr("width", 30)
          .attr("height", d => currHeight - yRight(d.rain_level))
          .attr("fill", "#1F88F833")

    graph.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3)
        .attr("transform", `translate(${margin.left/2},0)`)
        .attr("d", d3.line()
            .x(function(d) { return x(d.month) })
            .y(function(d) { return yLeft(d.water_level) }))

    graph.selectAll('circle_samp')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d) => x(d.month))
        .attr('cy', (d) => yLeft(d.water_level))
        .attr("transform", `translate(${margin.left/2}, 0)`)
        .attr('r', 6)
        .attr('fill', '#1F88F8')
        .attr('class', 'points')
        .style('pointer-events', 'all')
        .append('title')
        .text(function (d) {
            return (
            'Water Level: ' + d.water_level + '\n' + 'Rain Amount ' + d.rain_level
            );
        });

    graph.selectAll("highlightOnHover")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", d => x(d.month))
      .attr("y", d => yRight(Math.max(...rain_level) + 1))
      .attr("transform", `translate(15,0)`)
      .attr("width", 30)
      .attr("height", d =>  yRight(yRight(Math.max(...rain_level) + 1)))
      .attr("fill", "#74739D80")
      .attr('class', 'rectSelect')
      .style('pointer-events', 'all')
      .on('click', (event, d) => {


        maxWaterLevel = -208
        minWaterLevel = -215
        
        if (d.rain_level == 0) {
            currRainLevel = 0
        } else {
            currRainLevel = d.rain_level / Math.max(...rain_level)
        }

        if (d.water_level == 0) {
            currWaterLevel = 0
        } else {
            currWaterLevel = 1 - ((d.water_level - maxWaterLevel) / (minWaterLevel - maxWaterLevel))
        }
        
        console.log(currWaterLevel)
        const rain_height = 380 - currRainLevel*graph_height
        const water_height = 380 - currWaterLevel*graph_height

        console.log(rain_height, water_height)

        d3.select("#boxMapLeft").style("height", rain_height + "px")
        d3.select("#boxMapRight").style("height", water_height + "px")
        d3.select("#centerMapLabel #title").text(d.month.toLocaleString('default', { month: 'long' }))
        d3.select("#centerMapLabel #waterLevel").text("Water Level: " + d.water_level.toFixed(1))
        d3.select("#centerMapLabel #rainLevel").text("Rain Level: " + d.rain_level.toFixed(1))
      })


}


create_graph_years = function() {

    var graph = d3.select("#graph")
    var currWidth = graph.node().getBoundingClientRect().width - margin.left - margin.right;
    var currHeight = 250 - margin.top - margin.bottom;
    graph = d3.select("#graph")
    .append("svg")
        .attr("width", currWidth + margin.left + margin.right)
        .attr("height", currHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    
    // Add X axis --> it is a date format
    const x = d3.scaleLinear()
    .domain([1977, 2022])
    .range([ 0, currWidth-margin.right ])
    graph.append("g")
    .attr("transform", `translate(${margin.left/2}, ${currHeight})`)
    .call(d3.axisBottom(x));

    // Add Y axis
    const water_level = []
    Object.keys(year_data).map(function(key, index) {
        water_level.push(year_data[key].water_level)
      });
    console.log(water_level)
    // const water_level = Array.from(data.map(element => element.water_level))
    const yLeft = d3.scaleLinear()
    .domain([Math.min(...water_level) - 1, Math.max(...water_level) + 1])
    .range([ currHeight, 0 ]);
    graph.append("g")
    .call(d3.axisLeft(yLeft));

    const rain_level = []
    
    Object.keys(year_data).map(function(key, index) {
        rain_level.push(year_data[key].rain_level)
      });
    const yRight = d3.scaleLinear()
    .domain([0, Math.max(...rain_level) + 1])
    .range([ currHeight, 0 ]);
    graph.append("g")
    .attr("transform", `translate(${currWidth}, 0)`)
    .call(d3.axisRight(yRight));
 
    graph.selectAll("mybar")
        .data(year_data)
        .enter()
        .append("rect")
          .attr("x", d => x(d.year))
          .attr("y", d => yRight(d.rain_level))
          .attr("transform", `translate(15,0)`)
          .attr("width", 10)
          .attr("height", d => currHeight - yRight(d.rain_level))
          .attr("fill", "#1F88F833")

    graph.append("path")
        .datum(year_data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3)
        .attr("transform", `translate(20,0)`)
        .attr("d", d3.line()
            .x(function(d) { return x(d.year) })
            .y(function(d) { return yLeft(d.water_level) }))

    graph.selectAll('circle_samp')
        .data(year_data)
        .enter()
        .append('circle')
        .attr('cx', (d) => x(d.year))
        .attr('cy', (d) => yLeft(d.water_level))
        .attr("transform", `translate(20, 0)`)
        .attr('r', 6)
        .attr('fill', '#1F88F8')
        .attr('class', 'points')
        .style('pointer-events', 'all')
        .append('title')
        .text(function (d) {
            return (
            'Water Level: ' + d.water_level + '\n' + 'Rain Amount ' + d.rain_level
            );
        });

    graph.selectAll("highlightOnHover")
    .data(year_data)
    .enter()
    .append("rect")
      .attr("x", d => x(d.year))
      .attr("y", d => yRight(Math.max(...rain_level) + 1))
      .attr("transform", `translate(15,0)`)
      .attr("width", 10)
      .attr("height", d =>  yRight(yRight(Math.max(...rain_level) + 1)))
      .attr("fill", "#74739D80")
      .attr('class', 'rectSelect')
      .style('pointer-events', 'all')
      .on('click', (event, d) => {


        maxWaterLevel = -208
        minWaterLevel = -215
        
        if (d.rain_level == 0) {
            currRainLevel = 0
        } else {
            currRainLevel = d.rain_level / Math.max(...rain_level)
        }

        if (d.water_level == 0) {
            currWaterLevel = 0
        } else {
            currWaterLevel = 1 - ((d.water_level - maxWaterLevel) / (minWaterLevel - maxWaterLevel))
        }
        
        const rain_height = 380 - currRainLevel*graph_height
        const water_height = 380 - currWaterLevel*graph_height

        console.log(d)
        d3.select("#boxMapLeft").style("height", rain_height + "px")
        d3.select("#boxMapRight").style("height", water_height + "px")
        d3.select("#centerMapLabel #title").text(d.year)
        d3.select("#centerMapLabel #waterLevel").text("Max Water Level: " + d.water_level.toFixed(1))
        d3.select("#centerMapLabel #rainLevel").text("Total Rain Amount: " + d.rain_level.toFixed(1))
      })


}



function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  
  // Usage!
  sleep(2000).then(() => {
      // Do something after the sleep!
      create_graph_months()
  });


function resizedw(){
    // Haven't resized in 100ms!
    d3.select("#graph").select("svg").remove()
    create_graph_months()

}

var doit;
window.onresize = function(){
  clearTimeout(doit);
  doit = setTimeout(resizedw, 300);
};



function switchType() {
    visible = d3.select("#topSlider").style("visibility")
    if (visible == "visible") {
        d3.select("#graph").selectAll("svg").remove()
        d3.select("#topSlider").style("visibility", "hidden")
        create_graph_years()

    } else {
        d3.select("#graph").selectAll("svg").remove()
        d3.select("#topSlider").style("visibility", "visible")
        create_graph_months()
    }
    
   
}
const margin = {top: 20, right: 60, bottom: 30, left: 60};

create_graph = function() {

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
    const water_levels = Array.from(data.map(element => element.water_level))
    const yLeft = d3.scaleLinear()
    .domain([Math.min(...water_levels) - 1, Math.max(...water_levels) + 1])
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
    }

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  
  // Usage!
  sleep(2000).then(() => {
      // Do something after the sleep!
      create_graph()
  });


function resizedw(){
    // Haven't resized in 100ms!
    d3.select("#graph").select("svg").remove()
    create_graph()

}

var doit;
window.onresize = function(){
  clearTimeout(doit);
  doit = setTimeout(resizedw, 300);
};


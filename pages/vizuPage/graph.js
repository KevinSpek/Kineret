const margin = {top: 20, right: 60, bottom: 30, left: 60};
var all_data = {};

read_data = function() {

    d3.csv("data/kineret.csv",
    
    function(d){
        if (!(d.year in all_data)) {
            all_data[d.year] = []
        }
        all_data[d.year].push({
            month: d3.timeParse("%Y-%m-%d")(d.year.toString() + "-" + d.month + "-01"),
            water_level: Number(d.Kinneret_Level),
            rain_level: Number(d.Rain_Amount),
        })
    })
}

read_data()

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
    const graph = d3.select("#graph")
    currWidth = graph.node().getBoundingClientRect().width - margin.left - margin.right;
    createGraph()

}

var doit;
window.onresize = function(){
  clearTimeout(doit);
  doit = setTimeout(resizedw, 300);
};


d3.select('p#value-time')
.on('onchange', val => {
    console.log("Hello!")
    d3.select("#graph").select("svg").remove()
    create_graph();
  });

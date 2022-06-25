const margin = {top: 20, right: 30, bottom: 30, left: 60};


createGraph = function() {

    var graph = d3.select("#graph")
    var currWidth = graph.node().getBoundingClientRect().width - margin.left - margin.right;
    var currHeight = 250 - margin.top - margin.bottom;
    
    graph = d3.select("#graph")
    .append("svg")
        .attr("width", currWidth + margin.left + margin.right)
        .attr("height", currHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    //Read the data

    d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",

    // When reading the csv, I must format variables:
    function(d){
        return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value }
    }).then(

    // Now I can use this dataset:
    function(data) {
        // Add X axis --> it is a date format
        const x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.date; }))
        .range([ 0, currWidth ]);
        graph.append("g")
        .attr("transform", `translate(0, ${currHeight})`)
        .call(d3.axisBottom(x));

        // Add Y axis
        const y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.value; })])
        .range([ currHeight, 0 ]);
        graph.append("g")
        .call(d3.axisLeft(y));

        // Add the line
        graph.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return x(d.date) })
            .y(function(d) { return y(d.value) })
            )
        })
}

createGraph();

function resizedw(){
    // Haven't resized in 100ms!
    d3.select("#graph").select("svg").remove()
    const graph = d3.select("#graph")
    currWidth = graph.node().getBoundingClientRect().width - margin.left - margin.right;
    createGraph(currWidth, 250)

}

var doit;
window.onresize = function(){
  clearTimeout(doit);
  doit = setTimeout(resizedw, 300);
};


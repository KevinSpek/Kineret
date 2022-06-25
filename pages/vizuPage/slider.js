var dataTime = d3.range(0, 52).map(function(d) {
  return new Date(1970 + d, 10, 3);
});

var sliderTime = d3
  .sliderBottom()
  .min(d3.min(dataTime))
  .max(d3.max(dataTime))
  .step(1000 * 60 * 60 * 24 * 365)
  .width($(window).width()*0.5)
  .ticks(0)
  .default(new Date(1980, 10, 3))
  .displayValue(false)
  .handle(
      d3.symbol()
        .type(d3.symbolCircle)
        .size(400)
    )
  .fill("#8381F5")
  .on('onchange', val => {
    d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
    d3.select("#graph").select("svg").remove()
    create_graph();
  });

var gTime = d3
  .select('div#slider-time')
  .append('svg')
  .attr('width', $(window).width()*0.6)
  .attr('height', 100)

  .append('g')
  .attr('transform', 'translate(30,30)');

gTime.call(sliderTime);

d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));

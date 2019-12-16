const worldMapSvg = d3.select('#worldMap');

const gMap = worldMapSvg.append('g');
const tooltip = d3.select('body').append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0);

const projection = d3.geoMercator()
  .center([2, 47])
  .scale(100);

function drawMap() {
  d3.json('https://PersonofNote.github.io/d3-visualization-map-test/world-110m.geojson', (data) => {
    const land = gMap.selectAll('path')
      .data(data.features)
      .enter()
      .append('path')
      .attr('class', 'landpath')
      .attr('d', d3.geoPath()
        .projection(projection))
      .on('mouseover', (d) => {
        tooltip.transition()
          .duration(200)
          .style('opacity', 0.9);
        tooltip.html(d.properties.name)
          .style('left', `${d3.event.pageX + 25}px`)
          .style('top', `${d3.event.pageY - 28}px`);
      })
      .on('mouseout', (d) => {
        tooltip.transition()
          .duration(300)
          .style('opacity', 0);
      });
    land.transition()
      .ease(d3.easeLinear)
      .duration(4000)
      .style('stroke-dashoffset', 0)
      .transition(200)
      .style('fill', '#a9bcd0');
    breakLand();
  });
}



drawMap();

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
  });
}

function animateDraw() {
  const land = gMap.selectAll('path');
  land.style('stroke-dashoffset', 1500)
    .style('fill', '#d8dbe2')
    .transition()
    .delay(200)
    .ease(d3.easePolyIn)
    .duration(4000)
    .style('stroke-dashoffset', 0);
}

function animateMove() {
  const land = gMap.selectAll('path');
  land.style('fill', '#a9bcd0')
    .attr('transform', (d) => randomizePos(d))
    .transition()
    .delay(200)
    .duration(1000)
    .ease(d3.easePolyOut)
    .attr('transform', 'translate(0,0)');
}

function randomizePos(d) {
  // TODO: Implement more elegant const declaration
  const maxx = window.innerHeight * 2;
  const minx = window.innerHeight;
  const maxy = window.innerWidth * 2;
  const miny = window.innerWidth;
  let tx = Math.random() * (maxx - minx) + minx;
  let ty = Math.random() * (maxy - miny) + miny;
  tx *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
  if (d.properties.name != 'Antarctica') {
    ty *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
  }
  return `translate(${tx}, ${ty})`;
}

function addButtonHandlers() {
  document.getElementById('draw-button').addEventListener('click', () => {
    animateDraw();
  });
  document.getElementById('animate-button').addEventListener('click', () => {
    animateMove();
  });
}

addButtonHandlers();
drawMap();

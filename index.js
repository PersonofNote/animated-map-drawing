const worldMapSvg = d3.select('#worldMap');

/**
 *  Data from The Meteoritical Society
 * https://catalog.data.gov/dataset/meteorite-landings-api/resource/d28bab4e-305b-46b9-8ced-af8494af0963
 * 
 */
const meteorData = 'https://data.nasa.gov/resource/gh4g-9sfh.json';

const gMap = worldMapSvg.append('g');
const tooltip = d3.select('body').append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0)
  .style('scale', 0.1);

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
  drawDots();
}

function animateDraw(clear, callback) {
  clear();
  const land = gMap.selectAll('path');
  land.style('stroke-dashoffset', 1500)
    .style('fill', '#d8dbe2')
    .transition()
    .delay(200)
    .ease(d3.easePolyIn)
    .duration(4000)
    .style('stroke-dashoffset', 0)
  setTimeout(function(){ callback(); }, 4000);
}

function animateMove(clear, callback) {
  clear();
  const land = gMap.selectAll('path');
  land.style('fill', '#a9bcd0')
    .attr('transform', (d) => randomizePos(d))
    .transition()
    .delay(200)
    .duration(1000)
    .ease(d3.easePolyOut)
    .attr('transform', 'translate(0,0)');
    setTimeout(function(){ callback(); }, 1100);
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

const colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]

function drawDots() {
  d3.json(meteorData, (data) => {
    const dots = worldMapSvg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 0)
      .attr('transform', (d) => `translate(${projection([d.reclong, d.reclat])})`);

    dots.transition()
      .delay(function(d,i){ return 1.5*i; })
      .ease(d3.easeBackOut)
      .duration(500)
      .attr('r', 5);

    dots.on('mouseover', (d) => {
      const yearDate = new Date(d.year)
      const formatYear = yearDate.toLocaleDateString('en-US');
      tooltip.transition()
        .duration(200)
        .style('opacity', 0.9)
        .style('scale', 1);
      tooltip.html(`Meteor ${d.name}, mass ${d.mass}, fell on ${formatYear}`)
        .style('left', `${d3.event.pageX + 25}px`)
        .style('top', `${d3.event.pageY - 28}px`);
    })
      .on('mouseout', () => {
        tooltip.transition()
          .duration(300)
          .style('opacity', 0);
      });
  });
}

function clearDots() {
  worldMapSvg.selectAll('circle').remove();
}

function addButtonHandlers() {
  document.getElementById('draw-button').addEventListener('click', () => {
    animateDraw(clearDots, drawDots);
  });
  document.getElementById('animate-button').addEventListener('click', () => {
    animateMove(clearDots, drawDots);
  });
}


addButtonHandlers();
drawMap();

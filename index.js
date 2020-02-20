const worldMapSvg = d3.select('#worldMap');

const meteorData = 'https://data.nasa.gov/resource/gh4g-9sfh.json';

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
  drawDots();
}

function animateDraw() {
  clearDots();
  const land = gMap.selectAll('path');
  land.style('stroke-dashoffset', 1500)
    .style('fill', '#d8dbe2')
    .transition()
    .delay(200)
    .ease(d3.easePolyIn)
    .duration(4000)
    .style('stroke-dashoffset', 0);
    drawDots();
}

function animateMove() {
  clearDots();
  const land = gMap.selectAll('path');
  land.style('fill', '#a9bcd0')
    .attr('transform', (d) => randomizePos(d))
    .transition()
    .delay(200)
    .duration(1000)
    .ease(d3.easePolyOut)
    .attr('transform', 'translate(0,0)')
    .on("end", drawDots);
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


function drawDots() {
  d3.json(meteorData, (data) => {
    const dots = worldMapSvg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 1)
      .attr('transform', (d) => `translate(${projection([d.reclong, d.reclat])})`);

    dots.transition()
      .duration(1000)
      .attr('r', 5);

    dots.on('mouseover', (d) => {
      tooltip.transition()
        .duration(200)
        .style('opacity', 0.9);
      tooltip.html(`Meteor ${d.name}, mass ${d.mass}, fell in ${d.year}`)
        .style('left', `${d3.event.pageX + 25}px`)
        .style('top', `${d3.event.pageY - 28}px`);
    })
      .on('mouseout', () => {
        tooltip.transition()
          .duration(300)
          .style('opacity', 0);
      });

    const keys = Object.keys(data);
    const values = Object.values(data);
    for (let i = 0; i < keys.length; i += 1) {
      console.log(values[i]);
    }
  });
}

function clearDots() {
  worldMapSvg.selectAll('circle').remove();
}

addButtonHandlers();
drawMap();

// src/components/TimeSeriesDecomposition.jsx

import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

const TimeSeriesDecomposition = ({ width, height }) => {
  const [data, setData] = useState([]);
  const [component, setComponent] = useState('Trend');

  useEffect(() => {
    d3.csv('/PJME_decomposed.csv').then(data => {
      data.forEach(d => {
        d.Date = d3.timeParse('%Y-%m-%d')(d.Date);
        d.Trend = +d.Trend;
        d.Seasonal = +d.Seasonal;
        d.Residual = +d.Residual;
      });
      setData(data);
    });
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const svg = d3.select('#decomposition-chart');
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const contentWidth = width - margin.left - margin.right;
    const contentHeight = height - margin.top - margin.bottom;

    // Clear previous content
    svg.selectAll('*').remove();

    // Append a group element
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Set the scales
    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.Date))
      .range([0, contentWidth]);

    const y = d3.scaleLinear()
      .domain(d3.extent(data, d => d[component]))
      .range([contentHeight, 0]);

    // Add X axis
    g.append('g')
      .attr('transform', `translate(0,${contentHeight})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    g.append('g')
      .call(d3.axisLeft(y));

    // Add X axis label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .text('Date');

    // Add Y axis label
    svg.append('text')
      .attr('x', -(height / 2))
      .attr('y', 15)
      .attr('transform', 'rotate(-90)')
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .text(component);

    // Draw the line
    const line = d3.line()
      .x(d => x(d.Date))
      .y(d => y(d[component]));

    const path = g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    // Animate the line drawing
    const totalLength = path.node().getTotalLength();

    path
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);

  }, [data, component, width, height]);

  return (
    <div>
      <div className='btn-div'>
        <button onClick={() => setComponent('Trend')}>Trend</button>
        <button onClick={() => setComponent('Seasonal')}>Seasonal</button>
        <button onClick={() => setComponent('Residual')}>Residual</button>
      </div>
      <svg id="decomposition-chart" width={width} height={height}></svg>
    </div>
  );
};

export default TimeSeriesDecomposition;

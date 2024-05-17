// src/components/BarChart.jsx

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data, width, height }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (data.length === 0) {
      console.log("No data available");
      return;
    }

    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 30, bottom: 80, left: 60 };
    const contentWidth = width - margin.left - margin.right;
    const contentHeight = height - margin.top - margin.bottom;

    // Clear previous content
    svg.selectAll('*').remove();

    // Append a group element
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Set the scales
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.avg)])
      .range([0, contentWidth]);

    const y = d3.scaleBand()
      .domain(data.map(d => d.year))
      .range([0, contentHeight])
      .padding(0.1);

    // Add X axis
    g.append('g')
      .attr('transform', `translate(0,${contentHeight})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    g.append('g')
      .call(d3.axisLeft(y).tickFormat(d3.format('d')));

    // Add X axis label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .text('Average Daily Consumption (MW)');

    // Add Y axis label
    svg.append('text')
      .attr('x', -(height / 2))
      .attr('y', 20)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .text('Year');

    // Draw the bars
    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('y', d => y(d.year))
      .attr('width', 0) // Start width at 0 for transition
      .attr('height', y.bandwidth())
      .attr('fill', 'steelblue')
      .attr('stroke', 'white')
      .attr('stroke-width', '2px')
      .transition()
      .duration(1000)
      .attr('width', d => x(d.avg));

    // Add labels
    g.selectAll('.label')
      .data(data)
      .enter().append('text')
      .attr('class', 'label')
      .attr('x', d => x(d.avg) + 5)
      .attr('y', d => y(d.year) + y.bandwidth() / 2)
      .attr('text-anchor', 'start')
      .attr('alignment-baseline', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '10px')
      .text(d => d.avg.toFixed(2));

  }, [data, width, height]);

  return (
    <svg ref={svgRef} width={width} height={height}></svg>
  );
};

export default BarChart;

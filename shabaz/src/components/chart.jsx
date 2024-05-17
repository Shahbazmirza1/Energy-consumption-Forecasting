// src/components/chart.jsx

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const EnergyChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (data.length === 0) {
      console.log("No data available");
      return;
    }

    const svg = d3.select(svgRef.current);
    const width = svg.attr('width');
    const height = svg.attr('height');
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const contentWidth = width - margin.left - margin.right;
    const contentHeight = height - margin.top - margin.bottom;

    // Clear previous content
    svg.selectAll('*').remove();

    // Append a group element
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create a gradient
    svg.append('defs').append('linearGradient')
      .attr('id', 'areaGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%')
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'steelblue')
      .attr('stop-opacity', 0.8)
      .select(function() { return this.parentNode; })
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'steelblue')
      .attr('stop-opacity', 0.2);

    // Set the scales
    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([0, contentWidth]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .range([contentHeight, 0]);

    // Add X axis grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${contentHeight})`)
      .call(d3.axisBottom(x)
        .ticks(d3.timeDay.every(1))
        .tickFormat(d3.timeFormat("%d"))
        .tickSize(-contentHeight)
        .tickPadding(10)
      )
      .selectAll('line')
      .style('stroke', '#ccc');

    // Add Y axis grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y)
        .tickSize(-contentWidth)
        .tickPadding(10)
      )
      .selectAll('line')
      .style('stroke', '#ccc');

    // Add X axis label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .text('Date');

    // // Add Y axis label
    // svg.append('text')
    //   .attr('x', -(height / 2))
    //   .attr('y', 20)
    //   .attr('transform', 'rotate(-90)')
    //   .attr('text-anchor', 'middle')
    //   .text('Energy Consumption (MW)');

    // Draw the area
    const area = d3.area()
      .curve(d3.curveMonotoneX)
      .x(d => x(d.date))
      .y0(contentHeight)
      .y1(d => y(d.value));

    g.append('path')
      .datum(data)
      .attr('fill', 'url(#areaGradient)')
      .attr('d', area)
      .attr('opacity', 0)
      .transition()
      .duration(2000)
      .attr('opacity', 1);

    // Draw the line
    const line = d3.line()
      .curve(d3.curveMonotoneX)
      .x(d => x(d.date))
      .y(d => y(d.value));

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

    // Highlight the peak
    const peak = d3.max(data, d => d.value);
    const peakData = data.find(d => d.value === peak);

    g.append('circle')
      .attr('cx', x(peakData.date))
      .attr('cy', y(peakData.value))
      .attr('r', 4)
      .attr('fill', 'red')
      .attr('opacity', 0)
      .transition()
      .duration(2000)
      .delay(2000)
      .attr('opacity', 1);

    g.append('text')
      .attr('x', x(peakData.date))
      .attr('y', y(peakData.value) - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', 'red')
      .attr('opacity', 0)
      .transition()
      .duration(2000)
      .delay(2000)
      .attr('opacity', 1)
      .text(`Peak: ${peakData.value} MW`);

  }, [data]);

  return (
    <svg ref={svgRef} width="700" height="300"></svg>
  );
};

export default EnergyChart;

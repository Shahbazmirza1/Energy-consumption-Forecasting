// src/components/YearlyLineChart.jsx

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const YearlyLineChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (data.length === 0) {
      console.log("No data available");
      return;
    }

    const svg = d3.select(svgRef.current);
    const width = svg.attr('width');
    const height = svg.attr('height');
    const margin = { top: 20, right: 50, bottom: 50, left: 70 };
    const contentWidth = width - margin.left - margin.right;
    const contentHeight = height - margin.top - margin.bottom;

    // Clear previous content
    svg.selectAll('*').remove();

    // Append a group element
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create a gradient for the area
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
    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year))
      .range([0, contentWidth]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.total)])
      .range([contentHeight, 0]);

    // Add X axis
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

    // Add Y axis
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
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .text('Year');

    // Add Y axis label
    svg.append('text')
      .attr('x', -(height / 2))
      .attr('y', 20)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      // .text('Total Consumption (MW)');

    // Draw the area
    const area = d3.area()
      .curve(d3.curveMonotoneX)
      .x(d => x(d.year))
      .y0(contentHeight)
      .y1(d => y(d.total));

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
      .x(d => x(d.year))
      .y(d => y(d.total));

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

    // Create tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #ccc")
      .style("padding", "10px")
      .style("border-radius", "5px")
      .style("opacity", 0);

    // Highlight points and add tooltip functionality
    g.selectAll('.point')
      .data(data)
      .enter().append('circle')
      .attr('class', 'point')
      .attr('cx', d => x(d.year))
      .attr('cy', d => y(d.total))
      .attr('r', 5)
      .attr('fill', 'red')
      .attr('opacity', 0)
      .on("mouseover", function(event, d) {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(`Year: ${d.year}<br/>Total: ${d.total.toLocaleString()}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        tooltip.transition().duration(500).style("opacity", 0);
      })
      .transition()
      .duration(2000)
      .delay(2000)
      .attr('opacity', 1);

  }, [data]);

  return (
    <svg ref={svgRef} width="700" height="300"></svg>
  );
};

export default YearlyLineChart;

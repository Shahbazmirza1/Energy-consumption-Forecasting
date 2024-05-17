import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import EnergyChart from './chart.jsx';
import BarChart from './BarChart.jsx';
import YearlyLineChart from './LineChart.jsx';
import TimeSeriesDecomposition from './seasonal.jsx';
import './About.css'
// import '';

const SVG_WIDTH = 600;
const SVG_HEIGHT = 400;

const About = () => {
  const [lineChartData, setLineChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [yearlyLineChartData, setYearlyLineChartData] = useState([]);

  useEffect(() => {
    d3.csv('/PJME_hourly.csv').then(data => {
      data.forEach(d => {
        d.timestamp = d3.timeParse('%Y-%m-%d %H:%M:%S')(d.Datetime);
        d.value = +d.PJME_MW;
      });

      // Filter data for the year 2018 and prepare for line chart
      const data2018 = data.filter(d => d.timestamp.getFullYear() === 2018);

      // Aggregate data by day for the line chart
      const dailyData = d3.rollups(
        data2018,
        v => d3.sum(v, d => d.value),
        d => d3.timeDay(d.timestamp)
      ).map(([date, value]) => ({ date, value }));

      // Group data by month and calculate total consumption per month
      const monthlyConsumption = d3.rollup(
        dailyData,
        v => d3.sum(v, d => d.value),
        d => d.date.getMonth()
      );

      // Find the month with the maximum consumption
      const maxMonth = Array.from(monthlyConsumption).reduce((max, curr) => curr[1] > max[1] ? curr : max)[0];

      // Filter data for the month with the maximum consumption
      const maxMonthData = dailyData.filter(d => d.date.getMonth() === maxMonth);

      setLineChartData(maxMonthData);

      // Prepare data for the bar chart (2010 to 2018)
      const data2010to2018 = data.filter(d => d.timestamp.getFullYear() >= 2010 && d.timestamp.getFullYear() <= 2018);
      const yearlyConsumption = d3.rollup(
        data2010to2018,
        v => d3.sum(v, d => d.value),
        d => d.timestamp.getFullYear()
      );

      const yearlyAvgConsumption = Array.from(yearlyConsumption, ([year, total]) => {
        const daysInYear = d3.timeDays(new Date(year, 0, 1), new Date(year + 1, 0, 1)).length;
        const avg = total / daysInYear;
        return { year, avg };
      });

      setBarChartData(yearlyAvgConsumption);

      // Prepare data for the yearly line chart (2002 to 2018)
      const data2002to2018 = data.filter(d => d.timestamp.getFullYear() >= 2002 && d.timestamp.getFullYear() <= 2018);
      const yearlyTotalConsumption = d3.rollup(
        data2002to2018,
        v => d3.sum(v, d => d.value),
        d => d.timestamp.getFullYear()
      );

      const yearlyLineData = Array.from(yearlyTotalConsumption, ([year, total]) => ({ year, total }));

      setYearlyLineChartData(yearlyLineData);
    });
  }, []);

  return (
    <div className='about-container'>
      <h2 className='center-h2'>Vusualizing Base Data</h2>
      <div className="chart-container">
      <div className="chart-item">
            <h2>Yearly Total Consumption</h2>
            <YearlyLineChart data={yearlyLineChartData} width={SVG_WIDTH} height={SVG_HEIGHT} />
          </div>
          <div className="chart-item">
            <h2>Yearly Average Consumption</h2>
            <BarChart data={barChartData} width={SVG_WIDTH} height={SVG_HEIGHT} />
          </div>

          <div className="chart-item">
            <h2>Daily Consumption</h2>
            <EnergyChart data={lineChartData} width={SVG_WIDTH} height={SVG_HEIGHT} />
            </div>
            <div className="chart-item">
            <h2>Time Series Decomposition</h2>
            <TimeSeriesDecomposition width={SVG_WIDTH} height={SVG_HEIGHT} />
          </div>
      </div>
      
    </div>
  );
};

export default About;
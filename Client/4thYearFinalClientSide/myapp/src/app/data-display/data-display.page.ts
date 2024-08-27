import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-display',
  templateUrl: './data-display.page.html',
  styleUrls: ['./data-display.page.scss'],
})
export class DataDisplayPage implements OnInit {
  weatherData = [
    { time: '00:00', airTemperature: 15, waveHeight: 1.2, windSpeed: 5, waveDirection: 90 },
    { time: '01:00', airTemperature: 16, waveHeight: 1.3, windSpeed: 6, waveDirection: 95 },
    { time: '02:00', airTemperature: 15, waveHeight: 1.1, windSpeed: 4, waveDirection: 88 },
    { time: '03:00', airTemperature: 14, waveHeight: 1.0, windSpeed: 4, waveDirection: 85 },
    { time: '04:00', airTemperature: 13, waveHeight: 1.1, windSpeed: 3, waveDirection: 80 },
    { time: '05:00', airTemperature: 12, waveHeight: 1.0, windSpeed: 3, waveDirection: 75 },
    { time: '06:00', airTemperature: 13, waveHeight: 1.2, windSpeed: 4, waveDirection: 78 },
    { time: '07:00', airTemperature: 14, waveHeight: 1.3, windSpeed: 5, waveDirection: 82 },
    { time: '08:00', airTemperature: 15, waveHeight: 1.4, windSpeed: 6, waveDirection: 85 },
    { time: '09:00', airTemperature: 16, waveHeight: 1.5, windSpeed: 6, waveDirection: 88 },
    { time: '10:00', airTemperature: 17, waveHeight: 1.6, windSpeed: 7, waveDirection: 90 },
    { time: '11:00', airTemperature: 18, waveHeight: 1.7, windSpeed: 7, waveDirection: 92 },
    { time: '12:00', airTemperature: 19, waveHeight: 1.8, windSpeed: 8, waveDirection: 95 },
    { time: '13:00', airTemperature: 20, waveHeight: 1.9, windSpeed: 8, waveDirection: 98 },
    { time: '14:00', airTemperature: 21, waveHeight: 2.0, windSpeed: 9, waveDirection: 100 },
    { time: '15:00', airTemperature: 22, waveHeight: 2.1, windSpeed: 9, waveDirection: 102 },
    { time: '16:00', airTemperature: 23, waveHeight: 2.2, windSpeed: 10, waveDirection: 105 },
    { time: '17:00', airTemperature: 22, waveHeight: 2.1, windSpeed: 9, waveDirection: 103 },
    { time: '18:00', airTemperature: 21, waveHeight: 2.0, windSpeed: 8, waveDirection: 100 },
    { time: '19:00', airTemperature: 20, waveHeight: 1.9, windSpeed: 7, waveDirection: 97 },
    { time: '20:00', airTemperature: 19, waveHeight: 1.8, windSpeed: 6, waveDirection: 95 },
    { time: '21:00', airTemperature: 18, waveHeight: 1.7, windSpeed: 6, waveDirection: 92 },
    { time: '22:00', airTemperature: 17, waveHeight: 1.6, windSpeed: 5, waveDirection: 90 },
    { time: '23:00', airTemperature: 16, waveHeight: 1.5, windSpeed: 5, waveDirection: 88 },
  ];

  tideData = [
    { time: '00:00', height: 2.0, type: 'high' },
    { time: '06:00', height: 1.2, type: 'low' },
    { time: '12:00', height: 2.5, type: 'high' },
    { time: '18:00', height: 1.3, type: 'low' },
  ];

  constructor() {}

  ngOnInit() {
    this.drawCombinedChart();
  }

  drawCombinedChart() {
    const svgElement = document.getElementById('combinedSvg') as unknown as SVGSVGElement;
    const maxHeight = 100;
    const maxWidth = 600;
  
    if (svgElement) {
      svgElement.innerHTML = ''; // Clear previous elements
  
      const waveLine = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      const tideLine = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      let wavePoints = '';
      let tidePoints = '';
  
      this.weatherData.forEach((data, index) => {
        const x = (index * (maxWidth / (this.weatherData.length - 1)) + 50).toString();
        const waveY = (maxHeight - data.waveHeight * 20).toString();
        wavePoints += `${x},${waveY} `;
  
        // Add time labels on the x-axis
        const timeLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        timeLabel.setAttribute('x', x);
        timeLabel.setAttribute('y', (maxHeight + 15).toString()); // Position below the graph
        timeLabel.setAttribute('fill', 'black');
        timeLabel.setAttribute('font-size', '10');
        timeLabel.textContent = data.time;
        svgElement.appendChild(timeLabel);
      });
  
      this.tideData.forEach((data, index) => {
        const x = (index * (maxWidth / (this.tideData.length - 1)) + 50).toString();
        const tideY = (maxHeight - data.height * 20).toString();
        tidePoints += `${x},${tideY} `;
      });
  
      waveLine.setAttribute('points', wavePoints.trim());
      waveLine.setAttribute('fill', 'none');
      waveLine.setAttribute('stroke', 'blue');
      waveLine.setAttribute('stroke-width', '2');
  
      tideLine.setAttribute('points', tidePoints.trim());
      tideLine.setAttribute('fill', 'none');
      tideLine.setAttribute('stroke', 'green');
      tideLine.setAttribute('stroke-width', '2');
  
      svgElement.appendChild(waveLine);
      svgElement.appendChild(tideLine);
  
      this.addPeaksAndTroughs(svgElement, wavePoints, tidePoints);
  
      // Add a legend for the colored lines
      const legend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  
      const waveLegend = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      waveLegend.setAttribute('x', '50');
      waveLegend.setAttribute('y', (maxHeight + 30).toString()); // Position below the time labels
      waveLegend.setAttribute('fill', 'blue');
      waveLegend.setAttribute('font-size', '12');
      waveLegend.textContent = 'Wave Height';
  
      const tideLegend = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      tideLegend.setAttribute('x', '150');
      tideLegend.setAttribute('y', (maxHeight + 30).toString());
      tideLegend.setAttribute('fill', 'green');
      tideLegend.setAttribute('font-size', '12');
      tideLegend.textContent = 'Tide Height';
  
      legend.appendChild(waveLegend);
      legend.appendChild(tideLegend);
  
      svgElement.appendChild(legend);
    } else {
      console.error('SVG element not found.');
    }
  }

  addPeaksAndTroughs(svg: SVGSVGElement, wavePoints: string, tidePoints: string) {
    const waveArray = wavePoints.split(' ').map(p => p.split(',').map(Number));
    const tideArray = tidePoints.split(' ').map(p => p.split(',').map(Number));

    this.drawPeaksAndTroughs(svg, waveArray, 'blue');
    this.drawPeaksAndTroughs(svg, tideArray, 'green');
  }

  drawPeaksAndTroughs(svg: SVGSVGElement, pointsArray: number[][], color: string) {
    pointsArray.forEach((point, i) => {
      if (i > 0 && i < pointsArray.length - 1) {
        const prev = pointsArray[i - 1][1];
        const next = pointsArray[i + 1][1];
        const current = point[1];

        if ((current > prev && current > next) || (current < prev && current < next)) {
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('cx', point[0].toString());
          circle.setAttribute('cy', point[1].toString());
          circle.setAttribute('r', '3');
          circle.setAttribute('fill', color);
          svg.appendChild(circle);
        }
      }
    });
  }
}

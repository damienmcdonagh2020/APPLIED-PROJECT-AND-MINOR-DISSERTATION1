import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute

@Component({
  selector: 'app-data-display',
  templateUrl: './data-display.page.html',
  styleUrls: ['./data-display.page.scss'],
})
export class DataDisplayPage implements OnInit {
  weatherData: any[] = [];
  tideData: any[] = [];
  lat: number = 0;
  lng: number = 0;

  constructor(private http: HttpClient, private route: ActivatedRoute) {} // Inject ActivatedRoute

  ngOnInit() {
    // Read the coordinates from the query parameters
    this.route.queryParams.subscribe(params => {
      this.lat = +params['lat'];
      this.lng = +params['lng'];

      console.log(`Coordinates from URL - lat: ${this.lat}, lng: ${this.lng}`); // Debugging line

      if (this.lat && this.lng) {
        this.fetchChartData(this.lat, this.lng);
      } else {
        console.error('Coordinates not provided in URL');
      }
    });
  }

  fetchChartData(lat: number, lng: number) {
    const query = `
      query GetChartData($lat: Float!, $lng: Float!) {
        getWeatherData(lat: $lat, lng: $lng, params: "waveHeight,waveDirection") {
          time
          waveHeight
          waveDirection
        }
      }
    `;

    this.http.post<any>('http://localhost:4000/graphql', { query, variables: { lat, lng } })
      .subscribe(
        (response) => {
          console.log('GraphQL response:', response); // Debugging line
          const chartData = response.data.getWeatherData;
          if (chartData && chartData.length > 0) {
            this.updateChart(chartData);
          } else {
            console.warn('No chart data received.');
          }
        },
        (error) => {
          console.error('Error fetching chart data:', error);
        }
      );
  }

  updateChart(chartData: any) {
    console.log('Updating chart with data:', chartData); // Debugging line

    const wavePoints = chartData.map((data: any, index: number) => {
      const maxHeight = 100;
      const maxWidth = 600;
      const x = (index * (maxWidth / (chartData.length - 1)) + 50).toString();
      const waveY = (maxHeight - data.waveHeight * 20).toString();
      return `${x},${waveY}`;
    }).join(' ');

    this.drawCombinedChart(wavePoints, chartData);
  }

  drawCombinedChart(wavePoints: string, chartData: any) {
    const svgElement = document.getElementById('combinedSvg') as unknown as SVGSVGElement;
    const maxHeight = 100;
    const maxWidth = 600;

    if (svgElement) {
      svgElement.innerHTML = ''; // Clear previous elements

      const waveLine = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      waveLine.setAttribute('points', wavePoints.trim());
      waveLine.setAttribute('fill', 'none');
      waveLine.setAttribute('stroke', 'blue');
      waveLine.setAttribute('stroke-width', '2');
      svgElement.appendChild(waveLine);

      // Add time labels every 3 hours
      chartData.forEach((data: any, index: number) => {
        if (index % 3 === 0) { // Add label every 3rd hour
          const x = (index * (maxWidth / (chartData.length - 1)) + 50).toString();

          const timeLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          timeLabel.setAttribute('x', x);
          timeLabel.setAttribute('y', (maxHeight + 20).toString()); // Position below the graph
          timeLabel.setAttribute('fill', 'black');
          timeLabel.setAttribute('font-size', '10');
          timeLabel.setAttribute('text-anchor', 'middle');
          timeLabel.textContent = data.time; // Display the time
          svgElement.appendChild(timeLabel);
        }
      });

      // Add legends and labels
      const legend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  
      const waveLegend = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      waveLegend.setAttribute('x', '50');
      waveLegend.setAttribute('y', (maxHeight + 40).toString()); // Position below the time labels
      waveLegend.setAttribute('fill', 'blue');
      waveLegend.setAttribute('font-size', '12');
      waveLegend.textContent = 'Wave Height';

      legend.appendChild(waveLegend);
      svgElement.appendChild(legend);
    } else {
      console.error('SVG element not found.');
    }
  }
}

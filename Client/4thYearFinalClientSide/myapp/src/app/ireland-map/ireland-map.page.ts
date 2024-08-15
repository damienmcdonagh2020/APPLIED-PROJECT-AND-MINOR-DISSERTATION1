import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { GraphqlService } from '../graphql.service';

@Component({
  selector: 'app-ireland-map',
  templateUrl: './ireland-map.page.html',
  styleUrls: ['./ireland-map.page.scss'],
})
export class IrelandMapPage implements AfterViewInit {
  private map: L.Map | undefined;
  private selectedInterval: string = '00:00-06:00'; // Default interval

  constructor(private graphqlService: GraphqlService) { }

  ngAfterViewInit() {
    this.loadMap();
    setTimeout(() => {
      if (this.map instanceof L.Map) {
        this.map.invalidateSize();
      }
    }, 200);    
  }

  async getSurfDetails(lat: number, lng: number): Promise<any> {
    const query = `
      query GetWeather($lat: Float!, $lng: Float!) {
        getWeatherData(lat: $lat, lng: $lng, params: "airTemperature,waveHeight,waveDirection,windSpeed") {
          time
          airTemperature
          waveHeight
          waveDirection
          windSpeed
        }
      }
    `;

    return new Promise((resolve, reject) => {
      this.graphqlService.fetchData({ query: query, variables: { lat, lng } }).subscribe(response => {
        const weatherData = response.data.getWeatherData;
        const groupedData = this.groupByTimeInterval(weatherData);
        resolve(groupedData);
      }, reject);
    });
  }

  private groupByTimeInterval(data: any[]) {
    type IntervalData = {
      time: string;
      airTemperature?: number;
      waveHeight?: number;
      waveDirection?: number;
      windSpeed?: number;
    };

    const intervals: { [key: string]: IntervalData[] } = {
      '00:00-06:00': [],
      '06:00-12:00': [],
      '12:00-18:00': [],
      '18:00-00:00': []
    };

    data.forEach(entry => {
      const hour = new Date(entry.time).getUTCHours();
      if (hour >= 0 && hour < 6) {
        intervals['00:00-06:00'].push(entry);
      } else if (hour >= 6 && hour < 12) {
        intervals['06:00-12:00'].push(entry);
      } else if (hour >= 12 && hour < 18) {
        intervals['12:00-18:00'].push(entry);
      } else if (hour >= 18 && hour < 24) {
        intervals['18:00-00:00'].push(entry);
      }
    });

    return intervals;
  }

  private loadMap() {
    const defaultIcon = L.icon({
      iconUrl: 'assets/icon/leaflet/dist/images/marker-icon.png',
      shadowUrl: 'assets/icon/leaflet/dist/images/marker-shadow.png',
      iconSize: [25, 41], 
      iconAnchor: [12, 41]
    });

    L.Marker.prototype.options.icon = defaultIcon;

    this.map = L.map('map', {
      center: [53.349805, -6.26031], // Initial center on Dublin
      zoom: 6
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '...'
    }).addTo(this.map);

    // Add Cloud Layer
    const cloudLayer = L.tileLayer(
      `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=107846452952c901f52eb0bb51f0381a`, 
      { opacity: 0.7 }
    );
    cloudLayer.addTo(this.map);


    this.addInteractiveMarker(54.2132, -9.0909, "Enniscrone");
    this.addInteractiveMarker(52.9360, -9.4684, "Lahinch");
    this.addInteractiveMarker(54.2692, -8.5989, "Strandhill");
    this.addInteractiveMarker(53.73341,-9.88104, "Carrowinsky Beach" );
    this.addInteractiveMarker(52.506997972, -9.671830646, "Ballybunnion beach");
    this.addInteractiveMarker(51.602, -8.876,"Inchydoney Beach");
    this.addInteractiveMarker(54.4907, -8.2669, "Tullan Strand");
    this.addInteractiveMarker(54.2863, -8.9624,"Easky");
    this.addInteractiveMarker(54.4655, -8.4495, "Mullaghmore");
  }

private async addInteractiveMarker(lat: number, lng: number, locationName: string) {
  const marker = L.marker([lat, lng])
    .on('click', async (e) => {
      console.log(`${locationName} marker clicked!`);
      const data = await this.getSurfDetails(lat, lng);
      let popupContent = '';

      if (data && data[this.selectedInterval]) {
        const intervalData = data[this.selectedInterval][0]; // Taking the first record in the interval as an example
        popupContent += `
          <div class="popup-content">
            <h4>${locationName}</h4>
            <p class="popup-interval"><strong>${this.selectedInterval}:</strong></p>
            <p class="popup-temp"><i class="fas fa-thermometer-half"></i> <strong>Temperature:</strong>
              ${intervalData?.airTemperature ? intervalData.airTemperature + '°C' : 'N/A'}
            </p>
            <p class="popup-wave"><i class="fas fa-water"></i> <strong>Wave Height:</strong> 
              ${intervalData?.waveHeight ? intervalData.waveHeight + 'm' : 'N/A'}
            </p>
            <p class="popup-direction"><i class="fas fa-direction"></i> <strong>Wave Direction:</strong>
              ${intervalData?.waveDirection ? intervalData.waveDirection + '°' : 'N/A'}
            </p>
            <p class="popup-speed"><i class="fas fa-wind"></i> <strong>Wind Speed:</strong> 
              ${intervalData?.windSpeed ? intervalData.windSpeed + 'm/s' : 'N/A'}
            </p>
          </div>
        `;
      } else {
        popupContent = `No data available for ${locationName}`;
      }

      // Close the existing popup (if any)
      if (e.target.getPopup()) {
        e.target.closePopup();
      }

      // Bind the new popup content
      e.target.bindPopup(popupContent, { className: 'custom-popup' }).openPopup();
    });

  if (this.map) {
    marker.addTo(this.map);
  }
}


  onIntervalChange(event: any) {
    this.selectedInterval = event.target.value;
  }
}

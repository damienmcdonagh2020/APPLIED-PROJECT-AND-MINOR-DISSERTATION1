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
  private selectedInterval: string = '12:00-18:00'; // Default interval
  private currentMarker: L.Marker | undefined;
  private currentLocationName: string = '';
  private currentData: any;
  private currentTideData: any;  // Add this line to store tide data

  constructor(private graphqlService: GraphqlService) { }

  ngAfterViewInit() {
    this.loadMap();
    setTimeout(() => {
      if (this.map instanceof L.Map) {
        this.map.invalidateSize();
      }
    }, 200);    
  }

  private async getTideData(lat: number, lng: number): Promise<any> {
    const query = `
      query GetTides($lat: Float!, $lng: Float!) {
        getTideData(lat: $lat, lng: $lng) {
          time
          height
          type
        }
      }
    `;
  
    try {
      const response = await this.graphqlService.fetchData({ query, variables: { lat, lng } }).toPromise();
      return response.data.getTideData;
    } catch (error) {
      console.error('Error fetching tide data:', error);
      throw new Error('Failed to fetch tide data.');
    }
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
    if (!data || data.length === 0) {
        console.warn('No data available to group by time interval.');
        return {
            '00:00-06:00': [],
            '06:00-12:00': [],
            '12:00-18:00': [],
            '18:00-00:00': []
        };
    }

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

    // Add the markers for different locations
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
      .on('click', async () => {
        console.log(`${locationName} marker clicked!`);

        try {

          const data = await this.getSurfDetails(lat, lng);
          this.selectedInterval = '12:00-18:00'; // Resetting to the default interval
          // Fetch weather data
          const weatherData = await this.getSurfDetails(lat, lng);
        
          // Fetch tide data
          const tideData = await this.getTideData(lat, lng);
        
          // Store fetched data for later use
          this.currentMarker = marker;
          this.currentLocationName = locationName;
          this.currentData = weatherData;
          this.currentTideData = tideData;
          console.log('Current Tide Data:', this.currentTideData);
        
          // Update popup content
          this.updatePopupContent();
        } catch (error) {
          console.error('Error fetching data:', error);
        }
        this.updatePopupContent(); // Initialize popup content
      });

    if (this.map) {
      marker.addTo(this.map);
    }
  }




  private updatePopupContent() {
    if (!this.currentMarker || !this.currentData) return;

    const popupContainer = document.createElement('div');
    popupContainer.className = 'popup-content';

    const titleElement = document.createElement('h4');
    titleElement.innerText = this.currentLocationName;
    popupContainer.appendChild(titleElement);

    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', 'timeIntervalSelector');
    labelElement.innerText = 'Select Time Interval:';
    popupContainer.appendChild(labelElement);

    const selectElement = document.createElement('select');
    selectElement.id = 'timeIntervalSelector';
    selectElement.addEventListener('change', (event: Event) => this.onIntervalChange(event));

    const intervals = ['00:00-06:00', '06:00-12:00', '12:00-18:00', '18:00-00:00'];
    intervals.forEach(interval => {
        const option = document.createElement('option');
        option.value = interval;
        option.innerText = interval;
        if (interval === this.selectedInterval) {
            option.selected = true;
        }
        selectElement.appendChild(option);
    });

    popupContainer.appendChild(selectElement);

    // Display the data for the selected interval
    const intervalData = this.currentData[this.selectedInterval]?.[0];
    if (intervalData) {
        const temperatureElement = document.createElement('p');
        temperatureElement.innerHTML = `<strong>Temperature:</strong> ${intervalData.airTemperature ?? 'N/A'}°C`;
        popupContainer.appendChild(temperatureElement);

        const waveHeightElement = document.createElement('p');
        waveHeightElement.innerHTML = `<strong>Wave Height:</strong> ${intervalData.waveHeight ?? 'N/A'}m`;
        popupContainer.appendChild(waveHeightElement);

        const waveDirectionElement = document.createElement('p');
        waveDirectionElement.innerHTML = `<strong>Wave Direction:</strong> ${intervalData.waveDirection ?? 'N/A'}°`;
        popupContainer.appendChild(waveDirectionElement);

        const windSpeedElement = document.createElement('p');
        windSpeedElement.innerHTML = `<strong>Wind Speed:</strong> ${intervalData.windSpeed ?? 'N/A'}m/s`;
        popupContainer.appendChild(windSpeedElement);
    } else {
        const noDataElement = document.createElement('p');
        noDataElement.innerText = 'No data available for selected interval.';
        popupContainer.appendChild(noDataElement);
    }

    // Add tide data
    if (this.currentTideData && this.currentTideData.length > 0) {
        const tideTitle = document.createElement('h5');
        tideTitle.innerText = 'Tide Information:';
        popupContainer.appendChild(tideTitle);

        this.currentTideData.forEach((tide: any) => {
            const tideElement = document.createElement('p');
            tideElement.innerHTML = `<strong>${tide.type} Tide:</strong> ${new Date(tide.time).toLocaleTimeString()} - ${tide.height.toFixed(2)}m`;
            popupContainer.appendChild(tideElement);
        });
    }

    this.currentMarker.bindPopup(popupContainer).openPopup();
    
}


  onIntervalChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedInterval = target.value;
    this.updatePopupContent(); // Update popup content when interval changes
  }
}

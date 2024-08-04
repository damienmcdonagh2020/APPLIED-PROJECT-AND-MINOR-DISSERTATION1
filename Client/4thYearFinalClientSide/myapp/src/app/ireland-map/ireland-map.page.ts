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
        getWeatherData(lat: $lat, lng: $lng, params: "airTemperature,waveHeight") {
          time
          airTemperature
          waveHeight
        }
      }
    `;

    return new Promise((resolve, reject) => {
      this.graphqlService.fetchData({ query: query, variables: { lat, lng } }).subscribe(response => {
        console.log(response.data.getWeatherData);
        resolve(response.data.getWeatherData);
      }, reject);
    });
  }

  private loadMap() {
    // Set the default map marker icon
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

    // Add the OpenStreetMap tiles layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '...'
    }).addTo(this.map);

    // Add interactive markers for each location
    this.addInteractiveMarker(54.2132, -9.0909, "Enniscrone");
    this.addInteractiveMarker(52.9360, -9.4684, "Lahinch");
    this.addInteractiveMarker(54.2692, -8.5989, "Strandhill");
    this.addInteractiveMarker( 53.73341,-9.88104, "Carrowinsky Beach" );
    this.addInteractiveMarker(52.506997972, -9.671830646, "Ballybunnion beach");
    this.addInteractiveMarker(51.602, -8.876,"Inchydoney Beach");
    this.addInteractiveMarker(54.4907, -8.2669, "Tullan Strand");
    this.addInteractiveMarker(54.2863, -8.9624,"Easky");
    this.addInteractiveMarker(54.4655, -8.4495, "Mullaghmore");
  }

  // Method to add an interactive marker to the map
private async addInteractiveMarker(lat: number, lng: number, locationName: string) {
  const marker = L.marker([lat, lng])
    .on('click', async (e) => {
      console.log(`${locationName} marker clicked!`);
      const data = await this.getSurfDetails(lat, lng);
      let popupContent;
      if (data) {
        popupContent = `
          <strong>${locationName}</strong><br>
          Time: ${data[0]?.time || 'N/A'}<br>
          Air Temperature: ${data[0]?.airTemperature ? data[0].airTemperature + '°C' : 'N/A'}<br>
          Wave Height: ${data[0]?.waveHeight ? data[0].waveHeight + 'm' : 'N/A'}
        `;
      } else {
        popupContent = `No data available for ${locationName}`;
      }
      e.target.bindPopup(popupContent).openPopup();
    });

  if (this.map) {
    marker.addTo(this.map);
  }
}
}

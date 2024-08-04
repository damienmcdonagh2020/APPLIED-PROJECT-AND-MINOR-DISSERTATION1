import { Component, OnInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { Router } from '@angular/router';

const TILE_LAYER_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_LAYER_OPTIONS = {
  maxZoom: 15,
  errorTileUrl: 'path/to/error-tile.png'  // This is optional but can be helpful
};

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, OnDestroy {
  private map?: L.Map;

  constructor(private router: Router) {}

  ngOnInit() {
    this.initializeMap();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  private initializeMap(): void {
    this.map = L.map('map').setView([53.349805, -8.500000], 7);
    L.tileLayer(TILE_LAYER_URL, TILE_LAYER_OPTIONS).addTo(this.map);
    
    // Lahinch Beach (This is the one you had)
    this.addMarkerWithPopup([52.9336, -9.3478], 'Lahinch Beach', 'Beautiful Beach in Lahinch');
    
    // Additional beaches
    this.addMarkerWithPopup([52.1390, -10.2702], 'Inch Beach', 'Scenic Beach in Kerry');
    this.addMarkerWithPopup([51.6235, -8.8703], 'Inchydoney Beach', 'Picturesque Beach in Inchydoney');
    this.addMarkerWithPopup([54.2692, -8.46007], 'Strandhill Beach', 'Popular Surfing Beach');
    this.addMarkerWithPopup([51.7590, -10.1618], 'Derrynane Beach', 'Tranquil Beach in Kerry');
    this.addMarkerWithPopup([51.6235, -8.8703], 'Inchydoney', 'Renowned Beach in West Cork');
    this.addMarkerWithPopup([52.5111, -9.6709], 'Ballybunion', 'Famous Beach with Stunning Cliffs');
    this.addMarkerWithPopup([54.2132, -9.0909], 'Enniscrone', 'Vast Beach in Sligo');
    this.addMarkerWithPopup([52.2819, -9.7201], 'Banna Strand', 'Golden Sandy Beach in Kerry');
  
    setTimeout(() => {
        this.map?.invalidateSize();  // This forces the map to redraw and fit its container
    }, 0);
  }
  
  
  private addMarkerWithPopup(latlng: [number, number], title: string, description: string): void {
    if (this.map) {
      const marker = L.marker(latlng).addTo(this.map);
      const popupContent = `<b>${title}</b><br>${description}`;  // Note the backticks here
      marker.bindPopup(popupContent);
    }
  }

  public goToHomePage(): void {
    this.router.navigate(['/home']);
  }
}
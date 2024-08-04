import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  private map: L.Map | undefined;

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    this.map = L.map('map').setView([53.349805, -6.26031], 10); // Dublin, Ireland

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);

    // You can add markers and overlays on the map here.
  }
}


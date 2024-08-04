import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private router: Router) {}

  goToMapPage() {
    this.router.navigate(['/map']); // Navigate to the map page
  }

  navigateToIrelandMap() {
    this.router.navigate(['/ireland-map']);
  }

}

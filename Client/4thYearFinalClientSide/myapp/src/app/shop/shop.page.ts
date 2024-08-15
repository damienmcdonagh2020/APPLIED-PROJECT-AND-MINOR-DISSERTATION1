import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {
  wetsuits: Array<{ name: string, size: string[], price: number, image: string, description: string }> = [];

  constructor() { }

  ngOnInit() {
    this.wetsuits = [
      {
        name: 'Premium Wetsuit',
        size: ['S', 'M', 'L', 'XL'],
        price: 199.99,
        image: 'assets/images/wetsuit1.jpg',
        description: 'A high-quality wetsuit for cold waters.'
      },
      {
        name: 'Beginner Wetsuit',
        size: ['S', 'M', 'L', 'XL'],
        price: 99.99,
        image: 'assets/images/wetsuit2.jpg',
        description: 'Perfect for beginners and casual surfers.'
      },
      // Add more wetsuits here
    ];
  }
}


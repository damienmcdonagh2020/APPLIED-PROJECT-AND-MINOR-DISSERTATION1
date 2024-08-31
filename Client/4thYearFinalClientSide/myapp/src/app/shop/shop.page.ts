import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service'; // Import the CartService

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {
  wetsuits: Array<{ name: string, size: string[], price: number, image: string, description: string }> = [];
  selectedSize: { [key: string]: string } = {}; // Store selected sizes by product name or another unique identifier

  constructor(private cartService: CartService) { } // Inject the CartService

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
    ];
  }

  onSizeSelected(wetsuitName: string, size: string) {
    this.selectedSize[wetsuitName] = size; // Store the selected size for this wetsuit
  }

  addToCart(wetsuit: { name: string, size: string[], price: number, image: string, description: string }): void {
    const size = this.selectedSize[wetsuit.name];
    
    if (!size) {
      alert('Please select a size before adding to cart.');
      return;
    }

    // Add the selected size to the product object before adding it to the cart
    this.cartService.addToCart({ ...wetsuit, selectedSize: size });
    alert(`${wetsuit.name} (${size}) added to cart!`); // Provide feedback to the user
  }
}

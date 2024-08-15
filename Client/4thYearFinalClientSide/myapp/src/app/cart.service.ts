import { Injectable } from '@angular/core';

// Define the Product interface here
interface Product {
  name: string;
  size: string[];
  price: number;
  image: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private cart: Product[] = []; // Specify the type of the cart array

  constructor() { }

  addToCart(product: Product): void { // Specify the type of the product parameter
    this.cart.push(product);
  }

  getCart(): Product[] { // Specify the return type
    return this.cart;
  }

  clearCart(): Product[] { // Specify the return type
    this.cart = [];
    return this.cart;
  }
}


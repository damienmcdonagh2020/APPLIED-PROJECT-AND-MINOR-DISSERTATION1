import { Injectable } from '@angular/core';

// Define the Product interface here
interface Product {
  name: string;
  size: string[];
  price: number;
  image: string;
  description: string;
  selectedSize?: string; // Add selectedSize as an optional property
}

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private cart: Product[] = []; // Using Product interface

  constructor() { }

  addToCart(product: Product): void {
    this.cart.push(product);
  }

  getCart(): Product[] {
    return this.cart;
  }

  clearCart(): Product[] {
    this.cart = [];
    return this.cart;
  }
}
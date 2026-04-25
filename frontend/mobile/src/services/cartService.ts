import { carts, products } from "../data";
import { Cart, CartItem, Product } from "../types/models";

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export interface CartDetailedItem extends CartItem {
  product: Product;
  lineTotal: number;
}

export interface CartSummary {
  cartId: string;
  userId: string;
  items: CartDetailedItem[];
  totalItems: number;
  subtotal: number;
}

class CartService {
  private findOrCreateCart(userId: string): Cart {
    let cart = carts.find((item) => item.userId === userId);

    if (!cart) {
      cart = {
        id: `cart-${userId}`,
        userId,
        items: [],
      };

      carts.push(cart);
    }

    return cart;
  }

  private getProductOrThrow(productId: string): Product {
    const product = products.find(
      (item) => item.id === productId && item.isActive,
    );

    if (!product) {
      throw new Error("Product not found.");
    }

    return product;
  }

  private buildCartSummary(cart: Cart): CartSummary {
    const items: CartDetailedItem[] = cart.items
      .map((item) => {
        const product = products.find(
          (productItem) => productItem.id === item.productId,
        );

        if (!product || !product.isActive) {
          return null;
        }

        return {
          ...item,
          product: clone(product),
          lineTotal: item.priceSnapshot * item.quantity,
        };
      })
      .filter(Boolean) as CartDetailedItem[];

    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      cartId: cart.id,
      userId: cart.userId,
      items,
      totalItems,
      subtotal,
    };
  }

  async getCart(userId: string): Promise<CartSummary> {
    await delay();

    const cart = this.findOrCreateCart(userId);

    return clone(this.buildCartSummary(cart));
  }

  async addToCart(
    userId: string,
    productId: string,
    quantity = 1,
  ): Promise<CartSummary> {
    await delay();

    if (quantity <= 0) {
      throw new Error("Quantity must be greater than 0.");
    }

    const product = this.getProductOrThrow(productId);

    if (product.stock <= 0) {
      throw new Error("Product is out of stock.");
    }

    const cart = this.findOrCreateCart(userId);
    const existingItem = cart.items.find(
      (item) => item.productId === productId,
    );

    if (existingItem) {
      const nextQuantity = existingItem.quantity + quantity;

      if (nextQuantity > product.stock) {
        throw new Error("Requested quantity exceeds available stock.");
      }

      existingItem.quantity = nextQuantity;
      existingItem.priceSnapshot = product.sellingPrice;
    } else {
      if (quantity > product.stock) {
        throw new Error("Requested quantity exceeds available stock.");
      }

      cart.items.push({
        id: `ci-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        productId,
        quantity,
        priceSnapshot: product.sellingPrice,
      });
    }

    return clone(this.buildCartSummary(cart));
  }

  async updateCartItem(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<CartSummary> {
    await delay();

    const cart = this.findOrCreateCart(userId);
    const existingItem = cart.items.find(
      (item) => item.productId === productId,
    );

    if (!existingItem) {
      throw new Error("Cart item not found.");
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter((item) => item.productId !== productId);
      return clone(this.buildCartSummary(cart));
    }

    const product = this.getProductOrThrow(productId);

    if (quantity > product.stock) {
      throw new Error("Requested quantity exceeds available stock.");
    }

    existingItem.quantity = quantity;
    existingItem.priceSnapshot = product.sellingPrice;

    return clone(this.buildCartSummary(cart));
  }

  async removeCartItem(
    userId: string,
    productId: string,
  ): Promise<CartSummary> {
    await delay();

    const cart = this.findOrCreateCart(userId);
    cart.items = cart.items.filter((item) => item.productId !== productId);

    return clone(this.buildCartSummary(cart));
  }

  async clearCart(userId: string): Promise<CartSummary> {
    await delay();

    const cart = this.findOrCreateCart(userId);
    cart.items = [];

    return clone(this.buildCartSummary(cart));
  }
}

export const cartService = new CartService();

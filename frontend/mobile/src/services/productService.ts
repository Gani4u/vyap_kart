import { banners, categories, products } from "../data";
import { Banner, Category, Product } from "../types/models";

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

class ProductService {
  async getCategories(): Promise<Category[]> {
    await delay();

    return clone(categories.filter((item) => item.isActive));
  }

  async getCategoryById(categoryId: string): Promise<Category> {
    await delay();

    const category = categories.find(
      (item) => item.id === categoryId && item.isActive,
    );

    if (!category) {
      throw new Error("Category not found.");
    }

    return clone(category);
  }

  async getBanners(): Promise<Banner[]> {
    await delay();

    return clone(banners.filter((item) => item.isActive));
  }

  async getAllProducts(): Promise<Product[]> {
    await delay();

    return clone(products.filter((item) => item.isActive));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    await delay();

    return clone(products.filter((item) => item.isActive && item.isFeatured));
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    await delay();

    return clone(
      products.filter(
        (item) => item.isActive && item.categoryId === categoryId,
      ),
    );
  }

  async getProductById(productId: string): Promise<Product> {
    await delay();

    const product = products.find(
      (item) => item.id === productId && item.isActive,
    );

    if (!product) {
      throw new Error("Product not found.");
    }

    return clone(product);
  }

  async getProductsByIds(productIds: string[]): Promise<Product[]> {
    await delay();

    const list = products.filter(
      (item) => item.isActive && productIds.includes(item.id),
    );

    return clone(list);
  }

  async searchProducts(query: string): Promise<Product[]> {
    await delay();

    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return clone(products.filter((item) => item.isActive));
    }

    return clone(
      products.filter((item) => {
        if (!item.isActive) return false;

        return (
          item.name.toLowerCase().includes(normalizedQuery) ||
          item.brand.toLowerCase().includes(normalizedQuery) ||
          item.description.toLowerCase().includes(normalizedQuery) ||
          item.slug.toLowerCase().includes(normalizedQuery)
        );
      }),
    );
  }

  async getRelatedProducts(productId: string): Promise<Product[]> {
    await delay();

    const product = products.find(
      (item) => item.id === productId && item.isActive,
    );

    if (!product) {
      throw new Error("Product not found.");
    }

    const related = products.filter(
      (item) =>
        item.isActive &&
        item.id !== product.id &&
        item.categoryId === product.categoryId,
    );

    return clone(related.slice(0, 6));
  }
}

export const productService = new ProductService();

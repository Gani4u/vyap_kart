import {
  categories,
  coupons,
  inventory,
  orders,
  products,
  users,
  zones,
} from "../data";
import {
  Category,
  Coupon,
  DeliveryZone,
  InventoryItem,
  Order,
  OrderStatus,
  Product,
  User,
} from "../types/models";

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  lowStockProducts: number;
  totalUsers: number;
  activeCoupons: number;
  activeZones: number;
}

export type CreateProductInput = Omit<Product, "id">;
export type UpdateProductInput = Partial<Omit<Product, "id">>;

export type CreateCategoryInput = Omit<Category, "id">;
export type UpdateCategoryInput = Partial<Omit<Category, "id">>;

export type CreateCouponInput = Omit<Coupon, "id">;
export type UpdateCouponInput = Partial<Omit<Coupon, "id">>;

export type CreateDeliveryZoneInput = Omit<DeliveryZone, "id">;
export type UpdateDeliveryZoneInput = Partial<Omit<DeliveryZone, "id">>;

class AdminService {
  async getDashboardStats(): Promise<DashboardStats> {
    await delay();

    const pendingStatuses: OrderStatus[] = [
      "placed",
      "confirmed",
      "assigned",
      "packed",
      "out_for_delivery",
    ];

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      pendingOrders: orders.filter((item) =>
        pendingStatuses.includes(item.orderStatus),
      ).length,
      lowStockProducts: inventory.filter(
        (item) => item.availableQty <= item.reorderLevel,
      ).length,
      totalUsers: users.length,
      activeCoupons: coupons.filter((item) => item.isActive).length,
      activeZones: zones.filter((item) => item.isActive).length,
    };
  }

  async getProducts(): Promise<Product[]> {
    await delay();

    return clone(products);
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    await delay();

    const newProduct: Product = {
      id: `p-${Date.now()}`,
      ...input,
    };

    products.unshift(newProduct);

    inventory.unshift({
      id: `inv-${Date.now()}`,
      productId: newProduct.id,
      availableQty: newProduct.stock,
      reservedQty: 0,
      reorderLevel: 5,
    });

    return clone(newProduct);
  }

  async updateProduct(
    productId: string,
    updates: UpdateProductInput,
  ): Promise<Product> {
    await delay();

    const product = products.find((item) => item.id === productId);

    if (!product) {
      throw new Error("Product not found.");
    }

    Object.assign(product, updates);

    if (typeof updates.stock === "number") {
      const inventoryItem = inventory.find(
        (item) => item.productId === productId,
      );

      if (inventoryItem) {
        inventoryItem.availableQty = updates.stock;
      }
    }

    return clone(product);
  }

  async getCategories(): Promise<Category[]> {
    await delay();

    return clone(categories);
  }

  async createCategory(input: CreateCategoryInput): Promise<Category> {
    await delay();

    const newCategory: Category = {
      id: `c-${Date.now()}`,
      ...input,
    };

    categories.unshift(newCategory);

    return clone(newCategory);
  }

  async updateCategory(
    categoryId: string,
    updates: UpdateCategoryInput,
  ): Promise<Category> {
    await delay();

    const category = categories.find((item) => item.id === categoryId);

    if (!category) {
      throw new Error("Category not found.");
    }

    Object.assign(category, updates);

    return clone(category);
  }

  async getInventory(): Promise<InventoryItem[]> {
    await delay();

    return clone(inventory);
  }

  async updateInventory(
    productId: string,
    availableQty: number,
  ): Promise<InventoryItem> {
    await delay();

    const inventoryItem = inventory.find(
      (item) => item.productId === productId,
    );
    const product = products.find((item) => item.id === productId);

    if (!inventoryItem || !product) {
      throw new Error("Inventory item not found.");
    }

    inventoryItem.availableQty = Math.max(availableQty, 0);
    product.stock = Math.max(availableQty, 0);

    return clone(inventoryItem);
  }

  async getOrders(): Promise<Order[]> {
    await delay();

    return clone(
      orders.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    );
  }

  async getOrderById(orderId: string): Promise<Order> {
    await delay();

    const order = orders.find((item) => item.id === orderId);

    if (!order) {
      throw new Error("Order not found.");
    }

    return clone(order);
  }

  async assignOrder(orderId: string, assignedTo: string): Promise<Order> {
    await delay();

    const order = orders.find((item) => item.id === orderId);

    if (!order) {
      throw new Error("Order not found.");
    }

    order.assignedTo = assignedTo;
    order.orderStatus = "assigned";

    return clone(order);
  }

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
  ): Promise<Order> {
    await delay();

    const order = orders.find((item) => item.id === orderId);

    if (!order) {
      throw new Error("Order not found.");
    }

    order.orderStatus = status;

    if (status === "delivered") {
      if (order.paymentMethod === "cod") {
        order.paymentStatus = "paid";
      }

      for (const item of order.items) {
        const inventoryItem = inventory.find(
          (inventoryRow) => inventoryRow.productId === item.productId,
        );

        if (inventoryItem) {
          inventoryItem.reservedQty = Math.max(
            inventoryItem.reservedQty - item.quantity,
            0,
          );
        }
      }
    }

    if (status === "cancelled" || status === "returned") {
      for (const item of order.items) {
        const inventoryItem = inventory.find(
          (inventoryRow) => inventoryRow.productId === item.productId,
        );
        const product = products.find(
          (productRow) => productRow.id === item.productId,
        );

        if (inventoryItem) {
          inventoryItem.availableQty += item.quantity;
          inventoryItem.reservedQty = Math.max(
            inventoryItem.reservedQty - item.quantity,
            0,
          );
        }

        if (product) {
          product.stock += item.quantity;
        }
      }
    }

    return clone(order);
  }

  async getCoupons(): Promise<Coupon[]> {
    await delay();

    return clone(coupons);
  }

  async createCoupon(input: CreateCouponInput): Promise<Coupon> {
    await delay();

    const newCoupon: Coupon = {
      id: `cp-${Date.now()}`,
      ...input,
    };

    coupons.unshift(newCoupon);

    return clone(newCoupon);
  }

  async updateCoupon(
    couponId: string,
    updates: UpdateCouponInput,
  ): Promise<Coupon> {
    await delay();

    const coupon = coupons.find((item) => item.id === couponId);

    if (!coupon) {
      throw new Error("Coupon not found.");
    }

    Object.assign(coupon, updates);

    return clone(coupon);
  }

  async getUsers(): Promise<User[]> {
    await delay();

    return clone(users);
  }

  async getDeliveryZones(): Promise<DeliveryZone[]> {
    await delay();

    return clone(zones);
  }

  async createDeliveryZone(
    input: CreateDeliveryZoneInput,
  ): Promise<DeliveryZone> {
    await delay();

    const newZone: DeliveryZone = {
      id: `z-${Date.now()}`,
      ...input,
    };

    zones.unshift(newZone);

    return clone(newZone);
  }

  async updateDeliveryZone(
    zoneId: string,
    updates: UpdateDeliveryZoneInput,
  ): Promise<DeliveryZone> {
    await delay();

    const zone = zones.find((item) => item.id === zoneId);

    if (!zone) {
      throw new Error("Delivery zone not found.");
    }

    Object.assign(zone, updates);

    return clone(zone);
  }
}

export const adminService = new AdminService();

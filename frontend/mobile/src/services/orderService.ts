import {
  addresses,
  carts,
  coupons,
  inventory,
  orders,
  products,
  zones,
} from "../data";
import {
  Address,
  Coupon,
  DeliveryZone,
  Order,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Product,
} from "../types/models";

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export interface ServiceabilityResult {
  serviceable: boolean;
  message: string;
  zone?: DeliveryZone;
}

export interface CouponValidationResult {
  valid: boolean;
  discount: number;
  message: string;
  coupon?: Coupon;
}

export interface PlaceOrderInput {
  userId: string;
  addressId: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  deliverySlot?: string;
}

export interface TrackingStep {
  key: OrderStatus;
  label: string;
  completed: boolean;
  current: boolean;
}

class OrderService {
  private getAddressOrThrow(addressId: string): Address {
    const address = addresses.find((item) => item.id === addressId);

    if (!address) {
      throw new Error("Address not found.");
    }

    return address;
  }

  private getCartOrThrow(userId: string) {
    const cart = carts.find((item) => item.userId === userId);

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty.");
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

  private calculateDeliveryFee(subtotal: number): number {
    return subtotal >= 500 ? 0 : 20;
  }

  private getTrackingOrder(): OrderStatus[] {
    return [
      "placed",
      "confirmed",
      "assigned",
      "packed",
      "out_for_delivery",
      "delivered",
    ];
  }

  async checkServiceability(addressId: string): Promise<ServiceabilityResult> {
    await delay();

    const address = this.getAddressOrThrow(addressId);

    if (address.city.trim().toLowerCase() !== "ilkal") {
      return {
        serviceable: false,
        message: "Delivery is currently available only in Ilkal.",
      };
    }

    if (address.pincode !== "587125") {
      return {
        serviceable: false,
        message: "Delivery is currently available only for pincode 587125.",
      };
    }

    const zone = zones.find(
      (item) =>
        item.isActive &&
        item.city.toLowerCase() === address.city.toLowerCase() &&
        item.pincode === address.pincode &&
        item.areas.some(
          (area) => area.toLowerCase() === address.area.toLowerCase(),
        ),
    );

    if (!zone) {
      return {
        serviceable: false,
        message: "This area is not serviceable right now.",
      };
    }

    return {
      serviceable: true,
      message: "Address is serviceable.",
      zone: clone(zone),
    };
  }

  async validateCoupon(
    couponCode: string,
    subtotal: number,
  ): Promise<CouponValidationResult> {
    await delay();

    const normalizedCode = couponCode.trim().toUpperCase();

    const coupon = coupons.find(
      (item) => item.code.toUpperCase() === normalizedCode && item.isActive,
    );

    if (!coupon) {
      return {
        valid: false,
        discount: 0,
        message: "Coupon not found or inactive.",
      };
    }

    const isExpired = new Date(coupon.expiryDate).getTime() < Date.now();

    if (isExpired) {
      return {
        valid: false,
        discount: 0,
        message: "Coupon has expired.",
      };
    }

    if (subtotal < coupon.minOrderAmount) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}.`,
      };
    }

    let discount = 0;

    if (coupon.type === "flat") {
      discount = coupon.value;
    }

    if (coupon.type === "percentage") {
      discount = Math.floor((subtotal * coupon.value) / 100);
    }

    if (discount > subtotal) {
      discount = subtotal;
    }

    return {
      valid: true,
      discount,
      message: "Coupon applied successfully.",
      coupon: clone(coupon),
    };
  }

  async placeOrder(input: PlaceOrderInput): Promise<Order> {
    await delay();

    const { userId, addressId, paymentMethod, couponCode, deliverySlot } =
      input;

    const address = this.getAddressOrThrow(addressId);

    if (address.userId !== userId) {
      throw new Error("This address does not belong to the current user.");
    }

    const serviceability = await this.checkServiceability(addressId);

    if (!serviceability.serviceable) {
      throw new Error(serviceability.message);
    }

    const cart = this.getCartOrThrow(userId);

    const orderItems = cart.items.map((cartItem) => {
      const product = this.getProductOrThrow(cartItem.productId);

      if (cartItem.quantity > product.stock) {
        throw new Error(`${product.name} does not have enough stock.`);
      }

      return {
        id: `oi-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        productId: product.id,
        nameSnapshot: product.name,
        imageSnapshot: product.images[0] ?? "",
        priceSnapshot: product.sellingPrice,
        quantity: cartItem.quantity,
      };
    });

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.priceSnapshot * item.quantity,
      0,
    );

    const deliveryFee = this.calculateDeliveryFee(subtotal);

    let discount = 0;

    if (couponCode?.trim()) {
      const couponResult = await this.validateCoupon(couponCode, subtotal);

      if (!couponResult.valid) {
        throw new Error(couponResult.message);
      }

      discount = couponResult.discount;
    }

    const total = Math.max(subtotal + deliveryFee - discount, 0);

    const paymentStatus: PaymentStatus =
      paymentMethod === "online" ? "paid" : "pending";

    const order: Order = {
      id: `o-${Date.now()}`,
      userId,
      addressId: address.id,
      addressSnapshot: {
        fullAddress: address.fullAddress,
        landmark: address.landmark,
        area: address.area,
        city: address.city,
        pincode: address.pincode,
      },
      items: orderItems,
      subtotal,
      deliveryFee,
      discount,
      total,
      paymentMethod,
      paymentStatus,
      orderStatus: "placed",
      deliverySlot: deliverySlot || "Next available slot",
      createdAt: new Date().toISOString(),
    };

    orders.unshift(order);

    for (const item of orderItems) {
      const product = products.find(
        (productItem) => productItem.id === item.productId,
      );
      const inventoryItem = inventory.find(
        (inventoryRow) => inventoryRow.productId === item.productId,
      );

      if (product) {
        product.stock = Math.max(product.stock - item.quantity, 0);
      }

      if (inventoryItem) {
        inventoryItem.availableQty = Math.max(
          inventoryItem.availableQty - item.quantity,
          0,
        );
        inventoryItem.reservedQty += item.quantity;
      }
    }

    cart.items = [];

    return clone(order);
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    await delay();

    return clone(
      orders
        .filter((item) => item.userId === userId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
    );
  }

  async getAllOrders(): Promise<Order[]> {
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

  async getTrackingSteps(orderId: string): Promise<TrackingStep[]> {
    await delay();

    const order = orders.find((item) => item.id === orderId);

    if (!order) {
      throw new Error("Order not found.");
    }

    const progression = this.getTrackingOrder();
    const currentIndex = progression.indexOf(order.orderStatus);

    return progression.map((status, index) => ({
      key: status,
      label: status
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()),
      completed: currentIndex >= index,
      current: currentIndex === index,
    }));
  }
}

export const orderService = new OrderService();

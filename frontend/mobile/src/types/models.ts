export type Role = "customer" | "admin";

export type DeliveryType = "24hr" | "same-day" | "next-day";

export type PaymentMethod = "cod" | "online";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type OrderStatus =
  | "placed"
  | "confirmed"
  | "assigned"
  | "packed"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned";

export type CouponType = "flat" | "percentage";

export type BannerTargetType = "category" | "product" | "offer";

export interface User {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  role: Role;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  brand: string;
  images: string[];
  mrp: number;
  sellingPrice: number;
  stock: number;
  weight: number;
  unit: string;
  isActive: boolean;
  isFeatured: boolean;
  deliveryType: DeliveryType;
}

export interface InventoryItem {
  id: string;
  productId: string;
  availableQty: number;
  reservedQty: number;
  reorderLevel: number;
}

export interface Address {
  id: string;
  userId: string;
  fullAddress: string;
  landmark?: string;
  area: string;
  city: string;
  pincode: string;
  lat?: number;
  lng?: number;
  isDefault: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  priceSnapshot: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

export interface AddressSnapshot {
  fullAddress: string;
  landmark?: string;
  area: string;
  city: string;
  pincode: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  nameSnapshot: string;
  imageSnapshot: string;
  priceSnapshot: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  addressId: string;
  addressSnapshot: AddressSnapshot;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  deliverySlot: string;
  assignedTo?: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount: number;
  expiryDate: string;
  usageLimit: number;
  isActive: boolean;
}

export interface DeliveryZone {
  id: string;
  name: string;
  city: string;
  pincode: string;
  areas: string[];
  isActive: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  targetType: BannerTargetType;
  targetId: string;
  isActive: boolean;
}

import { create } from "zustand";

import { cartService } from "../services/cartService";
import type { CartSummary } from "../services/cartService";
import { orderService } from "../services/orderService";

interface CartStoreState {
  cart: CartSummary | null;
  selectedAddressId: string | null;
  appliedCouponCode: string;
  couponDiscount: number;
  deliveryFee: number;
  grandTotal: number;
  isLoading: boolean;
  error: string | null;

  loadCart: (userId: string) => Promise<void>;
  addItem: (
    userId: string,
    productId: string,
    quantity?: number,
  ) => Promise<void>;
  updateItem: (
    userId: string,
    productId: string,
    quantity: number,
  ) => Promise<void>;
  removeItem: (userId: string, productId: string) => Promise<void>;
  clearCart: (userId: string) => Promise<void>;

  setSelectedAddressId: (addressId: string | null) => void;
  applyCoupon: (couponCode: string) => Promise<void>;
  removeCoupon: () => void;
  clearCheckoutState: () => void;
  clearError: () => void;
}

const calculateDeliveryFee = (subtotal: number): number => {
  return subtotal >= 500 ? 0 : 20;
};

const calculateGrandTotal = (
  subtotal: number,
  deliveryFee: number,
  couponDiscount: number,
): number => {
  return Math.max(subtotal + deliveryFee - couponDiscount, 0);
};

const buildCheckoutValues = (
  cart: CartSummary | null,
  couponDiscount: number,
): { deliveryFee: number; grandTotal: number } => {
  if (!cart) {
    return {
      deliveryFee: 0,
      grandTotal: 0,
    };
  }

  const deliveryFee = calculateDeliveryFee(cart.subtotal);
  const grandTotal = calculateGrandTotal(
    cart.subtotal,
    deliveryFee,
    couponDiscount,
  );

  return {
    deliveryFee,
    grandTotal,
  };
};

export const useCartStore = create<CartStoreState>((set, get) => ({
  cart: null,
  selectedAddressId: null,
  appliedCouponCode: "",
  couponDiscount: 0,
  deliveryFee: 0,
  grandTotal: 0,
  isLoading: false,
  error: null,

  loadCart: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });

      const cart = await cartService.getCart(userId);
      const currentCoupon = get().appliedCouponCode;

      let couponDiscount = 0;
      let appliedCouponCode = currentCoupon;

      if (currentCoupon && cart.subtotal > 0) {
        const couponResult = await orderService.validateCoupon(
          currentCoupon,
          cart.subtotal,
        );

        if (couponResult.valid) {
          couponDiscount = couponResult.discount;
        } else {
          appliedCouponCode = "";
        }
      }

      const { deliveryFee, grandTotal } = buildCheckoutValues(
        cart,
        couponDiscount,
      );

      set({
        cart,
        appliedCouponCode,
        couponDiscount,
        deliveryFee,
        grandTotal,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load cart.";
      set({ isLoading: false, error: message });
    }
  },

  addItem: async (userId: string, productId: string, quantity = 1) => {
    try {
      set({ isLoading: true, error: null });

      const cart = await cartService.addToCart(userId, productId, quantity);
      const currentCoupon = get().appliedCouponCode;

      let couponDiscount = 0;
      let appliedCouponCode = currentCoupon;

      if (currentCoupon && cart.subtotal > 0) {
        const couponResult = await orderService.validateCoupon(
          currentCoupon,
          cart.subtotal,
        );

        if (couponResult.valid) {
          couponDiscount = couponResult.discount;
        } else {
          appliedCouponCode = "";
        }
      }

      const { deliveryFee, grandTotal } = buildCheckoutValues(
        cart,
        couponDiscount,
      );

      set({
        cart,
        appliedCouponCode,
        couponDiscount,
        deliveryFee,
        grandTotal,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to add item.";
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  updateItem: async (userId: string, productId: string, quantity: number) => {
    try {
      set({ isLoading: true, error: null });

      const cart = await cartService.updateCartItem(
        userId,
        productId,
        quantity,
      );
      const currentCoupon = get().appliedCouponCode;

      let couponDiscount = 0;
      let appliedCouponCode = currentCoupon;

      if (currentCoupon && cart.subtotal > 0) {
        const couponResult = await orderService.validateCoupon(
          currentCoupon,
          cart.subtotal,
        );

        if (couponResult.valid) {
          couponDiscount = couponResult.discount;
        } else {
          appliedCouponCode = "";
        }
      }

      const { deliveryFee, grandTotal } = buildCheckoutValues(
        cart,
        couponDiscount,
      );

      set({
        cart,
        appliedCouponCode,
        couponDiscount,
        deliveryFee,
        grandTotal,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update cart item.";
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  removeItem: async (userId: string, productId: string) => {
    try {
      set({ isLoading: true, error: null });

      const cart = await cartService.removeCartItem(userId, productId);
      const currentCoupon = get().appliedCouponCode;

      let couponDiscount = 0;
      let appliedCouponCode = currentCoupon;

      if (currentCoupon && cart.subtotal > 0) {
        const couponResult = await orderService.validateCoupon(
          currentCoupon,
          cart.subtotal,
        );

        if (couponResult.valid) {
          couponDiscount = couponResult.discount;
        } else {
          appliedCouponCode = "";
        }
      }

      const { deliveryFee, grandTotal } = buildCheckoutValues(
        cart,
        couponDiscount,
      );

      set({
        cart,
        appliedCouponCode,
        couponDiscount,
        deliveryFee,
        grandTotal,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to remove item.";
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  clearCart: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });

      const cart = await cartService.clearCart(userId);

      set({
        cart,
        appliedCouponCode: "",
        couponDiscount: 0,
        deliveryFee: 0,
        grandTotal: 0,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to clear cart.";
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  setSelectedAddressId: (addressId: string | null) => {
    set({ selectedAddressId: addressId });
  },

  applyCoupon: async (couponCode: string) => {
    try {
      const cart = get().cart;

      if (!cart || cart.subtotal <= 0) {
        throw new Error("Cart is empty. Add items before applying coupon.");
      }

      set({ isLoading: true, error: null });

      const result = await orderService.validateCoupon(
        couponCode,
        cart.subtotal,
      );

      if (!result.valid) {
        throw new Error(result.message);
      }

      const normalizedCoupon = couponCode.trim().toUpperCase();
      const { deliveryFee, grandTotal } = buildCheckoutValues(
        cart,
        result.discount,
      );

      set({
        appliedCouponCode: normalizedCoupon,
        couponDiscount: result.discount,
        deliveryFee,
        grandTotal,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to apply coupon.";
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  removeCoupon: () => {
    const cart = get().cart;
    const { deliveryFee, grandTotal } = buildCheckoutValues(cart, 0);

    set({
      appliedCouponCode: "",
      couponDiscount: 0,
      deliveryFee,
      grandTotal,
      error: null,
    });
  },

  clearCheckoutState: () => {
    const cart = get().cart;
    const { deliveryFee, grandTotal } = buildCheckoutValues(cart, 0);

    set({
      selectedAddressId: null,
      appliedCouponCode: "",
      couponDiscount: 0,
      deliveryFee,
      grandTotal,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));

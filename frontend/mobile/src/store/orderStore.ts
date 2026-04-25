import { create } from "zustand";

import { adminService } from "../services/adminService";
import { orderService } from "../services/orderService";
import type { PlaceOrderInput, TrackingStep } from "../services/orderService";
import type { Order, OrderStatus } from "../types/models";
import { useCartStore } from "./cartStore";

interface OrderStoreState {
  myOrders: Order[];
  adminOrders: Order[];
  activeOrder: Order | null;
  trackingSteps: TrackingStep[];
  isLoading: boolean;
  error: string | null;

  loadMyOrders: (userId: string) => Promise<void>;
  loadAllOrders: () => Promise<void>;
  loadOrderById: (orderId: string) => Promise<void>;
  placeOrder: (input: PlaceOrderInput) => Promise<Order>;
  loadTracking: (orderId: string) => Promise<void>;
  assignOrder: (orderId: string, assignedTo: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  clearActiveOrder: () => void;
  clearError: () => void;
}

const replaceOrderInList = (orders: Order[], updatedOrder: Order): Order[] => {
  return orders.map((order) =>
    order.id === updatedOrder.id ? updatedOrder : order,
  );
};

export const useOrderStore = create<OrderStoreState>((set, get) => ({
  myOrders: [],
  adminOrders: [],
  activeOrder: null,
  trackingSteps: [],
  isLoading: false,
  error: null,

  loadMyOrders: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const myOrders = await orderService.getOrdersByUser(userId);
      set({
        myOrders,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load orders.";
      set({ isLoading: false, error: message });
    }
  },

  loadAllOrders: async () => {
    try {
      set({ isLoading: true, error: null });
      const adminOrders = await orderService.getAllOrders();
      set({
        adminOrders,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load all orders.";
      set({ isLoading: false, error: message });
    }
  },

  loadOrderById: async (orderId: string) => {
    try {
      set({ isLoading: true, error: null });
      const activeOrder = await orderService.getOrderById(orderId);
      set({
        activeOrder,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load order details.";
      set({ isLoading: false, error: message });
    }
  },

  placeOrder: async (input: PlaceOrderInput) => {
    try {
      set({ isLoading: true, error: null });

      const order = await orderService.placeOrder(input);
      const myOrders = await orderService.getOrdersByUser(input.userId);

      set({
        myOrders,
        activeOrder: order,
        trackingSteps: [],
        isLoading: false,
        error: null,
      });

      await useCartStore.getState().loadCart(input.userId);
      useCartStore.getState().clearCheckoutState();

      return order;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to place order.";
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  loadTracking: async (orderId: string) => {
    try {
      set({ isLoading: true, error: null });

      const [activeOrder, trackingSteps] = await Promise.all([
        orderService.getOrderById(orderId),
        orderService.getTrackingSteps(orderId),
      ]);

      set({
        activeOrder,
        trackingSteps,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load tracking.";
      set({ isLoading: false, error: message });
    }
  },

  assignOrder: async (orderId: string, assignedTo: string) => {
    try {
      set({ isLoading: true, error: null });

      const updatedOrder = await adminService.assignOrder(orderId, assignedTo);

      set({
        adminOrders: replaceOrderInList(get().adminOrders, updatedOrder),
        myOrders: replaceOrderInList(get().myOrders, updatedOrder),
        activeOrder:
          get().activeOrder?.id === updatedOrder.id
            ? updatedOrder
            : get().activeOrder,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to assign order.";
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus) => {
    try {
      set({ isLoading: true, error: null });

      const updatedOrder = await adminService.updateOrderStatus(
        orderId,
        status,
      );

      let trackingSteps = get().trackingSteps;

      if (get().activeOrder?.id === updatedOrder.id) {
        trackingSteps = await orderService.getTrackingSteps(orderId);
      }

      set({
        adminOrders: replaceOrderInList(get().adminOrders, updatedOrder),
        myOrders: replaceOrderInList(get().myOrders, updatedOrder),
        activeOrder:
          get().activeOrder?.id === updatedOrder.id
            ? updatedOrder
            : get().activeOrder,
        trackingSteps,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update order status.";
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  clearActiveOrder: () => {
    set({
      activeOrder: null,
      trackingSteps: [],
    });
  },

  clearError: () => set({ error: null }),
}));

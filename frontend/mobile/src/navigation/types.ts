import type { NavigatorScreenParams } from "@react-navigation/native";

export type PublicStackParamList = {
  Splash: undefined;
  Login: undefined;
  AdminLogin: undefined;
};

export type CustomerTabParamList = {
  HomeTab: undefined;
  CategoriesTab: undefined;
  SearchTab: undefined;
  CartTab: undefined;
  OrdersTab: undefined;
  ProfileTab: undefined;
};

export type CustomerRootStackParamList = {
  CustomerTabs: NavigatorScreenParams<CustomerTabParamList>;
  ProductList: { categoryId?: string; title?: string } | undefined;
  ProductDetails: { productId: string };
  Address: undefined;
  Checkout: undefined;
  Payment: undefined;
  OrderSuccess: { orderId: string };
  OrderTracking: { orderId: string };
  Support: undefined;
};

export type AdminTabParamList = {
  DashboardTab: undefined;
  ProductsTab: undefined;
  OrdersTab: undefined;
  InventoryTab: undefined;
  UsersTab: undefined;
};

export type AdminRootStackParamList = {
  AdminTabs: NavigatorScreenParams<AdminTabParamList> | undefined;
  ProductForm: { mode: "create" } | { mode: "edit"; productId: string };
  Categories: undefined;
  Coupons: undefined;
  DeliveryZones: undefined;
  OrderDetails: { orderId: string };
};

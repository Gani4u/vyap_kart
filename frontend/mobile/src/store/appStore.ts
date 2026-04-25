import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AppRoleView = "public" | "customer" | "admin";

interface AppStoreState {
  isAppReady: boolean;
  hasCompletedOnboarding: boolean;
  activeRoleView: AppRoleView;

  currentCity: string;
  currentPincode: string;
  deliveryPromise: string;

  selectedCategoryId: string | null;
  searchQuery: string;

  setAppReady: (value: boolean) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;

  setActiveRoleView: (role: AppRoleView) => void;
  setSelectedCategoryId: (categoryId: string | null) => void;
  setSearchQuery: (query: string) => void;
  resetBrowseState: () => void;
}

export const useAppStore = create<AppStoreState>()(
  persist(
    (set) => ({
      isAppReady: false,
      hasCompletedOnboarding: false,
      activeRoleView: "public",

      currentCity: "Ilkal",
      currentPincode: "587125",
      deliveryPromise:
        "Order before 4 PM for same day or next morning delivery",

      selectedCategoryId: null,
      searchQuery: "",

      setAppReady: (value: boolean) => {
        set({ isAppReady: value });
      },

      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
      },

      resetOnboarding: () => {
        set({ hasCompletedOnboarding: false });
      },

      setActiveRoleView: (role: AppRoleView) => {
        set({ activeRoleView: role });
      },

      setSelectedCategoryId: (categoryId: string | null) => {
        set({ selectedCategoryId: categoryId });
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      resetBrowseState: () => {
        set({
          selectedCategoryId: null,
          searchQuery: "",
        });
      },
    }),
    {
      name: "vyapkart-app-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
    },
  ),
);

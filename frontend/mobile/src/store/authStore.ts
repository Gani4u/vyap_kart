import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { authService } from "../services/authService";
import type {
  SendOtpResponse,
  VerifyOtpResponse,
} from "../services/authService";
import type { User } from "../types/models";

interface AuthStoreState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;

  sendOtp: (mobile: string) => Promise<SendOtpResponse>;
  login: (mobile: string, otp: string) => Promise<VerifyOtpResponse>;
  hydrateUser: () => Promise<void>;
  setUser: (user: User, token?: string | null) => void;
  logout: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
  setHydrated: (value: boolean) => void;
}

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isHydrated: true,
  error: null,
};

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setHydrated: (value: boolean) => {
        set({ isHydrated: value });
      },

      sendOtp: async (mobile: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authService.sendOtp(mobile);

          set({ isLoading: false });
          return response;
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Failed to send OTP.";

          set({
            isLoading: false,
            error: message,
          });

          throw error;
        }
      },

      login: async (mobile: string, otp: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authService.verifyOtp(mobile, otp);

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return response;
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Login failed.";

          set({
            isLoading: false,
            isAuthenticated: false,
            error: message,
          });

          throw error;
        }
      },

      hydrateUser: async () => {
        const { user, isAuthenticated } = get();

        if (!user || !isAuthenticated) {
          set({ isHydrated: true });
          return;
        }

        try {
          set({ isLoading: true, error: null });

          const freshUser = await authService.getMe(user.id);

          set({
            user: freshUser,
            isLoading: false,
            isHydrated: true,
            error: null,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Failed to hydrate user.";

          set({
            ...initialState,
            isHydrated: true,
            error: message,
          });
        }
      },

      setUser: (user: User, token?: string | null) => {
        set({
          user,
          token: token ?? `mock-token-${user.id}`,
          isAuthenticated: true,
          error: null,
        });
      },

      logout: async () => {
        try {
          set({ isLoading: true, error: null });

          await authService.logout();

          set({
            ...initialState,
            isHydrated: true,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Logout failed.";

          set({
            ...initialState,
            isHydrated: true,
            error: message,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set({
          ...initialState,
          isHydrated: true,
        });
      },
    }),
    {
      name: "vyapkart-auth-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
        state?.clearError();
      },
    },
  ),
);

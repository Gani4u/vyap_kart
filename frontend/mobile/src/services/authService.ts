import { users } from "../data";
import { User } from "../types/models";

const MOCK_OTP = "1234";

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export interface SendOtpResponse {
  success: boolean;
  message: string;
  mobile: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
}

class AuthService {
  async sendOtp(mobile: string): Promise<SendOtpResponse> {
    await delay();

    const trimmedMobile = mobile.trim();
    const user = users.find((item) => item.mobile === trimmedMobile);

    if (!user) {
      throw new Error("User not found for this mobile number.");
    }

    return {
      success: true,
      message: "Mock OTP sent successfully.",
      mobile: trimmedMobile,
      otp: MOCK_OTP,
    };
  }

  async verifyOtp(mobile: string, otp: string): Promise<VerifyOtpResponse> {
    await delay();

    const trimmedMobile = mobile.trim();
    const trimmedOtp = otp.trim();

    const user = users.find((item) => item.mobile === trimmedMobile);

    if (!user) {
      throw new Error("User not found.");
    }

    if (trimmedOtp !== MOCK_OTP) {
      throw new Error("Invalid OTP. Use 1234 for mock login.");
    }

    return {
      success: true,
      message: "Login successful.",
      user: clone(user),
      token: `mock-token-${user.id}`,
    };
  }

  async getMe(userId: string): Promise<User> {
    await delay();

    const user = users.find((item) => item.id === userId);

    if (!user) {
      throw new Error("User not found.");
    }

    return clone(user);
  }

  async getUserByMobile(mobile: string): Promise<User | null> {
    await delay();

    const user = users.find((item) => item.mobile === mobile.trim());

    return user ? clone(user) : null;
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    await delay();

    return {
      success: true,
      message: "Logged out successfully.",
    };
  }
}

export const authService = new AuthService();

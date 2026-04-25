import { addresses } from "../data";
import type { Address } from "../types/models";

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

class AddressService {
  async getAddressesByUser(userId: string): Promise<Address[]> {
    await delay();

    return clone(addresses.filter((item) => item.userId === userId));
  }

  async getAddressById(addressId: string): Promise<Address> {
    await delay();

    const address = addresses.find((item) => item.id === addressId);

    if (!address) {
      throw new Error("Address not found.");
    }

    return clone(address);
  }

  async getDefaultAddress(userId: string): Promise<Address | null> {
    await delay();

    const address = addresses.find(
      (item) => item.userId === userId && item.isDefault,
    );

    return address ? clone(address) : null;
  }
}

export const addressService = new AddressService();

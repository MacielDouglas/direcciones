import type { typeAddress } from "../../../constants/address";

type AddressType = keyof typeof typeAddress;

export interface AddressFormData {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  gps: string;
  complement: string;
  photo: string;
  type: AddressType;
  active: boolean;
  confirmed: boolean;
  visited: boolean;
  customName: string;
}

// types/address.types.ts
export interface Address {
  id: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  complement?: string;
  confirmed: boolean;
  active?: boolean;
  gps?: string;
  photo: string;
  customName?: string;
  type: "house" | "department" | "store" | "hotel" | "restaurant";
}

// types/myCard.types.ts
export interface MyCard {
  id: string;
  number: string;
  startDate: string;
  street: Address[];
}

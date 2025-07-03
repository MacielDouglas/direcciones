import type { typeAddress } from "../constants/address";

type AddressType = keyof typeof typeAddress;

export interface AddressData {
  id: string;
  street: string;
  number: string;
  city: string;
  neighborhood: string;
  gps?: string;
  complement?: string;
  type: "house" | "department" | "store" | "hotel" | "restaurant";
  photo?: string;
  userId: string; // Referência ao usuário
  active: boolean;
  confirmed: boolean;
  group: string;
  visited: boolean;
  customName?: string;
  createdAt?: string;
  updatedAt?: string;
}

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

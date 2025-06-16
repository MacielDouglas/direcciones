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

export interface AddressFormData {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  gps: string;
  complement: string;
  photo: string;
  type: "house" | "apartment" | "store" | "hotel" | "restaurant" | string;
  active: boolean;
  confirmed: boolean;
  visited: boolean;
  customName: string;
}

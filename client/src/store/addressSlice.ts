import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Address {
  id: string; // correspondente ao ObjectId do Mongo
  street: string;
  number: string;
  city: string;
  neighborhood: string;
  gps?: string;
  complement?: string;
  type: "house" | "department" | "store" | "hotel" | "restaurant";
  photo?: string;
  userId: string;
  active: boolean;
  confirmed: boolean;
  group: string;
  visited: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AddressState {
  addressesData: Address[];
  sessionExpiry: number | null;
}

const initialState: AddressState = {
  addressesData: [],
  sessionExpiry: null,
};

const addressSlice = createSlice({
  name: "addresses",
  initialState,
  reducers: {
    setAddresses: (state, action: PayloadAction<{ addresses: Address[] }>) => {
      state.addressesData = action.payload.addresses;
      state.sessionExpiry = Date.now() + 60 * 60 * 1000; // 1 hora
    },
    clearAddresses: (state) => {
      state.addressesData = [];
      state.sessionExpiry = null;
    },
    addAddress: (state, action: PayloadAction<Address>) => {
      state.addressesData.push(action.payload);
    },
    updateAddress: (state, action: PayloadAction<Address>) => {
      const index = state.addressesData.findIndex(
        (addr) => addr.id === action.payload.id
      );
      if (index !== -1) {
        state.addressesData[index] = action.payload;
      }
    },
    removeAddress: (state, action: PayloadAction<string>) => {
      state.addressesData = state.addressesData.filter(
        (addr) => addr.id !== action.payload
      );
    },
  },
});

export const {
  setAddresses,
  clearAddresses,
  addAddress,
  updateAddress,
  removeAddress,
} = addressSlice.actions;

export default addressSlice.reducer;

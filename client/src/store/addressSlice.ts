import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AddressData } from "../types/address.types";

interface AddressState {
  addressesData: AddressData[];
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
    setAddresses: (
      state,
      action: PayloadAction<{ addresses: AddressData[] }>
    ) => {
      state.addressesData = action.payload.addresses;
      state.sessionExpiry = Date.now() + 60 * 60 * 1000; // 1 hora
    },
    clearAddresses: (state) => {
      state.addressesData = [];
      state.sessionExpiry = null;
    },
    addAddress: (state, action: PayloadAction<AddressData>) => {
      state.addressesData.push(action.payload);
    },
    updateAddress: (state, action: PayloadAction<AddressData>) => {
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

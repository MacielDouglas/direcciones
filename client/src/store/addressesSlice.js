import { createSlice } from "@reduxjs/toolkit";

const addressesSlice = createSlice({
  name: "addresses",
  initialState: {
    addressesData: null,
    sessionExpiry: null, // Adicione a expiração da sessão
  },
  reducers: {
    setAddresses: (state, action) => {
      state.addressesData = action.payload.addresses;

      state.sessionExpiry = Date.now() + 60 * 60 * 1000;
    },
    clearAddresses: (state) => {
      state.addressesData = null;
      state.sessionExpiry = null;
    },
  },
});

export const { setAddresses, clearAddresses } = addressesSlice.actions;
export default addressesSlice.reducer;

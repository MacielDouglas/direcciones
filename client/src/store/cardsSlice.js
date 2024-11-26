import { createSlice } from "@reduxjs/toolkit";

const cardsSlice = createSlice({
  name: "cards",
  initialState: {
    cardsData: null,
    sessionExpiry: null, // Adicione a expiração da sessão
  },
  reducers: {
    setCards: (state, action) => {
      state.cardsData = action.payload.cards;

      state.sessionExpiry = Date.now() + 60 * 60 * 1000;
    },
    clearCards: (state) => {
      state.cardsData = null;
      state.sessionExpiry = null;
    },
  },
});

export const { setCards, clearCards } = cardsSlice.actions;
export default cardsSlice.reducer;

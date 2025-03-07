import { createSlice } from "@reduxjs/toolkit";

const cardsSlice = createSlice({
  name: "cards",
  initialState: {
    cardsData: [], // Agora é um array vazio
    myCardsData: [], // Agora é um array vazio
    sessionExpiry: null, // Expiração da sessão
  },
  reducers: {
    setCards: (state, action) => {
      state.cardsData = action.payload.cards ?? state.cardsData;
      state.myCardsData = action.payload.myCards ?? state.myCardsData;
      state.sessionExpiry = Date.now() + 60 * 60 * 1000; // Define a expiração para 1 hora
    },
    clearCards: (state) => {
      state.cardsData = [];
      state.myCardsData = [];
      state.sessionExpiry = null;
    },
  },
});

export const { setCards, clearCards } = cardsSlice.actions;
export default cardsSlice.reducer;

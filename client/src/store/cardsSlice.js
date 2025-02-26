import { createSlice } from "@reduxjs/toolkit";

const cardsSlice = createSlice({
  name: "cards",
  initialState: {
    cardsData: null,
    myCardsData: null,
    sessionExpiry: null, // Adicione a expiração da sessão
  },
  reducers: {
    setCards: (state, action) => {
      state.cardsData = action.payload.cards;
      state.sessionExpiry = Date.now() + 60 * 60 * 1000;
    },
    setMyCards: (state, action) => {
      state.myCardsData = action.payload.myCards;
      state.sessionExpiry = Date.now() + 60 * 60 * 1000;
    },
    clearCards: (state) => {
      state.cardsData = null;
      state.myCardsData = null;
      state.sessionExpiry = null;
    },
    clearMyCards: (state) => {
      state.myCardsData = null;
      state.cardsData = null;
      state.sessionExpiry = null;
    },
  },
});

export const { setCards, setMyCards, clearCards, clearMyCards } =
  cardsSlice.actions;
export default cardsSlice.reducer;

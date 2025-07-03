import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Card } from "../types/cards.types";

interface CardsState {
  cardsData: Card[];
  sessionExpiry: number | null;
}

const initialState: CardsState = {
  cardsData: [],
  sessionExpiry: null,
};

const cardSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    setCards: (state, action: PayloadAction<{ cards: Card[] }>) => {
      state.cardsData = action.payload.cards;
      state.sessionExpiry = Date.now() + 60 * 60 * 1000;
    },
    clearCards: (state) => {
      state.cardsData = [];
      state.sessionExpiry = null;
    },
    addCards: (state, action: PayloadAction<Card>) => {
      state.cardsData.push(action.payload);
    },
    updateCards: (state, action: PayloadAction<Card>) => {
      const index = state.cardsData.findIndex(
        (card) => card.id === action.payload.id
      );
      if (index !== -1) {
        state.cardsData[index] = action.payload;
      }
    },
    removedCards: (state, action: PayloadAction<string>) => {
      state.cardsData = state.cardsData.filter(
        (card) => card.id !== action.payload
      );
    },
  },
});

export const { setCards, clearCards, addCards, updateCards, removedCards } =
  cardSlice.actions;

export default cardSlice.reducer;

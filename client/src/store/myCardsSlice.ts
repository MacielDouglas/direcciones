import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Card } from "../types/cards.types";

interface MyCardState {
  myCardData: Card[];
  sessionExpiry: number | null;
}

const initialState: MyCardState = {
  myCardData: [],
  sessionExpiry: null,
};

const myCardsSlice = createSlice({
  name: "myCard",
  initialState,
  reducers: {
    setMyCards: (state, action: PayloadAction<{ myCard: Card[] }>) => {
      state.myCardData = action.payload.myCard;
      state.sessionExpiry = Date.now() + 60 * 60 * 1000;
    },
    clearMyCards: (state) => {
      state.myCardData = [];
      state.sessionExpiry = null;
    },

    removeMyCard: (state, action: PayloadAction<string>) => {
      state.myCardData = state.myCardData.filter(
        (card) => card.id !== action.payload
      );
    },
  },
});

export const { setMyCards, clearMyCards, removeMyCard } = myCardsSlice.actions;
export default myCardsSlice.reducer;

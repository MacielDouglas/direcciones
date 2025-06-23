import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Cards {
  id: string; // correspondente ao ObjectId do Mongo
  number: string;
  startDate: string;
  endDate: string;
  group: string;
  street: {
    id: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    complement?: string;
    gps?: string;
    group: string;
    type: "house" | "department" | "store" | "hotel" | "restaurant";
    confirmed: boolean;
    visited: boolean;
    active: boolean;
    photo?: string;
  };
  usersAssigned?: { date: string; userId: string }[];
}

interface CardsState {
  cardsData: Cards[];
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
    setCards: (state, action: PayloadAction<{ cards: Cards[] }>) => {
      state.cardsData = action.payload.cards;
      state.sessionExpiry = Date.now() + 60 * 60 * 1000;
    },
    clearCards: (state) => {
      state.cardsData = [];
      state.sessionExpiry = null;
    },
    addCards: (state, action: PayloadAction<Cards>) => {
      state.cardsData.push(action.payload);
    },
    updateCards: (state, action: PayloadAction<Cards>) => {
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

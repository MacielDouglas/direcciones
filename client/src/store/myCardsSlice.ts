import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Street {
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
}

interface Card {
  id: string;
  number: string;
  startDate: string;
  endDate: string;
  street: Street[];
}

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

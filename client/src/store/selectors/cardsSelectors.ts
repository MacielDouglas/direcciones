import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import type { Cards } from "../cardsSlice";

export const selectCardsState = (state: RootState) => state.cards;

export const selectAllCards = createSelector(
  selectCardsState,
  (cardsState) => cardsState.cardsData
);

export const selectCardsById = (id: string) =>
  createSelector(selectAllCards, (cards: Cards[]) =>
    cards.find((card) => card.id === id)
  );

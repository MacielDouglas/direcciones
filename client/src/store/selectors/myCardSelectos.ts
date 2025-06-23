import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";

export const selectMyCardsState = (state: RootState) => state.myCard;

export const selectAllMyCard = createSelector(
  selectMyCardsState,
  (myCardState) => myCardState.myCardData
);

// import { createSelector } from "@reduxjs/toolkit";
// import type { RootState } from "../index";
// import type { MyCards } from "../myCardsSlice";

// export const selectCardsState = (state: RootState) => state.cards;

// export const selectAllCards = createSelector(
//   selectCardsState,
//   (cardsState) => cardsState.cardsData
// );

// export const selectMyCardsById = (id: string) =>
//   createSelector(selectAllCards, (cards: MyCards[]) =>
//     cards.find((card) => card.id === id)
//   );

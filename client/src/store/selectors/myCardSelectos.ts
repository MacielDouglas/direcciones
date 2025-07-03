import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";

export const selectMyCardsState = (state: RootState) => state.myCard;

export const selectAllMyCard = createSelector(
  selectMyCardsState,
  (myCardState) => myCardState.myCardData
);

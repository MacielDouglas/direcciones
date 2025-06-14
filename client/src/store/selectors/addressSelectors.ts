import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import type { Address } from "../addressSlice";

export const selectAddressState = (state: RootState) => state.addresses;

export const selectAllAddresses = createSelector(
  selectAddressState,
  (addressState) => addressState.addressesData
);

export const selectAddressById = (id: string) =>
  createSelector(selectAllAddresses, (addresses: Address[]) =>
    addresses.find((addr) => addr._id === id)
  );

export const selectConfirmedAddresses = createSelector(
  selectAllAddresses,
  (addresses) => addresses.filter((addr) => addr.confirmed)
);

export const selectActiveAddresses = createSelector(
  selectAllAddresses,
  (addresses) => addresses.filter((addr) => addr.active)
);

import type { ReactNode } from "react";
import type { addressIcons } from "../constants/constants";

export interface Address {
  id: string;
  street: string;
  neighborhood: string;
  number: string;
  type?: keyof typeof addressIcons;
}

export interface UsersAssigned {
  date: string;
  userId: string;
}

export interface Card {
  id: string;
  number: string;
  street: Address[];
  endDate?: string;
  startDate?: string;
  usersAssigned?: UsersAssigned[];
}

export interface ButtonTypeOption {
  value: string;
  label: string;
  icon: ReactNode;
}

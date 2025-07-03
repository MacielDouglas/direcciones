import type { ReactNode } from "react";
import type { AddressData } from "./address.types";

export interface Card {
  id: string;
  street: AddressData[]; // Array de IDs de Address
  userId?: string; // ID do usuário atual designado (se houver)
  number: number;
  startDate?: string | null;
  endDate?: string | null;
  group: string;
  usersAssigned: UserAssignment[];
  assignedHistory: UserAssignment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UserAssignment {
  userId: string;
  date: string;
}

export interface ButtonTypeOption {
  value: string;
  label: string;
  icon: ReactNode;
}

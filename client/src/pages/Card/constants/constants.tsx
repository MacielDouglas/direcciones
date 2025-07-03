import {
  Bed,
  Home,
  Hotel,
  Store,
  Utensils,
  Send,
  SendHorizontal,
} from "lucide-react";
import type { ButtonTypeOption } from "../../../types/cards.types";
import type { AddressData } from "../../../types/address.types";

export const addressIcons = {
  house: <Home size={18} />,
  department: <Hotel size={18} />,
  store: <Store size={18} />,
  hotel: <Bed size={18} />,
  restaurant: <Utensils size={18} />,
} as const;

export const buttonTypeOptions: ButtonTypeOption[] = [
  {
    value: "notDesignate",
    label: "Tarjeta no enviada",
    icon: <Send size={18} />,
  },
  {
    value: "designate",
    label: "Tarjeta asignada",
    icon: <SendHorizontal size={18} />,
  },
];

export const getNeighborhoodSummary = (streets: AddressData[]) => {
  const neighborhoods = Array.from(new Set(streets.map((s) => s.neighborhood)));
  return neighborhoods.join(", ");
};

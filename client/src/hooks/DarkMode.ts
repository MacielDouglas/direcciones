import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export const useDarkMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useDarkMode deve ser usado dentro de um ThemeProvider");
  }
  return context;
};

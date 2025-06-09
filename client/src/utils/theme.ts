export const setTheme = (theme: string) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
};

export const getSavedTheme = () => {
  return localStorage.getItem("theme") || "light";
};

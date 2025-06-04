import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  UserRound,
  MapPinned,
  UsersRound,
  Dock,
  SendHorizontal,
  House,
} from "lucide-react";
import { menuOptions, menuSs } from "@/constants/menus";
import { selectAuthUser } from "@/store/slices/authSlice";
import { useDebounce } from "@/hooks/useDebonce";

const iconsMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Tarjetas: Dock,
  Dirección: MapPinned,
  Usuarios: UsersRound,
  Perfil: UserRound,
  Assignar: SendHorizontal,
  Home: House,
};

interface MenuItemProps {
  to: string;
  label: string;
  isActive: boolean;
  IconComponent?: React.ComponentType<{ size?: number }>;
}

const MenuItem: React.FC<MenuItemProps> = ({
  to,
  label,
  IconComponent,
  isActive,
}) => (
  <div className="w-full">
    <Link
      to={to}
      className={`flex flex-col items-center p-2 w-full transition-colors duration-200 ${
        isActive
          ? "text-slate-900 dark:text-slate-50"
          : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
      }`}
    >
      {IconComponent && <IconComponent size={24} />}
      <p className="text-xs md:text-sm">{label}</p>
    </Link>
  </div>
);

const MenuBottom: React.FC = () => {
  const location = useLocation();
  const { pathname, search } = location;
  const { isSS = false } = useSelector(selectAuthUser) || {};
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Debounce opcional para melhor performance (implemente o hook useDebounce se necessário)
  const debouncedScrollY = useDebounce(lastScrollY, 100);

  const isItemActive = (path: string, label: string): boolean => {
    if (label === "Assignar") {
      return pathname === "/cards" && search.includes("tab=asignar");
    }
    if (label === "Tarjetas") {
      return pathname === "/cards" && !search.includes("tab=asignar");
    }
    return pathname === path;
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Usa o valor debounced para comparação
      if (currentScrollY > debouncedScrollY && currentScrollY > 100) {
        setVisible(false);
      } else if (currentScrollY < debouncedScrollY) {
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    const throttledHandleScroll = () => {
      window.requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [debouncedScrollY]);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-10
      bg-gradient-to-b from-slate-200/95 to-slate-400/95 backdrop-blur-sm
      dark:from-slate-800/95 dark:to-slate-950/95 shadow-lg border-t 
      border-slate-300 dark:border-slate-700
      transition-transform duration-300 ease-in-out
      ${visible ? "translate-y-0" : "translate-y-full"}`}
    >
      <nav className="max-w-2xl mx-auto flex justify-between px-2 py-1">
        <MenuItem
          to="/"
          label="Home"
          IconComponent={iconsMap["Home"]}
          isActive={pathname === "/"}
        />

        {Object.entries(menuOptions).map(([key, item]) => (
          <MenuItem
            key={key}
            to={item.path}
            label={item.label}
            IconComponent={iconsMap[item.label]}
            isActive={isItemActive(item.path, item.label)}
          />
        ))}

        {isSS &&
          Object.entries(menuSs).map(([key, item]) => (
            <MenuItem
              key={`ss-${key}`}
              to={item.path}
              label={item.label}
              IconComponent={iconsMap[item.label]}
              isActive={isItemActive(item.path, item.label)}
            />
          ))}
      </nav>
    </div>
  );
};

export default MenuBottom;

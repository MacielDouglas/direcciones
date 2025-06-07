import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  UserRound,
  MapPinned,
  UsersRound,
  Dock,
  SendHorizontal,
  LogOut,
  X,
  Equal,
} from "lucide-react";

// import { clearUser, selectAuthUser } from "@/store/slices/authSlice";
import { menuOptions, menuSs } from "@/constants/menus";
import { Button } from "./button";
import SessionProvider from "../private/SessionProvider";
import { selectIsSS } from "@/store/selectors/userSelectors";
import { clearUser } from "@/store/userSlice";
import { toast } from "sonner";

// Ícones por label
const iconsMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Tarjetas: Dock,
  Dirección: MapPinned,
  Usuarios: UsersRound,
  Perfil: UserRound,
  Assignar: SendHorizontal,
};

type MenuItemProps = {
  to: string;
  label: string;
  IconComponent?: React.ComponentType<{ size?: number }>;
};

const MenuItem: React.FC<MenuItemProps> = ({ to, label, IconComponent }) => (
  <li>
    <Link
      to={to}
      onClick={() => window.scrollTo(0, 0)}
      className="flex items-center gap-4 p-4 text-slate-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white text-xl tracking-wide"
    >
      {IconComponent && <IconComponent size={28} aria-hidden="true" />}
      <span>{label}</span>
    </Link>
  </li>
);

const HeaderMenu: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dispatch = useDispatch();
  const isSS = useSelector(selectIsSS);

  const handleToggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggingOut(true);
    dispatch(clearUser());
    toast("Logout com sucesso!!!");
    localStorage.removeItem("session_start_time");
  }, [dispatch]);

  const combinedMenu = useMemo(() => {
    const base = Object.entries(menuOptions);
    const extra = isSS ? Object.entries(menuSs) : [];
    return [...base, ...extra];
  }, [isSS]);

  return (
    <div className="relative z-50 ">
      <Button
        variant="ghost"
        aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
        onClick={handleToggleMenu}
        className="absolute -top-4.5 -left-8 z-50 text-slate-300 hover:text-white cursor-pointer"
      >
        {isMenuOpen ? (
          <X className="!w-8 !h-8" />
        ) : (
          <Equal className="!w-8 !h-8" />
        )}
      </Button>

      {isMenuOpen && (
        <div
          aria-label="Menu principal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/90 text-white flex flex-col items-center justify-center space-y-8 text-2xl"
        >
          <div className="flex items-center gap-5 text-4xl text-slate-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="40"
              height="40"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z"
              />
              <rect
                width="2"
                height="7"
                x="11"
                y="6"
                fill="currentColor"
                rx="1"
              >
                <animateTransform
                  attributeName="transform"
                  dur="9s"
                  repeatCount="indefinite"
                  type="rotate"
                  values="0 12 12;360 12 12"
                />
              </rect>
              <rect
                width="2"
                height="9"
                x="11"
                y="11"
                fill="currentColor"
                rx="1"
              >
                <animateTransform
                  attributeName="transform"
                  dur="0.75s"
                  repeatCount="indefinite"
                  type="rotate"
                  values="0 12 12;360 12 12"
                />
              </rect>
            </svg>
            <SessionProvider />
          </div>

          <nav role="navigation" aria-label="Links de navegação">
            <ul className="flex flex-col gap-4 items-center">
              {combinedMenu.map(([key, item]) => (
                <MenuItem
                  key={key}
                  to={item.path}
                  label={item.label}
                  IconComponent={iconsMap[item.label]}
                />
              ))}
            </ul>
          </nav>

          <div>
            <button
              onClick={handleLogout}
              type="button"
              disabled={isLoggingOut}
              className="mt-6 text-orange-500 text-2xl font-semibold flex items-center gap-2 hover:text-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              aria-label="Sair"
            >
              <LogOut size={30} />
              {isLoggingOut ? "Saindo..." : "Sair"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderMenu;

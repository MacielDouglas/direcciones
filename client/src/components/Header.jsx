import { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { RiMenu3Line, RiCloseLine, RiLogoutBoxRLine } from "react-icons/ri";
import menuOptions from "../constants/menu";
import { FaClock } from "react-icons/fa6";
import SessionProvider from "../context/SessionProvider";
import { useLogout } from "../graphql/hooks/useUser";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logoutUser, isLoggingOut } = useLogout();

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    if (!isLoggingOut) logoutUser();
  }, [logoutUser, isLoggingOut]);

  const menuItems = useMemo(
    () =>
      Object.values(menuOptions).map(({ path, label }) => (
        <li key={label}>
          <Link
            to={path}
            className="hover:text-gray-300"
            onClick={handleMenuToggle}
          >
            {label}
          </Link>
        </li>
      )),
    [handleMenuToggle]
  );

  return (
    <header className="w-full bg-transparent text-secondary p-4 flex justify-between items-center relative z-50">
      {/* Logo */}
      <Link to="/" className="text-2xl uppercase font-bold tracking-[0.5rem]">
        Direcciones
      </Link>

      {/* Botão de Menu */}
      <div className=" top-5 right-5 z-50 flex flex-col items-center w-10">
        <button
          className="border rounded-full bg-slate-300 p-2"
          onClick={handleMenuToggle}
          aria-label="Menu Toggle"
        >
          {isMenuOpen ? <RiCloseLine /> : <RiMenu3Line />}
        </button>
        <div className="text-xs text-secondary">
          <SessionProvider />
        </div>
      </div>

      {/* Menu Responsivo */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            role="navigation"
            aria-label="Menu principal"
            className="fixed inset-0 bg-black text-primary bg-opacity-90 flex flex-col items-center justify-center space-y-6 text-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* Tempo de sessão */}
            <div className="text-3xl flex items-center gap-2">
              <FaClock aria-hidden="true" />
              <SessionProvider />
            </div>

            {/* Links do Menu */}
            <ul className="space-y-4 text-center">{menuItems}</ul>

            {/* Botão de Logout */}
            <button
              onClick={handleLogout}
              className="text-red-500 flex items-center gap-2 text-xl"
              disabled={isLoggingOut}
            >
              <RiLogoutBoxRLine size={24} />
              {isLoggingOut ? "Saliendo..." : "Salir"}
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

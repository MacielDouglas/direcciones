import { useCallback, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { RiMenu3Line, RiCloseLine, RiLogoutBoxRLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import SessionProvider from "../context/SessionProvider";
import menuOptions from "../constants/menu.js";
import { useLazyQuery } from "@apollo/client";
import { LOGOUT } from "../graphql/queries/user.query.js";
import { useDispatch } from "react-redux";
import { clearUser } from "../store/userSlice.js";
import { toast } from "react-toastify";
import { FaClock } from "react-icons/fa6";
import { clearCards } from "../store/cardsSlice.js";
import { clearAddresses } from "../store/addressesSlice.js";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();

  const [logoutUser, { loading: isLoggingOut }] = useLazyQuery(LOGOUT, {
    onCompleted: (data) => {
      if (data.logout.success) {
        dispatch(clearUser());
        dispatch(clearCards());
        dispatch(clearAddresses());
        toast.success("¡Cierre de sesión exitoso!");
      } else {
        toast.error(`Erro ao fazer logout: ${data.user.message}`);
      }
    },
    onError: (error) => {
      toast.error(`Erro na solicitação de logout: ${error.message}`);
    },
  });

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    if (!isLoggingOut) {
      logoutUser({ variables: { action: "logout" } });
    }
  }, [logoutUser, isLoggingOut]);

  const menuItems = useMemo(
    () =>
      Object.values(menuOptions).map((item) => (
        <li key={item.label} className="relative group">
          <Link
            to={item.path}
            className="hover:underline"
            onClick={handleMenuToggle}
          >
            {item.label}
          </Link>
        </li>
      )),
    [handleMenuToggle]
  );

  return (
    <div className="p-6 flex items-center justify-between text-xl relative">
      {/* Título */}
      <Link to="/" className="uppercase font-medium tracking-[0.5rem]">
        direcciones
      </Link>

      {/* Botão do Menu */}
      <div className="fixed top-5 right-5 z-50 flex flex-col items-center w-10">
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

      {/* Menu de Navegação */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-secondary md:justify-center md:items-center flex flex-col p-6 text-white text-5xl space-y-10 z-40 tracking-wide"
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <h1 className="uppercase font-medium tracking-widest text-3xl">
              Direcciones
            </h1>
            <ul className="space-y-8 md:text-center">
              <li>
                <Link
                  to="/"
                  onClick={handleMenuToggle}
                  className="hover:underline"
                >
                  Home
                </Link>
              </li>
              {menuItems}
            </ul>
            <button
              onClick={handleLogout}
              className=" text-orange-500 flex items-center gap-2"
              disabled={isLoggingOut}
            >
              <RiLogoutBoxRLine />
              {isLoggingOut ? "Encerrando..." : "Encerrar"}
            </button>
            <div className="flex gap-4 items-center  text-4xl">
              <FaClock />
              <span>
                <SessionProvider />
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Header;

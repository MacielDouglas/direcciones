import { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { RiMenu3Line, RiCloseLine, RiLogoutBoxRLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { useLazyQuery, useSubscription } from "@apollo/client";
import { LOGOUT } from "../graphql/queries/user.query";
import { clearUser } from "../store/userSlice";
import { clearCards } from "../store/cardsSlice";
import { clearAddresses } from "../store/addressesSlice";
import { toast } from "react-toastify";
import menuOptions from "../constants/menu";
import SessionProvider from "../context/SessionProvider";
import { FaClock } from "react-icons/fa6";
import { CARD_SUBSCRIPTION } from "../graphql/mutation/cards.mutation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { data, loading, error } = useSubscription(CARD_SUBSCRIPTION);
  // console.log(user);
  // if (user.isAuthenticated) {
  console.log("DATA, CARD Subes: ", data);
  console.log("Error, subscribe: ", error);
  console.log("Carregandooooo: ", loading);
  // }

  const [logoutUser, { loading: isLoggingOut }] = useLazyQuery(LOGOUT, {
    onCompleted: (data) => {
      if (data?.logout?.success) {
        dispatch(clearAddresses());
        dispatch(clearCards());
        dispatch(clearUser());
        toast.success("Sessão encerrada com sucesso!");
      } else {
        toast.error("Erro ao encerrar a sessão.");
      }
    },
    onError: () => {
      toast.error("Erro na solicitação de logout.");
    },
  });

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    if (!isLoggingOut) {
      logoutUser();
    }
  }, [logoutUser, isLoggingOut]);

  const menuItems = useMemo(
    () =>
      Object.values(menuOptions).map((item) => (
        <li key={item.label}>
          <Link
            to={item.path}
            className="hover:text-gray-300"
            onClick={handleMenuToggle}
          >
            {item.label}
          </Link>
        </li>
      )),
    [handleMenuToggle]
  );

  return (
    <header className="relative top-0 left-0 w-full bg-transparent text-secondary p-4 flex justify-between items-center z-50">
      <Link to="/" className="text-2xl uppercase font-bold tracking-[0.5rem]">
        Direcciones
      </Link>
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

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            className="fixed inset-0 bg-black text-primary bg-opacity-90 flex flex-col items-center justify-center space-y-6 text-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="text-3xl text-primary flex items-center gap-2 w-full justify-center">
              <FaClock />
              <SessionProvider />
            </div>
            <ul className="space-y-4 text-center">{menuItems}</ul>
            <button
              onClick={handleLogout}
              className="text-red-500 flex items-center gap-2 text-xl"
              disabled={isLoggingOut}
            >
              <RiLogoutBoxRLine size={24} />{" "}
              {isLoggingOut ? "Saindo..." : "Sair"}
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

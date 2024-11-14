import { useCallback, useState } from "react";
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

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();

  const [logoutUser] = useLazyQuery(LOGOUT, {
    onCompleted: (data) => {
      if (data.user.success) {
        dispatch(clearUser());
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
    logoutUser({ variables: { action: "logout" } });
  }, [logoutUser]);

  return (
    <div className="p-6 flex items-center justify-between text-3xl relative">
      <Link to={"/"} className="uppercase font-semibold tracking-widest">
        direcciones
      </Link>

      <button
        className="fixed top-5 right-5 border rounded-full bg-slate-300 p-2 z-50"
        onClick={handleMenuToggle}
      >
        {isMenuOpen ? <RiCloseLine /> : <RiMenu3Line />}
      </button>

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
            {/* <div> */}
            <ul className="space-y-8 md:text-center">
              <li>
                {" "}
                <Link
                  to="/"
                  onClick={handleMenuToggle}
                  className="hover:underline"
                >
                  Home
                </Link>
              </li>
              {Object.values(menuOptions).map((item) => (
                <li key={item.label} className="relative group">
                  <Link
                    to={item.path}
                    className="hover:underline"
                    onClick={handleMenuToggle}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            {/* </div> */}
            <button
              onClick={handleLogout}
              className="hover:underline text-orange-500 flex items-center gap-2"
            >
              Sair <RiLogoutBoxRLine />{" "}
            </button>

            <SessionProvider />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Header;

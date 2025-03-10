import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  IoAddOutline,
  IoPencilOutline,
  IoPersonAddOutline,
  IoHomeOutline,
} from "react-icons/io5";
import { FaRegRectangleList } from "react-icons/fa6";

const menuVariants = {
  hidden: { translateY: 100 },
  visible: { translateY: 0 },
};

function CardsSidebar() {
  const user = useSelector((state) => state.user);
  const location = useLocation();
  const currentTab = new URLSearchParams(location.search).get("tab") || "cards";
  const { isSS } = user.userData;

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const threshold = window.innerHeight * 0.2;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < threshold);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, threshold]);

  const menuOptions = [
    { to: "/", icon: <IoHomeOutline />, label: "Home" },
    { to: "/cards?tab=cards", icon: <FaRegRectangleList />, label: "Tarjetas" },
    ...(isSS
      ? [
          { to: "/cards?tab=crear", icon: <IoAddOutline />, label: "Crear" },
          {
            to: "/cards?tab=modificar",
            icon: <IoPencilOutline />,
            label: "Modificar",
          },
          {
            to: "/cards?tab=asignar",
            icon: <IoPersonAddOutline />,
            label: "Asignar",
          },
        ]
      : []),
  ];

  return (
    <motion.nav
      className="fixed bottom-0 left-0 h-[70px] w-full bg-secondary text-primary py-4 px-6 flex justify-between md:justify-center md:gap-20 z-50 lowercase"
      initial={{ translateY: 0 }}
      animate={{ translateY: isVisible ? 0 : 100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {menuOptions.map((item) => {
        const isActive = currentTab === item.to.split("tab=")[1];
        // const isActive = location.pathname === item.to;

        return (
          <Link
            key={item.label}
            to={item.to}
            className="flex flex-col items-center text-xs relative"
          >
            {/* Destaque com retângulo para o ícone ativo */}
            {isActive && (
              <motion.div
                className="absolute -top-2 w-3 h-1 rounded-full mb-5 bg-yellow-400"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            )}

            {/* Ícone com gradiente para simular luz */}
            <motion.div
              className={`text-2xl flex items-center flex-col ${
                isActive ? "text-yellow-300" : "text-gray-500"
              }`}
              animate={{ opacity: isActive ? 1 : 0.6 }}
              transition={{ duration: 0.3 }}
            >
              {item.icon}
              <span
                className={`mt-1 text-sm ${
                  isActive ? "text-yellow-500" : "text-details"
                }`}
              >
                {item.label}
              </span>
            </motion.div>
          </Link>
        );
      })}
    </motion.nav>
  );
}

export default CardsSidebar;

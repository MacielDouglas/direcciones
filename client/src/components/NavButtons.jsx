import { useEffect, useState, useMemo } from "react";
import {
  BsPerson,
  BsPeople,
  BsMap,
  BsCardList,
  BsHouseDoor,
  BsArrowLeftRight,
} from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

function NavButtons() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const user = useSelector((state) => state?.user);
  const { isSS, isSCards } = user?.userData || {};

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollY;
      const threshold = window.innerHeight * 0.2;
      const topThreshold = window.innerHeight * 0.5;

      if (scrollDiff > 0 && currentScrollY > threshold) {
        setIsVisible(false);
      } else if (scrollDiff < 0 && currentScrollY < topThreshold) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const menuItems = useMemo(() => {
    const baseItems = [
      { to: "/", icon: <BsHouseDoor />, label: "Home" },
      { to: "/cards", icon: <BsCardList />, label: "Tarjetas" },
      ...(isSCards
        ? [
            {
              to: "/cards?tab=asignar",
              icon: <BsArrowLeftRight />,
              label: "Asignar",
            },
          ]
        : []),
      { to: "/address", icon: <BsMap />, label: "Dirección" },
      { to: "/user", icon: <BsPerson />, label: "Usuario" },
      ...(isSS
        ? [{ to: "/adminUsers", icon: <BsPeople />, label: "Admin" }]
        : []),
    ];

    return baseItems;
  }, [isSS, isSCards]);

  const isItemActive = (to, label) => {
    const { pathname, search } = location;

    if (label === "Asignar") {
      return pathname === "/cards" && search.includes("tab=asignar");
    }

    if (label === "Tarjetas") {
      return pathname === "/cards" && !search.includes("tab=asignar");
    }

    return pathname === to;
  };

  return (
    <motion.nav
      role="navigation"
      aria-label="Menu de navegação"
      className="fixed bottom-0 left-0 h-[70px] w-full bg-secondary text-primary py-4 px-6 flex justify-between md:justify-center md:gap-20 z-40"
      initial={{ translateY: 0 }}
      animate={{ translateY: isVisible ? 0 : 100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {menuItems.map(({ to, icon, label }) => {
        const isActive = isItemActive(to, label);

        return (
          <Link
            key={label}
            to={to}
            aria-label={`Ir para ${label}`}
            aria-current={isActive ? "page" : undefined}
            className="flex flex-col items-center text-xs relative"
          >
            {isActive && (
              <motion.div
                className="absolute -top-2 w-3 h-1 rounded-full bg-yellow-400"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            )}
            <motion.div
              className={`text-2xl flex items-center flex-col ${
                isActive ? "text-yellow-300" : "text-gray-500"
              }`}
              animate={{ opacity: isActive ? 1 : 0.6 }}
              transition={{ duration: 0.3 }}
            >
              {icon}
              <span
                className={`mt-1 text-sm ${
                  isActive ? "text-yellow-500" : "text-details"
                }`}
              >
                {label}
              </span>
            </motion.div>
          </Link>
        );
      })}
    </motion.nav>
  );
}

export default NavButtons;

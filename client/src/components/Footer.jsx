import {
  FaRegUser,
  FaRegRectangleList,
  FaRegMap,
  FaUsers,
} from "react-icons/fa6";
import { IoHomeOutline } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Footer() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const user = useSelector((state) => state.user);
  const { isSS } = user.userData;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollY;
      const threshold = window.innerHeight * 0.2;
      const topThreshold = window.innerHeight * 0.5; // 30% do topo

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

  const menuItems = [
    { to: "/", icon: <IoHomeOutline />, label: "home" },
    { to: "/cards", icon: <FaRegRectangleList />, label: "tarjetas" },
    { to: "/address", icon: <FaRegMap />, label: "dirección" },
    { to: "/user", icon: <FaRegUser />, label: "usuario" },
  ];

  if (isSS) {
    menuItems.push({ to: "/adminUsers", icon: <FaUsers />, label: "admin" });
  }

  return (
    <motion.footer
      className="fixed bottom-0 left-0 h-[70px] w-full bg-secondary text-primary py-4 px-6 flex justify-between md:justify-center md:gap-20 z-40"
      initial={{ translateY: 0 }}
      animate={{ translateY: isVisible ? 0 : 100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {menuItems.map((item) => {
        const isActive = location.pathname === item.to;

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
    </motion.footer>
  );
}

export default Footer;

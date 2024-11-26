import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IoAddOutline,
  IoPencilOutline,
  IoPersonAddOutline,
} from "react-icons/io5";
import { FaRegUser, FaRegRectangleList, FaRegMap } from "react-icons/fa6";

function CardsSidebar() {
  const user = useSelector((state) => state.user);
  const location = useLocation();

  const { isAdmin } = user.userData;

  // Define as opções de menu com base no tipo de usuário
  const menuOptions = isAdmin
    ? [
        {
          to: "/cards?tab=cards",
          icon: <FaRegRectangleList />,
          label: "Tarjetas",
        },
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
    : [
        {
          to: "/cards?tab=tarjetas",
          icon: <IoCardOutline />,
          label: "Tarjetas",
        },
      ];

  return (
    <div className="md:flex md:flex-col md:h-full md:w-[250px] bg-secondary text-primary">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col gap-4 p-4">
        {menuOptions.map((item) => {
          // Aba ativa: verifica a URL atual ou define "Tarjetas" como padrão
          const isActive =
            location.search.includes(item.to.split("?tab=")[1]) ||
            (!location.search && item.label === "Tarjetas");

          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-3 p-3 rounded-md transition-all ${
                isActive
                  ? " text-yellow-400"
                  : "hover:bg-gray-700 text-gray-300"
              }`}
            >
              <motion.div
                className={`text-2xl ${
                  isActive ? "text-yellow-500" : "text-gray-500"
                }`}
                animate={{ opacity: isActive ? 1 : 0.8 }}
                transition={{ duration: 0.3 }}
              >
                {item.icon}
              </motion.div>
              <span
                className={`text-lg md:text-sm lg:text-lg font-medium ${
                  isActive ? "text-yellow-800" : "text-gray-300"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Mobile Navbar */}
      <div className="flex md:hidden bg-secondary w-full h-[70px] justify-around items-center">
        {menuOptions.map((item) => {
          const isActive =
            location.search.includes(item.to.split("?tab=")[1]) ||
            (!location.search && item.label === "Tarjetas");

          return (
            <Link
              key={item.label}
              to={item.to}
              className="flex flex-col items-center text-xs relative"
            >
              <motion.div
                className={`text-xl flex flex-col ${
                  isActive ? "text-yellow-400" : "text-gray-500"
                }`}
                animate={{ opacity: isActive ? 1 : 0.6 }}
                transition={{ duration: 0.3 }}
              >
                {item.icon}
                <span
                  className={`mt-1 text-xs font-medium ${
                    isActive ? "text-yellow-400" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default CardsSidebar;

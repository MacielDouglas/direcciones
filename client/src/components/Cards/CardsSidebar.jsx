import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IoAddOutline,
  IoPencilOutline,
  IoPersonAddOutline,
} from "react-icons/io5";
import { FaRegRectangleList } from "react-icons/fa6";

function CardsSidebar() {
  const user = useSelector((state) => state.user);
  const location = useLocation();

  // Obtém o valor do parâmetro 'tab' na URL
  const currentTab = new URLSearchParams(location.search).get("tab") || "cards";

  const { isSS } = user.userData;

  // Define as opções de menu com base no tipo de usuário
  const menuOptions = isSS
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
          to: "/cards?tab=cards",
          icon: <FaRegRectangleList />,
          label: "Tarjetas",
        },
      ];

  return (
    <div className="text-start text-lg w-full text-secondary">
      <div className="space-y-5 px-4 pt-3">
        <h1 className="text-4xl font-medium">Tarjetas</h1>
        {isSS ? (
          <p>
            En esta página, usted puede ver, las tarjetas asignadas, crear,
            modificar y asignar tarjetas.
          </p>
        ) : (
          <p>En esta página, usted puede ver, las tarjetas asignadas.</p>
        )}
      </div>

      <div className="flex text-center">
        {menuOptions.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className={`flex items-center p-4  w-full  transition-colors justify-center ${
              currentTab === item.to.split("tab=")[1]
                ? "bg-details"
                : "bg-primary hover:bg-[#eaeaea]"
            }`}
          >
            {/* {item.icon} */}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CardsSidebar;

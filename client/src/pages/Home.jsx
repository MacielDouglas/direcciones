import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import menuOptions from "../constants/menu";
import { motion } from "framer-motion";
import { FaRegUser, FaRegRectangleList, FaRegMap } from "react-icons/fa6";

export default function Home() {
  const user = useSelector((state) => state.user);
  const { name } = user.userData;

  // Mapeamento de ícones
  const iconsMap = {
    Tarjetas: FaRegRectangleList,
    Dirección: FaRegMap,
    Perfil: FaRegUser,
  };

  return (
    <div className="w-full min-h-screen text-black pb-32 px-6 flex flex-col items-center">
      {/* Título de boas-vindas */}
      <motion.div
        className="w-full max-w-3xl text-center mt-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h1 className="text-5xl font-light tracking-wide mb-8">
          Bienvenido, <span className="font-medium">{name}</span>.
        </h1>
        <p className="text-lg text-gray-600">
          Para comenzar, elija una de las siguientes opciones:
        </p>
      </motion.div>

      {/* Opções de Menu */}
      <div className="flex flex-col w-full max-w-2xl mt-4">
        {Object.entries(menuOptions).map(([key, item]) => {
          // Obtém o componente do ícone correspondente
          const IconComponent = iconsMap[item.label];

          return (
            <motion.div
              key={key}
              className="p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.1 * key,
                ease: "easeOut",
              }}
              whileHover={{ scale: 1.02, opacity: 0.95 }}
            >
              <Link
                to={item.path}
                className="flex gap-7 pt-10  h-full border-t border-details"
              >
                {/* Ícone Dinâmico */}
                {IconComponent && (
                  <IconComponent
                    size={38}
                    color="black"
                    className="flex-shrink-0"
                  />
                )}
                {/* Texto do Menu */}
                <p className="font-medium text-4xl tracking-widest ">
                  {item.label}
                </p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

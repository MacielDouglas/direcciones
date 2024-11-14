import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import menuOptions from "../constants/menu";
import { motion } from "framer-motion";

export default function Home() {
  const user = useSelector((state) => state.user);
  const { name } = user.userData;

  return (
    <div className="w-full min-h-screen  text-black pb-32 px-6 flex flex-col items-center">
      {/* Título de boas-vindas */}
      <motion.div
        className="w-full max-w-3xl text-center mt-16"
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
      <div className="flex flex-col gap-4 w-full max-w-2xl mt-10  ">
        {Object.entries(menuOptions).map(([key, item]) => (
          <motion.div
            key={key}
            className="p-6 "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * key, ease: "easeOut" }}
            whileHover={{ scale: 1.02, opacity: 0.95 }}
          >
            <Link
              to={item.path}
              className="flex flex-col justify-between h-full border-y border-details"
            >
              <p className="font-medium text-4xl my-10 tracking-widest">
                {item.label}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

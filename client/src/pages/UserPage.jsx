import { motion } from "framer-motion";
import { useSelector } from "react-redux";

function UserPage() {
  const user = useSelector((state) => state.user);
  const cards = useSelector((state) => state.cards);
  const { name, profilePicture, codUser } = user.userData;
  const { myCardsData } = cards;

  return (
    <div className="w-full min-h-screen text-black pb-32 px-6 flex flex-col items-center">
      {/* Título de boas-vindas */}
      <motion.div
        className="w-full max-w-3xl flex flex-col items-center gap-10 mt-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <img
          src={profilePicture}
          className="w-24 h-42 object-cover rounded-full self-center"
          alt={user.name}
        />
        <h1 className="text-5xl font-light tracking-wide">
          ¡Hola, <span className="font-medium">{name}</span>!
        </h1>
        <div className="text-lg text-gray-600 w-full text-start">
          <p>
            Usted tiene <strong>{myCardsData.length}</strong>{" "}
            {myCardsData.length > 1 ? "tarjetas asignadas" : "tarjeta asignada"}
            .
          </p>
          <p>
            Tu código de usuario: <strong>{codUser}</strong>{" "}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default UserPage;

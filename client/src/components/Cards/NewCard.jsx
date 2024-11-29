import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import NewCardManual from "./newCard/NewCardManual";

function NewCard() {
  const addresses = useSelector((state) => state.addresses.addressesData);
  const cards = useSelector((state) => state.cards.cardsData.card);

  return (
    <div className="text-start text-base md:text-lg w-full h-full">
      <div className="space-y-5 px-4 pt-3">
        <h1 className="text-2xl md:text-4xl font-medium">Crear Tarjetas</h1>
        {addresses && (
          <p>
            Actualmente hay{" "}
            <span className="font-semibold">{addresses.length}</span>{" "}
            direcciones disponibles y{" "}
            <span className="font-semibold">{cards && cards.length}</span>{" "}
            tarjetas.
          </p>
        )}
      </div>
      <motion.div
        key="manual"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.3 }}
      >
        <NewCardManual />
      </motion.div>
    </div>
  );
}

export default NewCard;

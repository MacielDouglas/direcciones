import { useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import NewCardManual from "./newCard/NewCardManual";
import NewCarAutomatic from "./newCard/NewCarAutomatic";
import NewCardsuggestion from "./newCard/NewCardSuggestion";

function NewCard() {
  const addresses = useSelector((state) => state.addresses.addressesData);
  const cards = useSelector((state) => state.cards.cardsData.card);

  const [activeTab, setActiveTab] = useState("manual");

  const renderTabContent = () => {
    switch (activeTab) {
      case "manual":
        return (
          <motion.div
            key="manual"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <p className="py-3">
              Elegiste crear tarjetas manualmente. Seleccionar direcciones
              deseado.
            </p>
            <NewCardManual />
          </motion.div>
        );
      case "automatic":
        return (
          <motion.div
            key="automatic"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <p>
              Modo automático seleccionado. Se crearán tarjetas automáticamente.
            </p>
            <NewCarAutomatic />
          </motion.div>
        );
      case "suggestion":
        return (
          <motion.div
            key="suggestion"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <p>Sugestões disponíveis com base nos dados existentes.</p>
            <NewCardsuggestion />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="text-start text-lg w-full h-screen">
      <div className="space-y-5 px-4 pt-3">
        <h1 className="text-4xl font-medium">Crear Tarjetas</h1>
        {addresses && (
          <p>
            Actualmente hay {addresses.length} direcciones y{" "}
            {cards && cards.length} tarjetas.
          </p>
        )}
      </div>

      <div>
        <h2 className="px-4">
          Para crear una nueva tarjeta, elija una de las siguientes opciones:
        </h2>
        <div className="border-b flex justify-around">
          {/* Abas */}
          <button
            onClick={() => setActiveTab("manual")}
            className={`px-4 py-2 border-b-2 w-full ${
              activeTab === "manual"
                ? "border-blue-500 text-blue-500 bg-details"
                : "border-transparent"
            }`}
          >
            Manual
          </button>
          {/* <button
            onClick={() => setActiveTab("automatic")}
            className={`px-4 py-2 border-b-2 w-full ${
              activeTab === "automatic"
                ? "border-blue-500 text-blue-500 bg-details"
                : "border-transparent"
            }`}
          >
            Automático
          </button> */}

          <button
            onClick={() => setActiveTab("suggestion")}
            className={`px-4 py-2 border-b-2 w-full ${
              activeTab === "suggestion"
                ? "border-blue-500 text-blue-500 bg-details"
                : "border-transparent"
            }`}
          >
            Sugerencia
          </button>
        </div>

        {/* Conteúdo da aba ativa com animação */}
        <div className="p-4 bg-details">
          <AnimatePresence mode="wait">{renderTabContent()}</AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default NewCard;

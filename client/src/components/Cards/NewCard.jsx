import { useState } from "react";
import { useSelector } from "react-redux";
import NewCardManual from "./newCard/NewCardManual";
import NewCarAutomatic from "./newCard/NewCarAutomatic";
import NewCardsuggestion from "./newCard/newCardsuggestion";

function NewCard() {
  const addresses = useSelector((state) => state.addresses.addressesData);
  const cards = useSelector((state) => state.cards.cardsData.card);
  console.log("DATACARDS", cards.length);
  console.log(addresses);

  // Estado para controlar a aba ativa
  const [activeTab, setActiveTab] = useState("manual");

  // Renderiza o conteúdo com base na aba ativa
  const renderTabContent = () => {
    switch (activeTab) {
      case "manual":
        return (
          <div className="">
            <p>
              Você escolheu criar cartões manualmente. Selecione as direções
              desejadas.
            </p>
            <NewCardManual />
          </div>
        );
      case "automatic":
        return (
          <div>
            <p>
              Modo automático selecionado. Cartões serão criados
              automaticamente.
            </p>
            <NewCarAutomatic />
          </div>
        );
      case "suggestion":
        return (
          <div>
            <p>Sugestões disponíveis com base nos dados existentes.</p>
            <NewCardsuggestion />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="text-start text-lg w-full h-screen ">
      <div className="space-y-5 px-4 pt-3">
        <h1 className="text-4xl font-medium">Crear Tarjetas</h1>
        {addresses && <p>Actualmente hay {addresses.length} direcciones.</p>}
        {cards && <p>Actualmente hay {cards.length} tarjetas.</p>}
      </div>

      <div>
        <h2>Para criar uma nova tarjeta, elija uma de las seguintes opções:</h2>
        <div className="border-b flex justify-around">
          {/* Abas */}
          <button
            onClick={() => setActiveTab("manual")}
            className={`px-4 py-2 border-b-2  w-full ${
              activeTab === "manual"
                ? "border-blue-500 text-blue-500 bg-details"
                : "border-transparent"
            }`}
          >
            Manual
          </button>
          <button
            onClick={() => setActiveTab("automatic")}
            className={`px-4 py-2 border-b-2  w-full ${
              activeTab === "automatic"
                ? "border-blue-500 text-blue-500  bg-details"
                : "border-transparent"
            }`}
          >
            Automático
          </button>

          <button
            onClick={() => setActiveTab("suggestion")}
            className={`px-4 py-2 border-b-2 w-full  ${
              activeTab === "suggestion"
                ? "border-blue-500 text-blue-500  bg-details"
                : "border-transparent"
            }`}
          >
            Sugerencia
          </button>
        </div>

        {/* Conteúdo da aba ativa */}
        <div className="p-4 bg-details">{renderTabContent()}</div>
      </div>
    </div>
  );
}

export default NewCard;

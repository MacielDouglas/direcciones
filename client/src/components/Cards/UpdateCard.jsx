import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useMemo, useState } from "react";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";

import SelectCardComponent from "./../hooks/SelectCardComponent";
import {
  useDeleteCard,
  useFetchCards,
  useUpdateCard,
} from "../../graphql/hooks/useCard";
import { useGetUsers } from "../../graphql/hooks/useUser";
import ComponentMaps from "../hooks/ComponentMaps";
import { setCards } from "../../store/cardsSlice";

function UpdateCard() {
  const dispatch = useDispatch();
  const cards = useSelector((state) => state.cards.cardsData || []);
  const addresses = useSelector((state) => state.addresses.addressesData || []);
  const [cardAssigned, setCardAssigned] = useState([]);
  const [cardNotAssigned, setCardNotAssigned] = useState([]);
  const [cardColors, setCardColors] = useState({});
  const [isModalOpen, setModalOpen] = useState(null);

  const [selectedStreets, setSelectedStreets] = useState([]);
  const [selectedCard, setSelectedCard] = useState([]);

  const { deleteCardInput } = useDeleteCard();
  const { updateCardInput } = useUpdateCard();
  const { fetchUsers, users } = useGetUsers();
  const { fetchCards } = useFetchCards();

  useEffect(() => {
    fetchUsers();
    fetchCards();
  }, [fetchUsers, fetchCards, updateCardInput]);

  useEffect(() => {
    const newCardAssigned = [];
    const newCardNotAssigned = [];
    const newUsersAssigned = [];
    // const newUsersNotAssigned = [];

    // Separar os cards com base na startDate
    cards.forEach((card) => {
      if (card.startDate !== null) {
        newCardAssigned.push(card);

        // Filtrar usuários atribuídos aos cards com startDate não nulo
        card.usersAssigned.forEach((userAssigned) => {
          const user = users.find((user) => user.id === userAssigned.userId);
          if (user) {
            newUsersAssigned.push(user);
          }
        });
      } else {
        newCardNotAssigned.push(card);
      }
    });

    setCardAssigned(newCardAssigned);
    setCardNotAssigned(newCardNotAssigned);
  }, [cards, users]);

  const addressMap = useMemo(
    () => new Map(addresses.map((a) => [a.id, a])),
    [addresses] // Apenas recalcula se `addresses` mudar
  );

  // Função para remover as ruas selecionadas do card
  const handleRemoveStreets = async () => {
    if (selectedCard.length === 0 || selectedStreets.length === 0) return;

    try {
      await updateCardInput({
        variables: {
          updateCardInput: {
            id: selectedCard[0].id,
            street: selectedStreets,
          },
          // action: "REMOVE", // Ou a ação que seu backend espera
        },
      });

      // Atualiza a lista de cards após a modificação
      const promises = [fetchCards()];
      const [cardsData] = await Promise.all(promises);
      dispatch(setCards({ cards: cardsData.data.card }));
      setSelectedStreets([]);
      setModalOpen(false);
      setSelectedCard([]);
    } catch (error) {
      console.error("Error removing streets:", error);
    }
  };

  // Função para obter todas as ruas disponíveis (não atribuídas a nenhum card)
  const getAvailableStreets = useMemo(() => {
    // Primeiro, coletamos todas as ruas que estão em cards
    const streetsInCards = new Set();
    cards.forEach((card) => {
      card.street?.forEach((st) => streetsInCards.add(st.id));
    });

    // Depois filtramos as addresses que não estão em nenhum card
    return addresses.filter((address) => !streetsInCards.has(address.id));
  }, [cards, addresses]);

  const handleStreetSelection = (streetId) => {
    setSelectedStreets((prev) =>
      prev.includes(streetId)
        ? prev.filter((id) => id !== streetId)
        : [...prev, streetId]
    );
  };

  const handleSelectCard = useCallback(
    (cardId, number, startDate, usersAssigned) => {
      setSelectedCard((prev) =>
        prev.some((card) => card.id === cardId)
          ? prev.filter((card) => card.id !== cardId)
          : [...prev, { id: cardId, number, startDate, usersAssigned }]
      );
    },
    []
  );

  const handleDeleteCard = async () => {
    setModalOpen(true);

    deleteCardInput({
      variables: {
        deleteCardId: selectedCard[0].id,
      },
    });

    // fetchCards();
    const promises = [fetchCards()];

    const [cardsData] = await Promise.all(promises);
    dispatch(setCards({ cards: cardsData.data.card }));
    setSelectedCard([]);
    setModalOpen(false);
  };

  useEffect(() => {
    if (cards.length && addresses.length) {
      const getCardColor = (cardId) => {
        if (selectedCard.length === 0) {
          return "#ef4444"; // Vermelho padrão
        }
        return selectedCard.some((card) => card.id === cardId)
          ? "#005cc8" // Azul para selecionados
          : "#ef4444"; // Vermelho para não selecionados
      };

      const colors = cards.reduce((acc, card) => {
        acc[card.id] = getCardColor(card.id);
        return acc;
      }, {});

      setCardColors(colors);
    }
  }, [cards, addressMap, selectedCard, addresses]);

  return (
    <div className="min-h-screen bg-details p-3 md:p-10 flex flex-col justify-center  mb-[40px] w-full items-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl"
      >
        <h1 className="text-3xl font-medium text-gray-700 mb-4">
          Modificar Tarjetas
        </h1>

        <p>Elige una tarjeta para modificar</p>
        <div className="flex-grow h-full z-0 -mx-5">
          <ComponentMaps
            mode="cards"
            addresses={addresses}
            handleSelectCard={handleSelectCard}
            cardColors={cardColors}
            cards={cards}
            setCardColors={setCardColors}
            selectedCard={selectedCard}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col my-3 max-w-[800px]">
            <div className="w-full flex items-center justify-content-between gap-10 p-3">
              <button
                className="p-2 w-full bg-blue-500 disabled:bg-blue-200 rounded-md text-white"
                disabled={selectedCard.length !== 1}
                onClick={() => setModalOpen("modificar")}
              >
                Modificar
              </button>
              <button
                className="p-2 w-full bg-red-500 disabled:bg-red-200 rounded-md text-white"
                disabled={selectedCard.length !== 1}
                onClick={() => setModalOpen("deletar")}
              >
                Deletar
              </button>
            </div>

            <div className="border-t border-stone-50 flex flex-col gap-4  border-r  max-h-full ">
              <h3 className="text-xl font-semibold">Tarjetas no asignadas</h3>
              {cardNotAssigned.length > 0 && (
                <SelectCardComponent
                  cardItem={cardNotAssigned}
                  handleSelectCard={handleSelectCard}
                  users={users}
                  selectedCard={selectedCard}
                  cardColors={cardColors}
                />
              )}
            </div>
            <div className="border-t border-t-stone-800 flex flex-col gap-4 md:w-2/3 md:overflow-y-auto max-h-full mt-5">
              <h3 className="text-xl font-semibold mt-3">Tarjetas en uso.</h3>
              <SelectCardComponent
                cardItem={cardAssigned}
                handleSelectCard={handleSelectCard}
                users={users}
                cardColors={cardColors}
                selectedCard={selectedCard}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg min-w-80 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              ¿Estás seguro que deseas{" "}
              <span className="uppercase">{isModalOpen}</span> esta tarjeta?
            </h2>

            {isModalOpen === "deletar" ? (
              <>
                <div className="max-h-60 overflow-y-auto border rounded p-3 mb-4">
                  {selectedCard.map((card) => (
                    <div key={card.id}>
                      <p className="text-lg font-medium">
                        Tarjeta: {card.number}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-center gap-4">
                  <button
                    className="bg-secondary text-white px-4 py-2 rounded"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={handleDeleteCard}
                  >
                    Deletar
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium mb-2">
                  Direcciones en esta tarjeta que deseas eliminar
                </h3>
                <div className="max-h-48 overflow-y-auto border rounded p-3 mb-4">
                  {cards
                    .filter((card) => card.id === selectedCard[0].id)
                    .map((street) => street.street)[0]
                    .map((st) => (
                      <div key={st.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedStreets.includes(st.id)}
                          onChange={() => handleStreetSelection(st.id)}
                        />
                        <p>
                          calle: {st.street}, {st.number} - {st.neighborhood} -{" "}
                          {st.city}
                        </p>
                      </div>
                    ))}
                  {selectedCard[0]?.street?.map((st) => (
                    <div key={st.id} className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={selectedStreets.includes(st.id)}
                        onChange={() => handleStreetSelection(st.id)}
                      />
                      <p>
                        calle: {st.street}, {st.number} - {st.neighborhood} -{" "}
                        {st.city}
                      </p>
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-medium mb-2">
                  Direcciones disponibles para añadir:{" "}
                  {getAvailableStreets.length}
                </h3>
                <div className="max-h-48 overflow-y-auto border rounded p-3 mb-4">
                  {getAvailableStreets.length > 0 ? (
                    getAvailableStreets.map((address) => (
                      <div
                        key={address.id}
                        className="flex items-center gap-2 mb-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStreets.includes(address.id)}
                          onChange={() => handleStreetSelection(address.id)}
                        />
                        <p>
                          {address.street}, {address.number} -{" "}
                          {address.neighborhood} - {address.city}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>No hay direcciones disponibles</p>
                  )}
                </div>

                <div className="mt-6 flex justify-center gap-4">
                  <button
                    className="bg-secondary text-white px-4 py-2 rounded"
                    onClick={() => {
                      setModalOpen(false);
                      setSelectedStreets([]);
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleRemoveStreets}
                    disabled={selectedStreets.length === 0}
                  >
                    Actualizar Tarjeta
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateCard;

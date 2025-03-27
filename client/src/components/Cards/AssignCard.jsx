import { useSelector } from "react-redux";
import { useCallback, useEffect, useMemo, useState } from "react";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import {
  FaTableList,
  FaUserGroup,
  FaUserCheck,
  FaUserXmark,
} from "react-icons/fa6";
import SelectCardComponent from "./../hooks/SelectCardComponent";
import {
  useCardReturn,
  useDesignateCard,
  useFetchCards,
} from "../../graphql/hooks/useCard";
import { useGetUsers } from "../../graphql/hooks/useUser";
import ComponentMaps from "../hooks/ComponentMaps";

function AssignCard() {
  const cards = useSelector((state) => state.cards.cardsData || []);
  const addresses = useSelector((state) => state.addresses.addressesData || []);
  const [usersNotAssigned, setUsersNotAssigned] = useState([]);
  const [usersAssigned, setUsersAssigned] = useState([]);
  const [cardAssigned, setCardAssigned] = useState([]);
  const [cardNotAssigned, setCardNotAssigned] = useState([]);
  const [cardColors, setCardColors] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { returnedCardInput } = useCardReturn();
  const { designateCardInput } = useDesignateCard();
  const [selectedCard, setSelectedCard] = useState([]);

  const { fetchUsers, users } = useGetUsers();
  const { fetchCards } = useFetchCards();

  useEffect(() => {
    fetchUsers();
    fetchCards();
  }, [fetchUsers, fetchCards]);

  useEffect(() => {
    const newCardAssigned = [];
    const newCardNotAssigned = [];
    const newUsersAssigned = [];
    const newUsersNotAssigned = [];

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
    setUsersAssigned(newUsersAssigned);
    setUsersNotAssigned(newUsersNotAssigned);
  }, [cards, users]);

  const addressMap = useMemo(
    () => new Map(addresses.map((a) => [a.id, a])),
    [addresses] // Apenas recalcula se `addresses` mudar
  );

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

  const handleSendCard = async () => {
    if (!selectedUser) return alert("Selecione um usuário!");

    await designateCardInput({
      variables: {
        assignCardInput: {
          cardIds: selectedCard.map((card) => card.id),
          userId: selectedUser.id,
        },
      },
    });

    setModalOpen(false);
    setSelectedCard([]);
  };
  const handleReturnCard = async () => {
    await returnedCardInput({
      variables: {
        returnCardInput: {
          cardId: selectedCard[0].id,
          userId: selectedCard[0].usersAssigned,
        },
      },
    });

    setModalOpen(false);
    setSelectedCard([]);
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
    <div className="min-h-screen bg-details p-3 md:p-10 flex flex-col justify-center  mb-[40px]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl"
      >
        <h1 className="text-3xl font-medium text-gray-700 mb-4">
          Asignar Tarjetas
        </h1>
        {cards.length > 0 && (
          <div className="flex justify-between mb-2">
            <p className="flex items-center gap-2">
              <FaTableList /> {cards.length}
            </p>
            <p className="flex items-center gap-2">
              <FaUserGroup /> {users.length}
            </p>
            <p className="flex items-center gap-2">
              <FaUserCheck /> {usersAssigned.length}
            </p>
            <p className="flex items-center gap-2">
              <FaUserXmark /> {usersNotAssigned.length}
            </p>
          </div>
        )}
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
          <div className="flex flex-col md:flex-row my-3 w-full">
            <div className="border-t border-stone-50 flex flex-col gap-4 md:w-2/3 border-r md:overflow-y-auto max-h-full">
              <h3 className="text-xl font-semibold">Tarjetas disponibles</h3>
              <p>Tarjetas selecionadas: {selectedCard?.length}</p>
              <button
                onClick={() => setModalOpen(true)}
                disabled={selectedCard.length === 0}
                className="bg-gradient-to-b from-stone-800 to-secondary text-white px-4 py-2 rounded hover:from-black hover:to-secondary  disabled:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                asignar tarjetas
              </button>

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

              <button
                onClick={() => handleReturnCard()}
                disabled={
                  !selectedCard[0]?.usersAssigned?.length ||
                  selectedCard.length !== 1
                }
                className="bg-gradient-to-b from-red-600 to-red-700 text-white px-4 py-2 rounded hover:from-red-400 hover:red-500  disabled:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                retornar tarjetas
              </button>
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
          <div className="bg-white rounded-lg p-6 max-w-lg min-w-80">
            <h2 className="text-xl font-bold mb-4">Detalhes do Cartão</h2>
            <div className="max-h-60 overflow-y-auto border rounded p-3 mb-4">
              {selectedCard.length > 0 ? (
                selectedCard.map((card) => (
                  <p key={card.id} className="text-lg font-medium">
                    Tarjeta: {card.number}
                  </p>
                ))
              ) : (
                <p>Nenhum cartão selecionado.</p>
              )}
            </div>
            <select
              onChange={(e) =>
                setSelectedUser(users.find((u) => u.id === e.target.value))
              }
              className="mt-4 w-full border rounded p-2"
            >
              <option value="">Selecione um usuário</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            <div className="mt-6 flex justify-end gap-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleSendCard}
                disabled={selectedCard.length === 0}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssignCard;

import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "framer-motion";
import { GET_CARDS } from "../../graphql/queries/cards.query";
import { GET_USERS } from "../../graphql/queries/user.query";
import { setCards } from "../../store/cardsSlice";
import Loading from "../../context/Loading";
import {
  DESIGNATED_CARD,
  RETURN_CARD,
} from "../../graphql/mutation/cards.mutation";
import { toast } from "react-toastify";
import {
  FaTableList,
  FaUserGroup,
  FaUserCheck,
  FaLocationDot,
  FaUserXmark,
} from "react-icons/fa6";
import SelectCardComponent from "../hooks/SelectCardComponent";

function AssignCard() {
  const dispatch = useDispatch();
  const cards = useSelector((state) => state.cards.cardsData.card || []);
  const addresses = useSelector((state) => state.addresses.addressesData || []);
  const user = useSelector((state) => state.user.userData);

  const [selectedCard, setSelectedCard] = useState([]);
  const [cardColors, setCardColors] = useState({});
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [usersNotAssigned, setUsersNotAssigned] = useState([]);
  const [usersAssigned, setUsersAssigned] = useState([]);
  const [cardAssigned, setCardAssigned] = useState([]);
  const [cardNotAssigned, setCardNotAssigned] = useState([]);

  const [fetchCards, { loading: cardsLoading, error: cardsError }] =
    useLazyQuery(GET_CARDS, {
      variables: { action: "get" },
      fetchPolicy: "network-only",
      onCompleted: (data) => {
        if (data?.card) {
          dispatch(setCards({ cards: data.card }));
        }
      },
    });

  const [fetchUsers, { data: usersData }] = useLazyQuery(GET_USERS, {
    variables: { group: user.group },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    fetchCards(); // Chama a query apenas na montagem do componente
    fetchUsers();
  }, [fetchCards, fetchUsers]);

  const users = useMemo(() => usersData?.getUsers?.users || [], [usersData]);
  const addressMap = useMemo(
    () => new Map(addresses.map((a) => [a.id, a])),
    [addresses]
  );

  useEffect(() => {
    setUsersNotAssigned(users.filter((user) => user.myCards.length === 0));
    setUsersAssigned(users.filter((user) => user.myCards.length > 0));
    setCardAssigned(cards.filter((card) => card.startDate !== null));
    setCardNotAssigned(cards.filter((card) => card.startDate === null));
  }, [users, cards]);

  const [designateCardInput] = useMutation(DESIGNATED_CARD, {
    onCompleted: async (data) => {
      toast.success(data.cardMutation.message);
      setModalOpen(false);
      setSelectedCard([]);
      await fetchCards();
    },
    onError: (error) => toast.error(`Erro: ${error.message}`),
  });

  const [returnedCardInput] = useMutation(RETURN_CARD, {
    onCompleted: async (data) => {
      console.log("Cartão retornado: ", data);
      toast.success(data.cardMutation.message);
      setModalOpen(false);
      setSelectedCard([]);
      await fetchCards();
    },
    onError: (error) => {
      console.log(`Erro de retorno:, ${error}`);
      toast.error(`Erro: ${error.message}`);
    },
  });

  const getCustomIcon = (cardId, number) => {
    return new L.DivIcon({
      className: "custom-marker",
      html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center">
      <svg
      fill="${cardColors[cardId]}"
      xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="25px"
            height="42px"
          >
            <path  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
          </svg>
          <span style="position: absolute; top: 10%; transform: translateY(-50%); font-size: 20px; font-weight: bold; color: black; text-align: center;">
            ${number}
          </span>
        </div>
      `,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
    });
  };

  const handleSelectCard = useCallback((cardId, number) => {
    setSelectedCard((prev) =>
      prev.some((card) => card.id === cardId)
        ? prev.filter((card) => card.id !== cardId)
        : [...prev, { id: cardId, number }]
    );
  }, []);

  const handleSendCard = async () => {
    if (!selectedUser) return alert("Selecione um usuário!");
    await designateCardInput({
      variables: {
        action: "designateCard",
        designateCardInput: {
          cardId: selectedCard.map((card) => card.id),
          userId: selectedUser.id,
        },
      },
    });
  };

  const handleReturnCard = async () => {
    await returnedCardInput({
      variables: {
        action: "returnCard",
        designateCardInput: {
          cardId: "",
          userId: "",
        },
      },
    });
  };

  useEffect(() => {
    if (cards.length && addresses.length) {
      const firstCard = cards[0];
      if (firstCard?.street.length > 0) {
        const firstAddress = addressMap.get(firstCard.street[0]);
        if (firstAddress?.gps) {
          const [lat, lng] = firstAddress.gps.split(", ").map(Number);
          setMapCenter([lat, lng]);
        }
      }

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

  const displayedMarkers = useMemo(() => {
    return cards.flatMap((card) =>
      card.street.map((addressId) => {
        const address = addressMap.get(addressId);
        if (!address?.gps) return null;
        const [lat, lng] = address.gps.split(", ").map(Number);
        return (
          <Marker
            key={`${card.id}-${address.id}`}
            position={[lat, lng]}
            icon={getCustomIcon(card.id, card.number)}
            eventHandlers={{
              click: () => handleSelectCard(card.id, card.number), // Passando apenas ID e número
            }}
          >
            <Popup>
              <div>
                <p>
                  Tarjeta:{" "}
                  <span style={{ color: cardColors[card.id] }}>
                    {card.number}
                  </span>
                </p>
                <p>
                  Dirección:{" "}
                  <strong>
                    {address.street}, {address.number}
                  </strong>
                </p>
                <p>Barrio: {address.city}</p>
              </div>
            </Popup>
          </Marker>
        );
      })
    );
  }, [cards, addressMap, cardColors, handleSelectCard]); // Dependências corrigidas

  if (cardsLoading) return <Loading text="Carregando dados dos cartões..." />;
  if (cardsError) return <p>Erro ao carregar cartões: {cardsError.message}</p>;

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
        {cards && (
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
          <MapContainer
            center={mapCenter}
            zoom={14}
            className="h-64 w-full  z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {displayedMarkers}
          </MapContainer>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row my-3 w-full">
            <div className="border-t border-stone-50 flex flex-col gap-4 md:w-2/3 border-r md:overflow-y-auto max-h-full">
              <h3 className="text-xl font-semibold">Tarjetas disponibles</h3>
              <div className="w-full flex justify-between items-center"></div>
              <p>Tarjetas selecionadas: {selectedCard?.length}</p>
              <button
                onClick={() => setModalOpen(true)}
                disabled={selectedCard.length === 0}
                className="bg-gradient-to-b from-stone-800 to-secondary text-white px-4 py-2 rounded hover:from-black hover:to-secondary  disabled:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                asignar tarjetas
              </button>
              <SelectCardComponent
                cardItem={cardNotAssigned}
                handleSelectCard={handleSelectCard}
                addresses={addresses}
                users={users}
                setSelectedCard={setSelectedCard}
                selectedCard={selectedCard}
                cardColors={cardColors}
              />
            </div>
            <div className="border-t border-t-stone-800 flex flex-col gap-4 md:w-2/3 md:overflow-y-auto max-h-full mt-5">
              <h3 className="text-xl font-semibold mt-3">Tarjetas en uso.</h3>

              <SelectCardComponent
                cardItem={cardAssigned}
                handleSelectCard={handleSelectCard}
                addresses={addresses}
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

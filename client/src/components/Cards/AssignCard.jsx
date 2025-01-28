import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "framer-motion";
import { GET_CARDS } from "../../graphql/queries/cards.query";
import { GET_USERS } from "../../graphql/queries/user.query";
import { setCards } from "../../store/cardsSlice";
import Loading from "../../context/Loading";
import { DESIGNATED_CARD } from "../../graphql/mutation/cards.mutation";
import { toast } from "react-toastify";

function AssignCard() {
  const cards = useSelector((state) => state.cards.cardsData.card || []);
  const addresses = useSelector((state) => state.addresses.addressesData || []);
  const user = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();

  const [selectedCard, setSelectedCard] = useState(null);
  const [cardColors, setCardColors] = useState({});
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { loading: cardsLoading, error: cardsError } = useQuery(GET_CARDS, {
    variables: { action: "get" },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data?.card) {
        dispatch(setCards({ cards: data.card }));
      }
    },
  });

  const { data: usersData } = useQuery(GET_USERS, {
    variables: { group: user.group },
  });

  const users = usersData?.getUsers.users;

  const [designateCardInput, { data }] = useMutation(DESIGNATED_CARD, {
    onCompleted: (data) => {
      toast.success(data.designatedCardMutation.message);
      // setLoading(false);
      setModalOpen(false);
      setSelectedCard(null);
    },
    onError: (error) => {
      toast.error(`Error al designar la tarjeta: ${error.message}`);
      // setLoading(false);
    },
  });

  const addressMap = useMemo(
    () => new Map(addresses.map((address) => [address.id, address])),
    [addresses]
  );

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

      const colors = cards.reduce((acc, card) => {
        acc[card.id] = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        return acc;
      }, {});
      setCardColors(colors);
    }
  }, [cards, addressMap]);

  const getCustomIcon = (cardId, number) => {
    return new L.DivIcon({
      className: "custom-marker",
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center;">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="${cardColors[cardId]}"
            width="30px"
            height="42px"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
          </svg>
          <span style="position: absolute; top: 50%; transform: translateY(-50%); font-size: 12px; font-weight: bold; color: white; text-align: center;">
            ${number}
          </span>
        </div>
      `,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
    });
  };

  const handleSelectCard = (cardId) => {
    const selecionado = cards.find((a) => a.id === cardId);
    setSelectedCard((prev) => (prev === cardId ? null : selecionado));
    setModalOpen(true);
  };

  const handleSendCard = async () => {
    if (!selectedUser) return alert("Selecione um usuário!");
    try {
      await designateCardInput({
        variables: {
          action: "designateCard",
          designateCardInput: {
            cardId: selectedCard.id,
            userId: selectedUser.id,
          },
        },
      });
    } catch (error) {
      toast.error(`Error ao designar a tarjeta: ${error.message}`);
    }
    console.log(
      `Card ${selectedCard.number} enviado para o usuário ${selectedUser.name}`
    );
    setModalOpen(false);
  };

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
              click: () => handleSelectCard(card.number),
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
  }, [cards, addressMap, cardColors]);

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
        <h1 className="text-3xl font-medium text-gray-700 mb-6">
          Asignar Tarjetas
        </h1>
        {cards && (
          <div>
            <p>
              Atualmente há{" "}
              <strong className="text-secondary">{cards.length}</strong> cartões
              disponíveis.
            </p>
            <p>
              Temos <strong className="text-secondary">{users?.length}</strong>{" "}
              usuários registrados.
            </p>
          </div>
        )}
        <div className="flex-grow h-full z-0">
          <MapContainer
            center={mapCenter}
            zoom={14}
            className="h-full w-full min-h-[400px] z-0"
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
          <h2 className="p-4 text-xl font-semibold mb-4 text-[#151614]">
            Lista de Cartões
          </h2>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card) => (
              <motion.li
                key={card.id}
                onClick={() => handleSelectCard(card.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className={`p-4  border-2 shadow-lg cursor-pointer ${
                  selectedCard === card.id
                    ? "bg-opacity-80 text-white"
                    : "text-black"
                }`}
                style={{
                  border: `4px solid ${cardColors[card.id]}`,
                  backgroundColor:
                    selectedCard === card.id
                      ? cardColors[card.id]
                      : "transparent",
                }}
              >
                <p>
                  <strong>Tarjeta:</strong> {card.number}
                </p>
                <p>Direcciones: {card.street.length}</p>
                {card.street.map((addressId, index) => {
                  const matchedAddress = addressMap.get(addressId);

                  return matchedAddress ? (
                    <p key={addressId}>
                      {index + 1} - {matchedAddress.street},{" "}
                      {matchedAddress.number}
                    </p>
                  ) : null;
                })}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Detalhes do Cartão</h2>
            <p>Tarjeta número: {selectedCard?.number}</p>
            <p>Direcciones: {selectedCard?.street.length}</p>
            <p>Nome da rua: {selectedCard?.street.join(", ")}</p>
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

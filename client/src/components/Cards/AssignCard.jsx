import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { GET_CARDS } from "../../graphql/queries/cards.query";
import { GET_USERS } from "../../graphql/queries/user.query";
import { setCards } from "../../store/cardsSlice";
import Loading from "../../context/Loading";
import { DESIGNATED_CARD } from "../../graphql/mutation/cards.mutation";
import { toast } from "react-toastify";

function AssignCard() {
  const dispatch = useDispatch();
  const cards = useSelector((state) => state.cards.cardsData.card || []);
  const addresses = useSelector(
    (state) => state.addresses.addressesData || [],
    (a, b) => JSON.stringify(a) === JSON.stringify(b)
  );
  const user = useSelector((state) => state.user.userData);

  const [selectedCard, setSelectedCard] = useState(null);
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { loading: cardsLoading, error: cardsError } = useQuery(GET_CARDS, {
    variables: { action: "get" },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data?.card) dispatch(setCards({ cards: data.card }));
    },
  });

  const { data: usersData } = useQuery(GET_USERS, {
    variables: { group: user?.group },
  });
  const users = useMemo(() => usersData?.getUsers?.users || [], [usersData]);

  const [designateCardInput] = useMutation(DESIGNATED_CARD, {
    onCompleted: (data) => {
      toast.success(data.designatedCardMutation.message);
      setModalOpen(false);
      setSelectedCard(null);
    },
    onError: (error) =>
      toast.error(`Erro ao designar o cartão: ${error.message}`),
  });

  useEffect(() => {
    if (cards.length && addresses.length) {
      const firstAddress = addresses.find(
        (address) => address.id === cards[0]?.street[0]
      );
      if (firstAddress?.gps) {
        setMapCenter(firstAddress.gps.split(", ").map(Number));
      }
    }
  }, [cards, addresses]);

  const getCustomIcon = (number) =>
    new L.DivIcon({
      className: "custom-marker",
      html: `<div class="marker-icon">${number}</div>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
    });

  const displayedMarkers = useMemo(
    () =>
      cards
        .flatMap((card) =>
          card.street.map((addressId) => {
            const address = addresses.find((addr) => addr.id === addressId);
            if (!address?.gps) return null;
            return (
              <Marker
                key={`${card.id}-${address.id}`}
                position={address.gps.split(", ").map(Number)}
                icon={getCustomIcon(card.number)}
                eventHandlers={{ click: () => handleSelectCard(card) }}
              >
                <Popup>
                  <p>Tarjeta: {card.number}</p>
                  <p>
                    Direção: {address.street}, {address.number}
                  </p>
                  <p>Bairro: {address.city}</p>
                </Popup>
              </Marker>
            );
          })
        )
        .filter(Boolean),
    [cards, addresses]
  );

  const handleSelectCard = (card) => {
    setSelectedCard(card);
    setModalOpen(true);
  };

  const handleSendCard = async () => {
    if (!selectedUser) return alert("Selecione um usuário!");
    await designateCardInput({
      variables: {
        action: "designateCard",
        designateCardInput: {
          cardId: selectedCard.id,
          userId: selectedUser.id,
        },
      },
    });
  };

  if (cardsLoading) return <Loading text="Carregando dados dos cartões..." />;
  if (cardsError) return <p>Erro ao carregar cartões: {cardsError.message}</p>;

  return (
    <div>
      <MapContainer
        center={mapCenter}
        zoom={14}
        className="h-full w-full min-h-[400px]"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {displayedMarkers}
      </MapContainer>
      {isModalOpen && (
        <div>
          <h2>Detalhes do Cartão</h2>
          <select
            onChange={(e) =>
              setSelectedUser(users.find((u) => u.id === e.target.value))
            }
          >
            <option value="">Selecione um usuário</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <button onClick={handleSendCard}>Enviar</button>
        </div>
      )}
    </div>
  );
}

export default AssignCard;

import { useQuery } from "@apollo/client";
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

function AssignCard() {
  const cards = useSelector((state) => state.cards.cardsData.card || []);
  const addresses = useSelector((state) => state.addresses.addressesData || []);
  const user = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();

  const [selectedCard, setSelectedCard] = useState(null);
  const [cardColors, setCardColors] = useState({});
  const [mapCenter, setMapCenter] = useState([0, 0]);

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
          <span style="
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            font-size: 12px;
            font-weight: bold;
            color: white;
            text-align: center;
          ">
            ${number}
          </span>
        </div>
      `,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
    });
  };

  const handleSelectCard = (cardId) => {
    setSelectedCard((prev) => (prev === cardId ? null : cardId));
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
            eventHandlers={{ click: () => handleSelectCard(card.id) }}
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
    <div className="flex flex-col w-full h-full bg-[#f7f7f7] md:ml-[170px] lg:ml-[250px] mb-[70px]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-5 px-4 pt-3"
      >
        <h1 className="text-2xl md:text-4xl font-medium text-[#151614]">
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
              Temos <strong className="text-secondary]">{users?.length}</strong>{" "}
              usuários registrados.
            </p>
          </div>
        )}
      </motion.div>
      <div className="flex-grow h-full">
        <MapContainer
          center={mapCenter}
          zoom={14}
          className="h-full w-full min-h-[400px]"
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
        className="bg-[#f7f7f7] p-4"
      >
        <h2 className="text-xl font-semibold mb-4 text-[#151614]">
          Lista de Cartões
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {cards.map((card) => (
            <motion.li
              key={card.id}
              onClick={() => handleSelectCard(card.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className={`p-4 border rounded-lg cursor-pointer shadow-2xl ${
                selectedCard === card.id
                  ? "border-[#facc15] "
                  : "border-gray-300"
              }`}
              style={{
                backgroundColor:
                  selectedCard === card.id ? "#fff" : cardColors[card.id],
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
    </div>
  );
}

export default AssignCard;

// import { useQuery } from "@apollo/client";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import { GET_CARDS } from "../../graphql/queries/cards.query";
// import { GET_USERS } from "../../graphql/queries/user.query";
// import { setCards } from "../../store/cardsSlice";
// import Loading from "../../context/Loading";

// function AssignCard() {
//   const cards = useSelector((state) => state.cards.cardsData.card || []);
//   const addresses = useSelector((state) => state.addresses.addressesData || {});
//   const user = useSelector((state) => state.user.userData);
//   const dispatch = useDispatch();

//   console.log(addresses);

//   const [selectedCard, setSelectedCard] = useState(null);
//   const [cardColors, setCardColors] = useState({});
//   const [mapCenter, setMapCenter] = useState([0, 0]); // Default location

//   const {
//     loading: cardsLoading,
//     error: cardsError,
//     data: cardsData,
//   } = useQuery(GET_CARDS, {
//     variables: { action: "get" },
//     fetchPolicy: "network-only",
//     onCompleted: (data) => {
//       if (data && data?.card) {
//         dispatch(setCards({ cards: data.card }));
//       }
//     },
//   });

//   const {
//     loading: usersLoading,
//     error: usersError,
//     data: usersData,
//   } = useQuery(GET_USERS, {
//     variables: { group: user.group },
//   });

//   const users = usersData?.getUsers.users;
//   console.log(users);

//   useEffect(() => {
//     if (cards.length && addresses.length) {
//       const firstCard = cards[0]; // Obtém o primeiro card
//       if (firstCard && firstCard.street.length > 0) {
//         const firstAddress = addresses.find(
//           (address) => address.id === firstCard.street[0]
//         );
//         if (firstAddress && firstAddress.gps) {
//           const [lat, lng] = firstAddress.gps.split(", ").map(Number);
//           setMapCenter([lat, lng]); // Centraliza o mapa no primeiro endereço
//         }
//       }

//       const colors = {};
//       cards.forEach((card) => {
//         colors[card.id] = `#${Math.floor(Math.random() * 16777215).toString(
//           16
//         )}`;
//       });
//       setCardColors(colors);
//     }
//   }, [cards, addresses]);

//   const getCustomIcon = (cardId, number) => {
//     return new L.DivIcon({
//       className: "custom-marker",
//       html: `
//         <div style="position: relative; display: flex; align-items: center; justify-content: center;">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 24 24"
//             fill="${cardColors[cardId]}"
//             width="30px"
//             height="42px"
//           >
//             <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
//           </svg>
//           <span style="
//             position: absolute;
//             top: 50%;
//             transform: translateY(-50%);
//             font-size: 12px;
//             font-weight: bold;
//             color: white;
//             text-align: center;
//           ">
//             ${number}
//           </span>
//         </div>
//       `,
//       iconSize: [30, 42],
//       iconAnchor: [15, 42],
//     });
//   };

//   const handleSelectCard = (cardId) => {
//     setSelectedCard(cardId === selectedCard ? null : cardId);
//   };

//   const addressMap = addresses.reduce((map, address) => {
//     map[address.id] = address;
//     return map;
//   }, {});

//   const displayedMarkers = cards.flatMap((card) =>
//     card.street
//       .map((addressId) => {
//         const address = addressMap[addressId];
//         if (!address || !address.gps) return null;

//         const [lat, lng] = address.gps.split(", ").map(Number);
//         return (
//           <Marker
//             key={`${card.id}-${address.id}`}
//             position={[lat, lng]}
//             icon={getCustomIcon(card.id, card.number)}
//             eventHandlers={{
//               click: () => handleSelectCard(card.id),
//             }}
//           >
//             <Popup>
//               <div>
//                 <p>
//                   <strong>{address.street}</strong>
//                 </p>
//                 <p>
//                   {address.city},{" "}
//                   {address.confirmed ? "Confirmado" : "Não Confirmado"}
//                 </p>

//                 <p>
//                   Card:{" "}
//                   <span style={{ color: cardColors[card.id] }}>{card.id}</span>
//                 </p>
//               </div>
//             </Popup>
//           </Marker>
//         );
//       })
//       .filter(Boolean)
//   );

//   if (cardsLoading) return <Loading text="Carregando dados dos cartões..." />;
//   if (cardsError) return <p>Erro ao carregar cartões: {cardsError.message}</p>;

//   console.log(cards);

//   return (
//     <div className="flex flex-col w-full h-full text-start text-base md:text-lg">
//       <div className="space-y-5 px-4 pt-3">
//         <h1 className="text-2xl md:text-4xl font-medium">Asignar Tarjetas</h1>
//         {cards && (
//           <div>
//             <p>
//               Actualmente hay{" "}
//               <span className="font-semibold">{cards.length}</span> tarjetas
//               disponibles.
//             </p>
//             <p>
//               Tenemos <span className="font-semibold">{users?.length}</span>{" "}
//               usuarios registrados.
//             </p>
//           </div>
//         )}
//       </div>
//       <div className="flex-grow h-full">
//         <MapContainer
//           center={mapCenter}
//           zoom={14}
//           className="h-full w-full min-h-[400px] max-h-[100%]"
//         >
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           />
//           {displayedMarkers}
//         </MapContainer>
//       </div>
//       <div className="bg-gray-100 p-4">
//         <h2 className="text-xl font-semibold mb-4">Lista de Cards</h2>
//         <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {cards.map((card) => (
//             <li
//               key={card.id}
//               onClick={() => handleSelectCard(card.id)}
//               className={`p-4 border rounded cursor-pointer ${
//                 selectedCard === card.id ? "border-blue-500" : "border-gray-300"
//               }`}
//               style={{
//                 backgroundColor:
//                   selectedCard === card.id ? cardColors[card.id] : "white",
//               }}
//             >
//               <p>
//                 <strong>Tarjeta:</strong> {card.number}
//               </p>
//               <p>Direcciones:</p>
//               {card.street.map((addressId) => {
//                 const matchedAddress = addresses.find(
//                   (address) => address.id === addressId
//                 );
//                 if (matchedAddress) {
//                   return (
//                     <p key={addressId}>
//                       {matchedAddress.street}, {matchedAddress.number}
//                     </p>
//                   );
//                 }
//                 return null; // Retorna null caso não encontre correspondência
//               })}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default AssignCard;

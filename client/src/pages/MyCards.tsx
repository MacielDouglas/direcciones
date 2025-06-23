import { useSelector } from "react-redux";
import { useMutation } from "@apollo/client";
import { useContext, useEffect, useMemo, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Map, { Marker } from "react-map-gl/mapbox";

import { selectUserId } from "../store/selectors/userSelectors";
import { selectAllMyCard } from "../store/selectors/myCardSelectos";
import { formatDate } from "../constants/address";
import {
  Bed,
  CalendarDays,
  Dock,
  Home,
  Hotel,
  Store,
  Utensils,
  X,
} from "lucide-react";
import PhotoAddress from "./Address/components/PhotoAddress";
import { ThemeContext } from "../context/ThemeContext";
import { RETURN_CARD } from "../graphql/mutations/cards.mutation";
import toast from "react-hot-toast";
import ButtonEditAddress from "./Address/components/buttons/ButtonEditAddress";
import DisableAddressButton from "./Address/components/buttons/DisableAddressButton";
import { useFetchMyCards } from "../graphql/hooks/useCards";

const addressIcons = {
  house: <Home size={24} />,
  department: <Hotel size={24} />,
  store: <Store size={24} />,
  hotel: <Bed size={24} />,
  restaurant: <Utensils size={24} />,
} as const;

const markerColors = [
  "#000",
  "#FF5733",
  "#28A745",
  "#FFC107",
  "#6F42C1",
  "#17A2B8",
  "#E91E63",
];

const MyCards = () => {
  const { darkMode = false } = useContext(ThemeContext) || {};
  const userId = useSelector(selectUserId);
  const myCards = useSelector(selectAllMyCard);

  const { fetchMyCards, loading } = useFetchMyCards();
  type Address = {
    id: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    complement?: string;
    confirmed: boolean;
    active?: boolean;
    gps?: string;
    photo: string;
    customName?: string;
    type: keyof typeof addressIcons;
  };

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectCard, setSelectCard] = useState({ cardId: "", cardNumber: "" });
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  const mapboxToken = import.meta.env.VITE_FIREBASE_MAP_BOX;
  const mapboxStyle = darkMode
    ? import.meta.env.VITE_FIREBASE_MAP_BOX_STYLE_DARK
    : import.meta.env.VITE_FIREBASE_MAP_BOX_STYLE;

  const [returnCardMutation] = useMutation(RETURN_CARD, {
    onCompleted: (data) => {
      toast.success(data.returnCard.message);
      fetchMyCards({ variables: { myCardsId: userId } });
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  useEffect(() => {
    if (userId) fetchMyCards({ variables: { myCardsId: userId } });
  }, [userId, fetchMyCards]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.error("Erro ao obter localização:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  const allPoints = useMemo(() => {
    const points: [number, number][] = [];
    myCards.forEach((card) => {
      card.street.forEach((address) => {
        if (address.gps) {
          const [lat, lng] = address.gps.split(",").map(Number);
          if (!isNaN(lat) && !isNaN(lng)) points.push([lat, lng]);
        }
      });
    });
    if (userLocation) points.push(userLocation);
    return points;
  }, [myCards, userLocation]);

  const viewport = useMemo(() => {
    if (allPoints.length === 0)
      return { latitude: -15.7801, longitude: -47.9292, zoom: 4 };
    const lat =
      allPoints.reduce((sum, [lat]) => sum + lat, 0) / allPoints.length;
    const lng =
      allPoints.reduce((sum, [, lng]) => sum + lng, 0) / allPoints.length;
    return {
      latitude: lat,
      longitude: lng,
      zoom: allPoints.length === 1 ? 16 : 13,
    };
  }, [allPoints]);

  const handleReturnCard = async () => {
    await returnCardMutation({
      variables: {
        returnCardInput: {
          cardId: selectCard.cardId,
          userId,
        },
      },
    });
    setIsModalOpen(false);
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <section className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-6 shadow max-w-2xl mx-auto">
        <h1 className="text-4xl font-semibold">Tarjetas</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-lg">
          En esta página puedes ver tus tarjetas asignadas.
        </p>
      </section>

      {loading ? (
        <p className="text-center text-zinc-500 text-lg">Cargando...</p>
      ) : myCards.length === 0 ? (
        <section className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-2xl shadow text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold">Sem cartões atribuídos</h2>
          <DotLottieReact
            src="https://lottie.host/0d984c5c-1e60-4e76-ac35-809c50de63bc/K7IH6AzhPu.lottie"
            loop
            autoplay
          />
        </section>
      ) : (
        <>
          <div className="rounded-xl overflow-hidden max-w-2xl mx-auto">
            <Map
              mapboxAccessToken={mapboxToken}
              initialViewState={viewport}
              style={{ width: "100%", height: 300 }}
              mapStyle={mapboxStyle}
            >
              {userLocation && (
                <Marker
                  latitude={userLocation[0]}
                  longitude={userLocation[1]}
                  color="blue"
                  anchor="bottom"
                />
              )}
              {myCards.map((card, idx) =>
                card.street.map((address) => {
                  if (!address.gps) return null;
                  const [lat, lng] = address.gps.split(",").map(Number);
                  if (isNaN(lat) || isNaN(lng)) return null;
                  return (
                    <Marker
                      key={`${card.id}-${address.id}`}
                      latitude={lat}
                      longitude={lng}
                      color={markerColors[idx % markerColors.length]}
                      anchor="bottom"
                    />
                  );
                })
              )}
            </Map>
          </div>

          <div className="space-y-6 max-w-2xl mx-auto">
            {myCards.map((card) => (
              <div
                key={card.id}
                className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl shadow p-4"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Dock /> Tarjeta: {card.number}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                    <CalendarDays /> Asignada en:{" "}
                    <strong>{formatDate(card.startDate)}</strong>
                  </p>
                  <button
                    className="bg-zinc-800 dark:bg-zinc-900 rounded-xl p-2 text-zinc-100 w-3/5 sm:w-auto hover:bg-zinc-800 transition"
                    onClick={() => {
                      setIsModalOpen(true);
                      setSelectCard({
                        cardId: card.id,
                        cardNumber: card.number,
                      });
                    }}
                  >
                    concluir tarjeta
                  </button>
                </div>

                <div className="space-y-4">
                  {card.street.map((address, i) => (
                    <button
                      key={address.id}
                      className={`w-full text-left bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 p-4 rounded-xl transition ${
                        !address.active && "!bg-orange-950 text-primary-lgt"
                      }`}
                      onClick={() =>
                        setSelectedAddress({
                          ...address,
                          photo: address.photo ?? "",
                        })
                      }
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span>{addressIcons[address.type]}</span>
                        <span className="text-sm font-medium">
                          Dirección {i + 1}
                        </span>
                      </div>
                      <p className="font-medium text-base">
                        {address.street}, {address.number}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {address.neighborhood} - {address.city}
                      </p>
                      {address.complement && (
                        <div className="mt-2 text-zinc-400 italic text-sm">
                          {address.complement}
                        </div>
                      )}
                      <p className="mt-2 text-center text-sm font-medium">
                        {address.confirmed ? (
                          <span className="text-blue-500">Confirmado</span>
                        ) : (
                          <span className="text-rose-500">
                            Necesita Confirmar
                          </span>
                        )}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedAddress && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div
            className={`bg-white dark:bg-zinc-900 rounded-2xl p-6 w-[90%] max-w-md shadow-xl relative ${
              !selectedAddress.active ? "!bg-orange-950 text-primary-lgt" : ""
            }`}
          >
            <button
              className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-800 dark:hover:text-white"
              onClick={() => setSelectedAddress(null)}
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              Detalle de la dirección
            </h2>

            <div className="rounded-2xl overflow-hidden space-y-2">
              <Map
                mapboxAccessToken={mapboxToken}
                initialViewState={{
                  longitude: Number(selectedAddress.gps?.split(",")[1]),
                  latitude: Number(selectedAddress.gps?.split(",")[0]),
                  zoom: 16,
                }}
                style={{ width: "100%", height: 250 }}
                mapStyle={mapboxStyle}
              >
                <Marker
                  longitude={Number(selectedAddress.gps?.split(",")[1])}
                  latitude={Number(selectedAddress.gps?.split(",")[0])}
                  color="black"
                  anchor="bottom"
                />
              </Map>
              <div className="flex items-center justify-between mt-4">
                <PhotoAddress
                  hei="h-20"
                  photo={selectedAddress.photo}
                  street={selectedAddress.street}
                />
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 text-white py-3 rounded-md text-sm shadow-md mt-2 w-3/5"
                >
                  Ver en el mapa
                </button>
              </div>
            </div>

            {selectedAddress.customName && (
              <p className="text-lg font-medium">
                {selectedAddress.customName}
              </p>
            )}
            <p className="text-base font-medium">
              {selectedAddress.street}, {selectedAddress.number}
            </p>
            <p className="text-sm text-zinc-500 mb-2">
              {selectedAddress.neighborhood} - {selectedAddress.city}
            </p>
            {selectedAddress.complement && (
              <div className="text-sm italic text-zinc-500">
                {selectedAddress.complement}
              </div>
            )}
            <p className="mt-4 text-lg text-center font-medium">
              {selectedAddress.confirmed ? (
                <span className="text-blue-500">Confirmado</span>
              ) : (
                <span className="text-rose-500">Necesita Confirmar</span>
              )}
            </p>
            <div className="w-full flex justify-between gap-4 mt-5">
              <ButtonEditAddress id={selectedAddress.id} />
              <DisableAddressButton id={selectedAddress.id} myCard={true} />
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-[90%] max-w-md shadow-xl relative text-xl">
            <h2>
              ¿Estás seguro de que deseas devolver la tarjeta:{" "}
              {selectCard.cardNumber}?
            </h2>
            <div className="mt-6 flex justify-end gap-4">
              <button
                className="bg-zinc-950 text-white px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleReturnCard}
              >
                Devolver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCards;

// import { useSelector } from "react-redux";
// import { useMutation } from "@apollo/client";
// import { useContext, useEffect, useMemo, useState } from "react";
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";
// import Map, { Marker } from "react-map-gl/mapbox";

// import { selectUserId } from "../store/selectors/userSelectors";
// import { selectAllMyCard } from "../store/selectors/myCardSelectos";

// import { formatDate } from "../constants/address";

// import {
//   Bed,
//   CalendarDays,
//   Dock,
//   Home,
//   Hotel,
//   Store,
//   Utensils,
//   X,
// } from "lucide-react";
// import PhotoAddress from "./Address/components/PhotoAddress";
// import { ThemeContext } from "../context/ThemeContext";
// import { RETURN_CARD } from "../graphql/mutations/cards.mutation";
// import toast from "react-hot-toast";
// import ButtonEditAddress from "./Address/components/buttons/ButtonEditAddress";
// import DisableAddressButton from "./Address/components/buttons/DisableAddressButton";
// import { useFetchMyCards } from "../graphql/hooks/useCards";

// const addressIcons = {
//   house: <Home size={24} />,
//   department: <Hotel size={24} />,
//   store: <Store size={24} />,
//   hotel: <Bed size={24} />,
//   restaurant: <Utensils size={24} />,
// } as const;

// const MyCards = () => {
//   const themeContext = useContext(ThemeContext);
//   const darkMode = themeContext?.darkMode || false;
//   const userId = useSelector(selectUserId);
//   const myCards = useSelector(selectAllMyCard);

//   const { fetchMyCards, loading } = useFetchMyCards();
//   const [selectedAddress, setSelectedAddress] = useState<any | null>(null);

//   useEffect(() => {
//     if (userId) fetchMyCards({ variables: { myCardsId: userId } });
//   }, [userId, fetchMyCards]);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectCard, setSelectCard] = useState({
//     cardId: "",
//     cardNumber: "",
//   });
//   const [userLocation, setUserLocation] = useState<[number, number] | null>(
//     null
//   );

//   const mapboxToken = import.meta.env.VITE_FIREBASE_MAP_BOX;
//   const mapboxStyle = import.meta.env.VITE_FIREBASE_MAP_BOX_STYLE;
//   const mapboxStyleDark = import.meta.env.VITE_FIREBASE_MAP_BOX_STYLE_DARK;

//   const markerColors = [
//     "#000",
//     "#FF5733",
//     "#28A745",
//     "#FFC107",
//     "#6F42C1",
//     "#17A2B8",
//     "#E91E63",
//   ];

//   const [returnedCardInput] = useMutation(RETURN_CARD, {
//     onCompleted: (data) => {
//       toast.success(data.returnCard.message);
//       fetchMyCards({ variables: { myCardsId: userId } });
//     },
//     onError: (error) => {
//       toast.error(`Erro: ${error.message}`);
//     },
//   });

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
//       (err) => console.error("Erro ao obter localização:", err),
//       { enableHighAccuracy: true }
//     );
//   }, []);

//   const allPoints = useMemo(() => {
//     const points: [number, number][] = [];

//     // card.map((cd) => {
//     //   console.log(cd.street.active);
//     // });

//     // myCards.street.forEach((card) => {
//     //   card.forEach((address) => {
//     //     if (address.gps) {
//     //       const [lat, lng] = address.gps.split(",").map(Number);
//     //       if (!isNaN(lat) && !isNaN(lng)) points.push([lat, lng]);
//     //     }
//     //   });
//     // });

//     if (userLocation) points.push(userLocation);
//     return points;
//   }, [myCards, userLocation]);

//   const viewport = useMemo(() => {
//     if (allPoints.length === 0)
//       return { latitude: -15.7801, longitude: -47.9292, zoom: 4 };

//     const lat =
//       allPoints.reduce((sum, [lat]) => sum + lat, 0) / allPoints.length;
//     const lng =
//       allPoints.reduce((sum, [, lng]) => sum + lng, 0) / allPoints.length;

//     return {
//       latitude: lat,
//       longitude: lng,
//       zoom: allPoints.length === 1 ? 16 : 13,
//     };
//   }, [allPoints]);

//   const handleReturnCard = async (cardIdReturn: string) => {
//     await returnedCardInput({
//       variables: {
//         returnCardInput: {
//           cardId: cardIdReturn,
//           userId: userId,
//         },
//       },
//     });
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="px-4 py-6 space-y-6">
//       {/* HEADER */}
//       <section className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-6 shadow max-w-2xl mx-auto">
//         <h1 className="text-4xl font-semibold">Tarjetas</h1>
//         <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-lg">
//           En esta página puedes ver tus tarjetas asignadas.
//         </p>
//       </section>

//       {/* LOADING OU SEM CARDS */}
//       {loading ? (
//         <p className="text-center text-zinc-500 text-lg">Cargando...</p>
//       ) : myCards.length === 0 ? (
//         <section className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-2xl shadow text-center max-w-2xl mx-auto">
//           <h2 className="text-2xl font-semibold">Sem cartões atribuídos</h2>
//           <DotLottieReact
//             src="https://lottie.host/0d984c5c-1e60-4e76-ac35-809c50de63bc/K7IH6AzhPu.lottie"
//             loop
//             autoplay
//           />
//         </section>
//       ) : (
//         <>
//           {/* MAPA */}
//           <div className="rounded-xl overflow-hidden max-w-2xl mx-auto">
//             <Map
//               mapboxAccessToken={mapboxToken}
//               initialViewState={viewport}
//               style={{ width: "100%", height: 300 }}
//               mapStyle={darkMode ? mapboxStyleDark : mapboxStyle}
//             >
//               {userLocation && (
//                 <Marker
//                   latitude={userLocation[0]}
//                   longitude={userLocation[1]}
//                   color="blue"
//                   anchor="bottom"
//                 />
//               )}
//               {myCards.map((card, idx) =>
//                 card.street.map((address) => {
//                   if (!address.gps) return null;
//                   const [lat, lng] = address.gps.split(",").map(Number);
//                   if (isNaN(lat) || isNaN(lng)) return null;

//                   return (
//                     <Marker
//                       key={`${card.id}-${address.id}`}
//                       latitude={lat}
//                       longitude={lng}
//                       color={markerColors[idx % markerColors.length]}
//                       anchor="bottom"
//                     />
//                   );
//                 })
//               )}
//             </Map>
//           </div>

//           {/* LISTAGEM DE CARDS */}
//           <div className="space-y-6 max-w-2xl mx-auto">
//             {myCards.map((card) => (
//               <div
//                 key={card.id}
//                 className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl shadow p-4"
//               >
//                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
//                   <h3 className="text-xl font-semibold flex items-center gap-2">
//                     <Dock /> Tarjeta: {card.number}
//                   </h3>
//                   <p className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
//                     <CalendarDays /> Asignada en:{" "}
//                     <strong>{formatDate(card.startDate)}</strong>
//                   </p>
//                   <button
//                     className="bg-zinc-800 dark:bg-zinc-900 rounded-xl p-2 text-zinc-100 w-3/5 sm:w-auto hover:bg-zinc-800 transition cursor-pointer"
//                     onClick={() => {
//                       setIsModalOpen(true);
//                       setSelectCard({
//                         cardId: card.id,
//                         cardNumber: card.number,
//                       });
//                     }}
//                   >
//                     concluir tarjeta
//                   </button>
//                 </div>

//                 <div className="space-y-4">
//                   {card.street.map((address, i) => (
//                     <button
//                       key={address.id}
//                       className="w-full text-left bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 p-4 rounded-xl transition"
//                       onClick={() => setSelectedAddress(address)}
//                     >
//                       <div className="flex justify-between items-center mb-2">
//                         <span>{addressIcons[address.type]}</span>
//                         <span className="text-sm font-medium">
//                           Dirección {i + 1}
//                         </span>
//                       </div>
//                       <p className="font-medium text-base">
//                         {address.street}, {address.number}
//                       </p>
//                       <p className="text-sm text-zinc-600 dark:text-zinc-400">
//                         {address.neighborhood} - {address.city}
//                       </p>
//                       {address.complement && (
//                         <div className="mt-2 text-zinc-400 italic text-sm">
//                           {address.complement}
//                         </div>
//                       )}
//                       <p className="mt-2 text-center text-sm font-medium">
//                         {address.confirmed ? (
//                           <span className="text-blue-500">Confirmado</span>
//                         ) : (
//                           <span className="text-rose-500">
//                             Necesita Confirmar
//                           </span>
//                         )}
//                       </p>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {/* MODAL DE DETALHES DO ENDEREÇO */}
//       {selectedAddress && (
//         <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
//           <div
//             className={`bg-white dark:bg-zinc-900 rounded-2xl p-6 w-[90%] max-w-md shadow-xl relative ${
//               !selectedAddress.active && "!bg-orange-950 text-primary-lgt"
//             }`}
//           >
//             <button
//               className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-800 dark:hover:text-white"
//               onClick={() => setSelectedAddress(null)}
//             >
//               <X size={24} />
//             </button>
//             <h2 className="text-xl font-semibold mb-4">
//               Detalle de la dirección
//             </h2>
//             <div className="rounded-2xl overflow-hidden space-y-2">
//               <Map
//                 mapboxAccessToken={mapboxToken}
//                 initialViewState={{
//                   longitude: Number(selectedAddress.gps?.split(",")[1]),
//                   latitude: Number(selectedAddress.gps?.split(",")[0]),
//                   zoom: 16,
//                 }}
//                 style={{ width: "100%", height: 250 }}
//                 mapStyle={mapboxStyle}
//               >
//                 <Marker
//                   longitude={Number(selectedAddress.gps?.split(",")[1])}
//                   latitude={Number(selectedAddress.gps?.split(",")[0])}
//                   color="black"
//                   anchor="bottom"
//                 />
//               </Map>
//               <div className="flex items-center justify-between mt-4">
//                 <PhotoAddress
//                   hei="h-20"
//                   photo={selectedAddress.photo}
//                   street={selectedAddress.street}
//                 />
//                 <button
//                   onClick={() => setIsModalOpen(true)}
//                   className="bg-blue-600 text-white py-3 rounded-md text-sm shadow-md mt-2 w-3/5"
//                 >
//                   Ver en el mapa
//                 </button>
//               </div>
//             </div>
//             {selectedAddress.customName && (
//               <p className="text-lg font-medium">
//                 {selectedAddress.customName}
//               </p>
//             )}

//             <p className="text-base font-medium">
//               {selectedAddress.street}, {selectedAddress.number}
//             </p>
//             <p className="text-sm text-zinc-500 mb-2">
//               {selectedAddress.neighborhood} - {selectedAddress.city}
//             </p>
//             {selectedAddress.complement && (
//               <div className="text-sm italic text-zinc-500">
//                 {selectedAddress.complement}
//               </div>
//             )}
//             <p className="mt-4 text-lg text-center font-medium">
//               {selectedAddress.confirmed ? (
//                 <span className="text-blue-500">Confirmado</span>
//               ) : (
//                 <span className="text-rose-500">Necesita Confirmar</span>
//               )}
//             </p>
//             <div className="w-full inline-flex items-center justify-between gap-4 mt-5">
//               <ButtonEditAddress id={selectedAddress.id} />
//               <DisableAddressButton id={selectedAddress.id} myCard={true} />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* MODAL CONFIRMA DEVOLUÇÃO */}
//       {isModalOpen && (
//         <div className="fixed top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-[90%] max-w-md shadow-xl relative text-xl">
//             <h2>
//               ¿Estás seguro de que deseas devolver la tarjeta:{" "}
//               {selectCard.cardNumber}?
//             </h2>
//             <div className="mt-6 flex justify-end gap-4">
//               <button
//                 className="bg-zinc-950 text-white px-4 py-2 rounded"
//                 onClick={() => setIsModalOpen(false)}
//               >
//                 Cancelar
//               </button>
//               <button
//                 className="bg-red-500 text-white px-4 py-2 rounded"
//                 onClick={() => handleReturnCard(selectCard.cardId)}
//               >
//                 Devolver
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyCards;

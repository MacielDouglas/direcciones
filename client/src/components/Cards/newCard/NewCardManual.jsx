import { useState } from "react";
import { useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Ícones personalizados para os marcadores
const redIcon = new L.Icon({
  iconUrl: "pinMapRed.svg",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const blueIcon = new L.Icon({
  iconUrl: "pinMap.svg",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const greenIcon = new L.Icon({
  iconUrl: "pinMapGreen.svg",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function NewCardManual() {
  const addresses = useSelector((state) => state.addresses.addressesData);
  const cards = useSelector((state) => state.cards.cardsData?.card || []);
  const [selectedAddresses, setSelectedAddresses] = useState([]);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  // Filtro de endereços disponíveis (excluindo os que já possuem um card)
  const availableAddresses = Object.values(addresses).filter(
    (address) => !cards.some((card) => card.street.includes(address.id))
  );

  // Alternar seleção de endereço
  const toggleSelectAddress = (addressId) => {
    setSelectedAddresses((prevSelected) =>
      prevSelected.includes(addressId)
        ? prevSelected.filter((id) => id !== addressId)
        : [...prevSelected, addressId]
    );
  };

  // Determinar ícone do marcador
  const getIcon = (addressId) => {
    if (selectedAddresses.includes(addressId)) return greenIcon;
    return blueIcon;
  };

  // Exibir endereços no mapa (filtrar se necessário)
  const displayedAddresses = showSelectedOnly
    ? availableAddresses.filter((address) =>
        selectedAddresses.includes(address.id)
      )
    : availableAddresses;

  // Localização inicial do mapa
  const defaultLocation = [0, 0];
  const mapCenter = availableAddresses.length
    ? availableAddresses[0].gps.split(", ").map(Number)
    : defaultLocation;

  return (
    <div className="flex flex-row bg-gray-100 h-full">
      {/* Lista de endereços */}
      <div className="p-6 flex flex-col gap-4 w-1/3 border-r overflow-y-auto max-h-full">
        <h3 className="text-xl font-semibold">
          Seleccione las direcciones disponibles
        </h3>
        <p className="text-sm">
          Puedes seleccionar direcciones desde esta lista o directamente en el
          mapa.
        </p>
        <div className="overflow-y-auto border p-4 rounded max-h-[30vh]">
          {availableAddresses.length ? (
            availableAddresses.map((address) => (
              <div
                key={address.id}
                className="flex items-center justify-between border-b py-2"
              >
                <div>
                  <p>
                    <strong>{address.street}</strong>, {address.number}
                  </p>
                  <p>
                    {address.neighborhood}, {address.city}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={selectedAddresses.includes(address.id)}
                  onChange={() => toggleSelectAddress(address.id)}
                  className="w-5 h-5"
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500">No hay direcciones disponibles.</p>
          )}
        </div>
        <button
          onClick={() => setShowSelectedOnly(!showSelectedOnly)}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {showSelectedOnly ? "Mostrar todos" : "Mostrar seleccionados"}
        </button>
      </div>

      {/* Mapa */}
      <div className="flex-grow relative">
        <MapContainer
          center={mapCenter}
          zoom={14}
          style={{
            height: "100%",
            width: "100%",
            minHeight: "400px",
            maxHeight: "100%", // Não ultrapassar o tamanho do componente pai
            zIndex: 1,
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {displayedAddresses.map((address) => {
            const [lat, lng] = address.gps.split(", ").map(Number);
            return (
              <Marker
                key={address.id}
                position={[lat, lng]}
                icon={getIcon(address.id)}
                eventHandlers={{
                  click: () => toggleSelectAddress(address.id),
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <p>
                      <strong>{address.street}</strong>, {address.number}
                    </p>
                    <p>
                      {address.neighborhood}, {address.city}
                    </p>
                    <p className="mt-2">
                      {selectedAddresses.includes(address.id) ? (
                        <span className="inline-block px-2 py-1 text-xs rounded bg-green-600 text-white">
                          Seleccionado
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs rounded bg-blue-600 text-white">
                          Disponible
                        </span>
                      )}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

export default NewCardManual;

// import { useState } from "react";
// import { useSelector } from "react-redux";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// // Ícones personalizados para os marcadores
// const redIcon = new L.Icon({
//   iconUrl: "pinMapRed.svg",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// const blueIcon = new L.Icon({
//   iconUrl: "pinMap.svg",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// const greenIcon = new L.Icon({
//   iconUrl: "pinMapGreen.svg",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// function NewCardManual() {
//   const addresses = useSelector((state) => state.addresses.addressesData);
//   const cards = useSelector((state) => state.cards.cardsData?.card || []);
//   const [selectedAddresses, setSelectedAddresses] = useState([]);
//   const [showSelectedOnly, setShowSelectedOnly] = useState(false);

//   // Filtro de endereços disponíveis
//   const availableAddresses = Object.values(addresses).filter(
//     (address) => !cards.some((card) => card.street.includes(address.id))
//   );

//   const toggleSelectAddress = (addressId) => {
//     setSelectedAddresses((prevSelected) =>
//       prevSelected.includes(addressId)
//         ? prevSelected.filter((id) => id !== addressId)
//         : [...prevSelected, addressId]
//     );
//   };

//   const getIcon = (addressId) => {
//     if (selectedAddresses.includes(addressId)) return greenIcon;
//     if (cards.some((card) => card.street.includes(addressId))) return redIcon;
//     return blueIcon;
//   };

//   // Exibir endereços no mapa (filtrar se necessário)
//   const displayedAddresses = showSelectedOnly
//     ? availableAddresses.filter((address) =>
//         selectedAddresses.includes(address.id)
//       )
//     : availableAddresses;

//   // Localização inicial do mapa
//   const defaultLocation = [0, 0];
//   const mapCenter = availableAddresses.length
//     ? availableAddresses[0].gps.split(", ").map(Number)
//     : defaultLocation;

//   return (
//     <div className="flex flex-row bg-gray-100 h-full mb-14">
//       {/* Lista de endereços */}
//       <div className="p-6 flex flex-col gap-4 w-1/3 border-r overflow-y-auto">
//         <h3 className="text-xl font-semibold">
//           Seleccione las direcciones disponibles
//         </h3>
//         <p className="text-sm">
//           Puedes seleccionar direcciones desde esta lista o directamente en el
//           mapa.
//         </p>
//         <div className="overflow-y-auto max-h-[400px] border p-4 rounded">
//           {availableAddresses.length ? (
//             availableAddresses.map((address) => (
//               <div
//                 key={address.id}
//                 className="flex items-center justify-between border-b py-2"
//               >
//                 <div>
//                   <p>
//                     <strong>{address.street}</strong>, {address.number}
//                   </p>
//                   <p>
//                     {address.neighborhood}, {address.city}
//                   </p>
//                 </div>
//                 <input
//                   type="checkbox"
//                   checked={selectedAddresses.includes(address.id)}
//                   onChange={() => toggleSelectAddress(address.id)}
//                   className="w-5 h-5"
//                 />
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">No hay direcciones disponibles.</p>
//           )}
//         </div>
//         <button
//           onClick={() => setShowSelectedOnly(!showSelectedOnly)}
//           className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//         >
//           {showSelectedOnly ? "Mostrar todos" : "Mostrar seleccionados"}
//         </button>
//       </div>

//       {/* Mapa */}
//       <div className="flex-grow relative">
//         <MapContainer
//           center={mapCenter}
//           zoom={14}
//           style={{
//             height: "100%",
//             width: "100%",
//             minHeight: "400px",
//             maxHeight: "600px",
//             zIndex: 1,
//           }}
//         >
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           />
//           {Object.values(addresses).map((address) => {
//             const [lat, lng] = address.gps.split(", ").map(Number);
//             {
//               /* {Object.values(addresses).map((address) => {
//             const [lat, lng] = address.gps.split(", ").map(Number); */
//             }
//             const hasCard = cards.some((card) =>
//               card.street.includes(address.id)
//             );
//             return (
//               <Marker
//                 key={address.id}
//                 position={[lat, lng]}
//                 icon={getIcon(address.id)}
//                 eventHandlers={{
//                   click: () => {
//                     if (!hasCard) toggleSelectAddress(address.id);
//                   },
//                 }}
//                 // eventHandlers={{
//                 //   click: () => toggleSelectAddress(address.id),
//                 // }}
//               >
//                 <Popup>
//                   <div className="text-sm">
//                     <p>
//                       <strong>{address.street}</strong>, {address.number}
//                     </p>
//                     <p>
//                       {address.neighborhood}, {address.city}
//                     </p>
//                     <p className="mt-2">
//                       {hasCard ? (
//                         <span className="inline-block px-2 py-1 text-xs rounded bg-yellow-600 text-white">
//                           Tiene Tarjeta
//                         </span>
//                       ) : selectedAddresses.includes(address.id) ? (
//                         <span className="inline-block px-2 py-1 text-xs rounded bg-green-600 text-white">
//                           Seleccionado
//                         </span>
//                       ) : (
//                         <span className="inline-block px-2 py-1 text-xs rounded bg-blue-600 text-white">
//                           Disponible
//                         </span>
//                       )}
//                     </p>
//                     {/* <p className="mt-2">
//                       {selectedAddresses.includes(address.id) ? (
//                         <span className="inline-block px-2 py-1 text-xs rounded bg-green-600 text-white">
//                           Seleccionado
//                         </span>
//                       ) : (
//                         <span className="inline-block px-2 py-1 text-xs rounded bg-blue-600 text-white">
//                           Disponible
//                         </span>
//                       )}
//                     </p> */}
//                   </div>
//                 </Popup>
//               </Marker>
//             );
//           })}
//         </MapContainer>
//       </div>
//     </div>
//   );
// }

// export default NewCardManual;

// import { useState } from "react";
// import { useSelector } from "react-redux";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// // Ícones personalizados para os marcadores
// const redIcon = new L.Icon({
//   iconUrl: "pinMapRed.svg",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// const blueIcon = new L.Icon({
//   iconUrl: "pinMap.svg",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// const greenIcon = new L.Icon({
//   iconUrl: "pinMapGreen.svg",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// function NewCardManual() {
//   const addresses = useSelector((state) => state.addresses.addressesData);
//   const cards = useSelector((state) => state.cards.cardsData?.card || []);
//   const [selectedAddresses, setSelectedAddresses] = useState([]);

//   console.log(addresses);

//   const defaultLocation = [0, 0];
//   const mapCenter = Object.values(addresses).length
//     ? Object.values(addresses)[0].gps.split(", ").map(Number)
//     : defaultLocation;

//   const toggleSelectAddress = (addressId) => {
//     setSelectedAddresses((prevSelected) =>
//       prevSelected.includes(addressId)
//         ? prevSelected.filter((id) => id !== addressId)
//         : [...prevSelected, addressId]
//     );
//   };

//   const getIcon = (addressId) => {
//     if (selectedAddresses.includes(addressId)) return greenIcon;
//     if (cards.some((card) => card.street.includes(addressId))) return redIcon;
//     return blueIcon;
//   };

//   const createCard = () => {
//     console.log("Selected addresses for card creation:", selectedAddresses);
//   };

//   return (
//     <div className="flex flex-col md:flex-row bg-gray-100 h-screen">
//       <div className="p-6 flex flex-col gap-3 md:w-[250px] md:h-[600px] md:gap-10">
//         <h3 className="text-xl font-semibold">
//           Seleccione las direcciones en el mapa
//         </h3>
//         <p className="text-sm">
//           Las direcciones en azul están disponibles y las en rojo ya tienen
//           tarjetas.
//         </p>
//         <p className="text-base">
//           Has seleccionado{" "}
//           {selectedAddresses.length === 0
//             ? "ninguna"
//             : selectedAddresses.length}{" "}
//           {selectedAddresses.length <= 1 ? "dirección" : "direcciones"}
//         </p>
//         <button
//           onClick={createCard}
//           className="px-6 py-2 border border-secondary text-secondary hover:bg-secondary hover:text-primary transition-colors disabled:border-gray-300 disabled:text-gray-300 disabled:hover:bg-primary"
//           disabled={selectedAddresses.length === 0}
//         >
//           Crear tarjeta
//         </button>
//       </div>
//       <div className="flex-grow relative">
//         <MapContainer
//           center={mapCenter}
//           zoom={14}
//           style={{
//             height: "100%",
//             width: "100%",
//             minHeight: "400px", // Garante altura mínima em dispositivos menores
//             zIndex: 1, // Garantir que o mapa tenha zIndex menor
//           }}
//         >
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           />
//           {Object.values(addresses).map((address) => {
//             const [lat, lng] = address.gps.split(", ").map(Number);
//             const hasCard = cards.some((card) =>
//               card.street.includes(address.id)
//             );
//             return (
//               <Marker
//                 key={address.id}
//                 position={[lat, lng]}
//                 icon={getIcon(address.id)}
//                 eventHandlers={{
//                   click: () => {
//                     if (!hasCard) toggleSelectAddress(address.id);
//                   },
//                 }}
//               >
//                 <Popup>
//                   <div className="text-sm">
//                     <p>
//                       <strong>{address.street}</strong>, {address.number}
//                     </p>
//                     <p>
//                       {address.neighborhood}, {address.city}
//                     </p>
//                     <p className="mt-2">
//                       {hasCard ? (
//                         <span className="inline-block px-2 py-1 text-xs rounded bg-yellow-600 text-white">
//                           Tiene Tarjeta
//                         </span>
//                       ) : selectedAddresses.includes(address.id) ? (
//                         <span className="inline-block px-2 py-1 text-xs rounded bg-green-600 text-white">
//                           Seleccionado
//                         </span>
//                       ) : (
//                         <span className="inline-block px-2 py-1 text-xs rounded bg-blue-600 text-white">
//                           Disponible
//                         </span>
//                       )}
//                     </p>
//                   </div>
//                 </Popup>
//               </Marker>
//             );
//           })}
//         </MapContainer>
//       </div>
//     </div>
//   );
// }

// export default NewCardManual;

// import { useState } from "react";
// import { useSelector } from "react-redux";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// // Ícones personalizados para os marcadores
// const redIcon = new L.Icon({
//   iconUrl: "pinMapRed.svg",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// const blueIcon = new L.Icon({
//   iconUrl: "pinMap.svg",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// const greenIcon = new L.Icon({
//   iconUrl: "pinMapGreen.svg",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// function NewCardManual() {
//   const addresses = useSelector((state) => state.addresses.addressesData);
//   const cards = useSelector((state) => state.cards.cardsData?.card || []);
//   const [selectedAddresses, setSelectedAddresses] = useState([]);

//   const defaultLocation = [0, 0];
//   const mapCenter = Object.values(addresses).length
//     ? Object.values(addresses)[0].gps.split(", ").map(Number)
//     : defaultLocation;

//   const toggleSelectAddress = (addressId) => {
//     setSelectedAddresses((prevSelected) =>
//       prevSelected.includes(addressId)
//         ? prevSelected.filter((id) => id !== addressId)
//         : [...prevSelected, addressId]
//     );
//   };

//   const getIcon = (addressId) => {
//     if (selectedAddresses.includes(addressId)) return greenIcon;
//     if (cards.some((card) => card.street.includes(addressId))) return redIcon;
//     return blueIcon;
//   };

//   const createCard = () => {
//     console.log("Selected addresses for card creation:", selectedAddresses);
//   };

//   return (
//     <div className="flex flex-col md:flex-row bg-gray-100 ">
//       <div className="p-6 flex flex-col gap-3 md:w-[250px] md:h-[600px]  md:gap-10">
//         <h3 className="text-xl font-semibold">
//           Seleccione las direcciones en el mapa
//         </h3>
//         <p className="text-sm">Las direcciones en azul están disponibles.</p>
//         {/* <div className="flex justify-between items-center "> */}
//         <p className="text-base">
//           Has seleccionado{" "}
//           {selectedAddresses.length === 0
//             ? "ninguna"
//             : selectedAddresses.length}{" "}
//           {selectedAddresses.length <= 1 ? "direccion" : "direcciones"}
//         </p>
//         <button
//           onClick={createCard}
//           className="px-6 py-2 border border-secondary text-secondary  hover:bg-secondary hover:text-primary transition-colors"
//         >
//           Crear tarjeta
//         </button>
//         {/* </div> */}
//       </div>
//       <div className="relative flex-grow">
//         <MapContainer
//           center={mapCenter}
//           zoom={14}
//           style={{
//             height: "100%",
//             width: "100%",
//             zIndex: 1, // Garantir que o mapa tenha zIndex menor
//           }}
//         >
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           />
//           {Object.values(addresses).map((address) => {
//             const [lat, lng] = address.gps.split(", ").map(Number);
//             const hasCard = cards.some((card) =>
//               card.street.includes(address.id)
//             );
//             return (
//               <Marker
//                 key={address.id}
//                 position={[lat, lng]}
//                 icon={getIcon(address.id)}
//                 eventHandlers={{
//                   click: () => {
//                     if (!hasCard) toggleSelectAddress(address.id);
//                   },
//                 }}
//               >
//                 <Popup>
//                   <div className="text-sm">
//                     <p>
//                       <strong>{address.street}</strong>, {address.number}
//                     </p>
//                     <p>
//                       {address.neighborhood}, {address.city}
//                     </p>
//                     <p className="mt-2">
//                       {hasCard ? (
//                         <span className="inline-block px-2 py-1 text-xs rounded bg-yellow-600 text-white">
//                           Tiene Tarjeta
//                         </span>
//                       ) : selectedAddresses.includes(address.id) ? (
//                         <span className="inline-block px-2 py-1 text-xs rounded bg-green-600 text-white">
//                           Seleccionado
//                         </span>
//                       ) : (
//                         <span className="inline-block px-2 py-1 text-xs rounded bg-blue-600 text-white">
//                           Disponible
//                         </span>
//                       )}
//                     </p>
//                   </div>
//                 </Popup>
//               </Marker>
//             );
//           })}
//         </MapContainer>
//       </div>
//     </div>
//   );
// }

// export default NewCardManual;

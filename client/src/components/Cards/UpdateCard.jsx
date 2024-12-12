import React from "react";

function UpdateCard() {
  return <div>UpdateCard</div>;
}

export default UpdateCard;

// import { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { motion } from "framer-motion";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import { useMutation } from "@apollo/client";
// import { toast } from "react-toastify";
// import { useNavigate, useParams } from "react-router-dom";
// import { UPDATE_CARD } from "../../graphql/mutation/cards.mutation";
// import Loading from "../../context/Loading";

// // Ícones personalizados para os marcadores
// const greenIcon = new L.Icon({
//   iconUrl: "pinMapGreen.svg",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// const blueIcon = new L.Icon({
//   iconUrl: "pinMap.svg",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// function UpdateCard() {
//   const { id } = useParams(); // Obtém o ID do cartão da URL
//   const cards = useSelector((state) => state.cards.cardsData?.card || []);
//   const addresses = useSelector((state) => state.addresses.addressesData);
//   const cardToUpdate = cards.find((card) => card.id === id);
//   const [selectedAddresses, setSelectedAddresses] = useState(
//     cardToUpdate?.street || []
//   );
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const [updateCard] = useMutation(UPDATE_CARD, {
//     onCompleted: (data) => {
//       toast.success(data.cardMutation.message);
//       setLoading(false);
//       navigate("/cards?tab=asignar");
//     },
//     onError: (error) => {
//       toast.error(`Error al actualizar la tarjeta: ${error.message}`);
//       setLoading(false);
//     },
//   });

//   const handleUpdateCard = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await updateCard({
//         variables: {
//           id,
//           updatedCard: {
//             street: selectedAddresses,
//           },
//         },
//       });
//     } catch (error) {
//       console.error("Error al actualizar la tarjeta: ", error.message);
//       setLoading(false);
//     }
//   };

//   const toggleSelectAddress = (addressId) => {
//     setSelectedAddresses((prevSelected) =>
//       prevSelected.includes(addressId)
//         ? prevSelected.filter((id) => id !== addressId)
//         : [...prevSelected, addressId]
//     );
//   };

//   const getIcon = (addressId) =>
//     selectedAddresses.includes(addressId) ? greenIcon : blueIcon;

//   if (loading) {
//     return <Loading text="Actualizando tarjeta..." />;
//   }

//   if (!cardToUpdate) {
//     return (
//       <div className="min-h-screen flex justify-center items-center">
//         <p>Tarjeta no encontrada.</p>
//       </div>
//     );
//   }

//   const availableAddresses = Object.values(addresses);

//   return (
//     <div className="min-h-screen bg-details p-3 md:p-10 flex justify-center">
//       <motion.div
//         className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl"
//         initial={{ opacity: 0, x: -50 }}
//         animate={{ opacity: 1, x: 0 }}
//         exit={{ opacity: 0, x: 50 }}
//         transition={{ duration: 0.3 }}
//       >
//         <h1 className="text-3xl font-medium text-gray-700 mb-6">
//           Actualizar Tarjeta
//         </h1>
//         <form onSubmit={handleUpdateCard}>
//           <div className="flex flex-col md:flex-row my-3 h-full w-full bg-white">
//             <div className="border-t border-stone-50 flex flex-col gap-4 md:w-2/3 border-r md:overflow-y-auto max-h-full">
//               <h3 className="text-xl font-semibold">
//                 Seleccione las direcciones
//               </h3>
//               <div className="overflow-y-auto border p-4 rounded max-h-[30vh] bg-primary">
//                 {availableAddresses.map((address) => (
//                   <div
//                     key={address.id}
//                     className="flex items-center text-sm lg:text-lg justify-between border-b py-2"
//                   >
//                     <div>
//                       <p>
//                         <strong>{address.street}</strong>, {address.number}
//                       </p>
//                       <p>
//                         {address.neighborhood}, {address.city}
//                       </p>
//                     </div>
//                     <input
//                       type="checkbox"
//                       checked={selectedAddresses.includes(address.id)}
//                       onChange={() => toggleSelectAddress(address.id)}
//                       className="w-5 h-5"
//                     />
//                   </div>
//                 ))}
//               </div>
//               <button
//                 type="submit"
//                 className="mb-5 px-6 py-2 border border-secondary hover:bg-secondary hover:text-primary transition-colors text-sm lg:text-lg disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-primary"
//                 disabled={selectedAddresses.length === 0}
//               >
//                 Actualizar Tarjeta
//               </button>
//             </div>

//             <div className="md:ml-3 lg:flex-grow md:relative w-full h-full">
//               <MapContainer
//                 center={
//                   selectedAddresses.length
//                     ? addresses[selectedAddresses[0]].gps
//                         .split(", ")
//                         .map(Number)
//                     : [0, 0]
//                 }
//                 zoom={14}
//                 className="h-full w-full min-h-[400px] max-h-[100%] z-0 object-cover"
//               >
//                 <TileLayer
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                   attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                 />
//                 {availableAddresses.map((address) => {
//                   const [lat, lng] = address.gps.split(", ").map(Number);
//                   return (
//                     <Marker
//                       key={address.id}
//                       position={[lat, lng]}
//                       icon={getIcon(address.id)}
//                       eventHandlers={{
//                         click: () => toggleSelectAddress(address.id),
//                       }}
//                     >
//                       <Popup>
//                         <div className="text-sm">
//                           <p>
//                             <strong>{address.street}</strong>, {address.number}
//                           </p>
//                           <p>
//                             {address.neighborhood}, {address.city}
//                           </p>
//                         </div>
//                       </Popup>
//                     </Marker>
//                   );
//                 })}
//               </MapContainer>
//             </div>
//           </div>
//         </form>
//       </motion.div>
//     </div>
//   );
// }

// export default UpdateCard;

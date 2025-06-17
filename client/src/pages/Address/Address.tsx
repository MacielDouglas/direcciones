import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
import {
  Bed,
  Home,
  Hotel,
  MapPin,
  MapPinHouse,
  Store,
  Utensils,
} from "lucide-react";

import { selectAllAddresses } from "../../store/selectors/addressSelectors";
import { calculateDistance } from "../../constants/address";
import PhotoAddress from "./components/PhotoAddress";
import AddressSkeleton from "./components/skeletons/AddressSkeleton";

type AddressProps = {
  id: string | null;
};

type Location = {
  lat: number;
  lng: number;
};

const Address: React.FC<AddressProps> = ({ id }) => {
  const addresses = useSelector(selectAllAddresses);
  const address = useMemo(
    () => addresses.find((a) => a.id === id),
    [addresses, id]
  );

  const gps = address?.gps;

  // useMemo SEMPRE será chamado, mesmo que gps seja undefined
  const [latitude, longitude] = useMemo(() => {
    if (typeof gps === "string") {
      const [lat, lng] = gps.split(", ").map(parseFloat);
      return [lat, lng];
    }
    return [undefined, undefined];
  }, [gps]);

  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      (err) => console.error("Erro ao obter localização do usuário:", err)
    );
  }, []);

  const device = useMemo(() => {
    const ua = navigator.userAgent;
    if (/iPhone|iPad/i.test(ua)) return "ios";
    if (/Android/i.test(ua)) return "android";
    return "desktop";
  }, []);

  if (!address) return <AddressSkeleton />;

  const {
    street = "",
    number = "",
    neighborhood = "",
    city = "",
    type,
    confirmed,
    photo = "",
    active,
  } = address;

  const distance =
    userLocation && latitude && longitude
      ? calculateDistance(
          userLocation.lat,
          userLocation.lng,
          latitude,
          longitude
        ).toFixed(0)
      : null;

  const typeIcons: Record<string, JSX.Element> = {
    house: <Home size={40} />,
    department: <Hotel size={40} />,
    store: <Store size={40} />,
    restaurant: <Utensils size={40} />,
    hotel: <Bed size={40} />,
  };

  const handleOpenMap = (app: "google" | "waze" | "apple") => {
    const origin = userLocation
      ? `${userLocation.lat},${userLocation.lng}`
      : "";
    const destination = `${latitude},${longitude}`;

    const urls = {
      google: `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=walking`,
      waze: `https://waze.com/ul?ll=${destination}&navigate=yes`,
      apple: `maps://maps.apple.com/?saddr=${origin}&daddr=${destination}&dirflg=w`,
    };

    window.open(urls[app], "_blank");
    setIsModalOpen(false);
  };

  return (
    <div className="w-full h-full bg-second-lgt dark:bg-tertiary-drk text-primary-drk dark:text-primary-lgt rounded-2xl max-w-2xl mx-auto md:p-6">
      <div className="flex items-center gap-4 mb-6 p-6 md:p-0">
        <MapPinHouse
          className="text-[var(--color-destaque-primary)]"
          size={24}
        />
        <h1 className="text-2xl font-semibold">Dirección</h1>
      </div>

      <div className="bg-primary-lgt dark:bg-primary-drk shadow-sm overflow-hidden md:rounded-2xl">
        <div className="p-6 flex flex-col justify-center">
          <PhotoAddress hei="h-full" photo={photo} street={street} />

          <p
            className={`text-center font-bold ${
              !active
                ? "text-secondary"
                : confirmed
                ? "text-blue-600"
                : "text-orange-800"
            }`}
          >
            {!active
              ? "DIRECCIÓN DESACTIVADA"
              : confirmed
              ? "Dirección confirmada"
              : "NECESITA CONFIRMACIÓN"}
          </p>

          <div className="flex flex-col items-center space-y-3 text-sm mt-4">
            <div className="flex justify-between items-center w-full">
              <span>{typeIcons[type]}</span>
              <div className="flex items-center gap-2 text-xl">
                <MapPin />
                <span>
                  {distance
                    ? Number(distance) >= 1000
                      ? `${(Number(distance) / 1000).toFixed(2)}km`
                      : `${distance}m`
                    : "N/A"}
                </span>
              </div>
            </div>

            <p className="text-lg font-semibold text-start w-full">
              Calle: {`${street}, ${number}`}
            </p>

            <div className="flex justify-between w-full">
              <p>
                Barrio: <strong>{neighborhood}</strong>
              </p>
              <p>
                Ciudad: <strong>{city}</strong>
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm mt-4 shadow-md"
            >
              ver en el mapa
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE ESCOLHA DE NAVEGAÇÃO */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4 text-center">
              Abrir com:
            </h2>
            <div className="flex flex-col gap-3">
              {(device === "android" || device === "ios") && (
                <>
                  <button
                    onClick={() => handleOpenMap("google")}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg"
                  >
                    Google Maps
                  </button>
                  <button
                    onClick={() => handleOpenMap("waze")}
                    className="w-full bg-purple-600 text-white py-2 rounded-lg"
                  >
                    Waze
                  </button>
                </>
              )}

              {device === "ios" && (
                <button
                  onClick={() => handleOpenMap("apple")}
                  className="w-full bg-black text-white py-2 rounded-lg"
                >
                  Apple Maps
                </button>
              )}

              {device === "desktop" && (
                <button
                  onClick={() => handleOpenMap("google")}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg"
                >
                  Abrir no Google Maps
                </button>
              )}

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-2 text-sm text-gray-500 dark:text-gray-300 mt-2"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Address;

// import { useSelector } from "react-redux";
// import { useEffect, useMemo, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// import {
//   Bed,
//   Home,
//   Hotel,
//   MapPin,
//   MapPinHouse,
//   Store,
//   Utensils,
// } from "lucide-react";

// import { selectAllAddresses } from "../../store/selectors/addressSelectors";
// import { calculateDistance } from "../../constants/address";
// import PhotoAddress from "./components/PhotoAddress";
// import AddressSkeleton from "./components/skeletons/AddressSkeleton";

// type AddressProps = {
//   id: string | null;
// };

// type Location = {
//   lat: number;
//   lng: number;
// };

// const Address: React.FC<AddressProps> = ({ id }) => {
//   const addresses = useSelector(selectAllAddresses);
//   const address = addresses.find((a) => a.id === id);

//   const [userLocation, setUserLocation] = useState<Location | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   // const navigate = useNavigate();

//   useEffect(() => {
//     navigator.geolocation?.getCurrentPosition(
//       (pos) =>
//         setUserLocation({
//           lat: pos.coords.latitude,
//           lng: pos.coords.longitude,
//         }),
//       (err) => console.error("Erro ao obter localização do usuário:", err)
//     );
//   }, []);

//   if (!address) return null;

//   const {
//     street,
//     number,
//     neighborhood,
//     city,
//     type,
//     gps,
//     confirmed,
//     photo,
//     active,
//   } = address;

//   const [latitude, longitude] = useMemo(() => {
//     if (typeof gps === "string") {
//       const [lat, lng] = gps.split(", ").map(parseFloat);
//       return [lat, lng];
//     }
//     return [undefined, undefined];
//   }, [gps]);

//   const distance =
//     userLocation && latitude && longitude
//       ? calculateDistance(
//           userLocation.lat,
//           userLocation.lng,
//           latitude,
//           longitude
//         ).toFixed(0)
//       : null;

//   const typeIcons: Record<string, JSX.Element> = {
//     house: <Home size={40} />,
//     department: <Hotel size={40} />,
//     store: <Store size={40} />,
//     restaurant: <Utensils size={40} />,
//     hotel: <Bed size={40} />,
//   };

//   const handleOpenMap = (app: "google" | "waze" | "apple") => {
//     const origin = userLocation
//       ? `${userLocation.lat},${userLocation.lng}`
//       : "";
//     const destination = `${latitude},${longitude}`;

//     const urls = {
//       google: `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=walking`,
//       waze: `https://waze.com/ul?ll=${destination}&navigate=yes`,
//       apple: `maps://maps.apple.com/?saddr=${origin}&daddr=${destination}&dirflg=w`,
//     };

//     window.open(urls[app], "_blank");
//     setIsModalOpen(false);
//   };

//   const device = useMemo(() => {
//     const ua = navigator.userAgent;
//     if (/iPhone|iPad/i.test(ua)) return "ios";
//     if (/Android/i.test(ua)) return "android";
//     return "desktop";
//   }, []);

//   if (!address) return <AddressSkeleton />;

//   return (
//     <div className="w-full h-full bg-second-lgt dark:bg-tertiary-drk text-primary-drk dark:text-primary-lgt rounded-2xl max-w-2xl mx-auto md:p-6">
//       <div className="flex items-center gap-4 mb-6 p-6 md:p-0">
//         <MapPinHouse
//           className="text-[var(--color-destaque-primary)]"
//           size={24}
//         />
//         <h1 className="text-2xl font-semibold">Dirección</h1>
//       </div>

//       <div className="bg-primary-lgt dark:bg-primary-drk shadow-sm overflow-hidden md:rounded-2xl">
//         <div className="p-6 flex flex-col justify-center">
//           <PhotoAddress hei="h-full" photo={photo} street={street} />

//           <p
//             className={`text-center font-bold ${
//               !active
//                 ? "text-secondary"
//                 : confirmed
//                 ? "text-blue-600"
//                 : "text-orange-800"
//             }`}
//           >
//             {!active
//               ? "DIRECCIÓN DESACTIVADA"
//               : confirmed
//               ? "Dirección confirmada"
//               : "NECESITA CONFIRMACIÓN"}
//           </p>

//           <div className="flex flex-col items-center space-y-3 text-sm mt-4">
//             <div className="flex justify-between items-center w-full">
//               <span>{typeIcons[type]}</span>
//               <div className="flex items-center gap-2 text-xl">
//                 <MapPin />
//                 <span>
//                   {distance
//                     ? distance >= "1000"
//                       ? `${(Number(distance) / 1000).toFixed(2)}km`
//                       : `${distance}m`
//                     : "N/A"}
//                 </span>
//               </div>
//             </div>

//             <p className="text-lg font-semibold text-start w-full">
//               Calle: {`${street}, ${number}`}
//             </p>

//             <div className="flex justify-between w-full">
//               <p>
//                 Barrio: <strong>{neighborhood}</strong>
//               </p>
//               <p>
//                 Ciudad: <strong>{city}</strong>
//               </p>
//             </div>

//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm mt-4 shadow-md"
//             >
//               ver en el mapa
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* MODAL DE ESCOLHA DE NAVEGAÇÃO */}
//       {isModalOpen && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4"
//           onClick={() => setIsModalOpen(false)}
//         >
//           <div
//             className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg w-full max-w-sm p-6"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h2 className="text-lg font-semibold mb-4 text-center">
//               Abrir com:
//             </h2>
//             <div className="flex flex-col gap-3">
//               {(device === "android" || device === "ios") && (
//                 <>
//                   <button
//                     onClick={() => handleOpenMap("google")}
//                     className="w-full bg-blue-600 text-white py-2 rounded-lg"
//                   >
//                     Google Maps
//                   </button>
//                   <button
//                     onClick={() => handleOpenMap("waze")}
//                     className="w-full bg-purple-600 text-white py-2 rounded-lg"
//                   >
//                     Waze
//                   </button>
//                 </>
//               )}

//               {device === "ios" && (
//                 <button
//                   onClick={() => handleOpenMap("apple")}
//                   className="w-full bg-black text-white py-2 rounded-lg"
//                 >
//                   Apple Maps
//                 </button>
//               )}

//               {device === "desktop" && (
//                 <button
//                   onClick={() => handleOpenMap("google")}
//                   className="w-full bg-blue-600 text-white py-2 rounded-lg"
//                 >
//                   Abrir no Google Maps
//                 </button>
//               )}

//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="w-full py-2 text-sm text-gray-500 dark:text-gray-300 mt-2"
//               >
//                 Cancelar
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Address;

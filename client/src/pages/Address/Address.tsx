import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
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
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

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
  const mapboxToken = import.meta.env.VITE_FIREBASE_MAP_BOX;
  // const mapboxStyle = "mapbox://styles/mapbox/standard";
  const mapboxStyle = import.meta.env.VITE_FIREBASE_MAP_BOX_STYLE;

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
    complement = "",
    customName = "",
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
    house: <Home size={28} />,
    department: <Hotel size={28} />,
    store: <Store size={28} />,
    restaurant: <Utensils size={28} />,
    hotel: <Bed size={28} />,
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
    <div className="w-full h-full bg-second-lgt dark:bg-tertiary-drk text-primary-drk dark:text-primary-lgt rounded-2xl max-w-md mx-auto p-4 space-y-6">
      <div className="flex items-center gap-3">
        <MapPinHouse
          className="text-[var(--color-destaque-primary)]"
          size={20}
        />
        <h1 className="text-2xl font-semibold">Dirección</h1>
      </div>

      {customName && <h2 className="font-semibold text-xl"> - {customName}</h2>}

      <div className="bg-primary-lgt dark:bg-primary-drk shadow-sm rounded-2xl overflow-hidden">
        <Map
          mapboxAccessToken={mapboxToken}
          initialViewState={{
            longitude: Number(gps?.split(", ")[1]),
            latitude: Number(gps?.split(", ")[0]),
            zoom: 16,
          }}
          style={{ width: "100%", height: 250 }}
          mapStyle={mapboxStyle}
        >
          <Marker
            longitude={Number(gps?.split(", ")[1])}
            latitude={Number(gps?.split(", ")[0])}
            color="black"
            anchor="bottom"
          />
        </Map>

        <div className="p-4 space-y-4">
          <PhotoAddress hei="h-20" photo={photo} street={street} />

          <p
            className={`text-center font-semibold text-sm ${
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

          <div className="flex justify-between items-center text-sm">
            <span>{typeIcons[type]}</span>
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <span className="font-medium">
                {distance
                  ? Number(distance) >= 1000
                    ? `${(Number(distance) / 1000).toFixed(1)}km`
                    : `${distance}m`
                  : "N/A"}
              </span>
            </div>
          </div>

          <p className="text-base font-semibold">
            Calle: {`${street}, ${number}`}
          </p>

          <div className="flex justify-between text-sm">
            <p>
              Barrio: <strong>{neighborhood}</strong>
            </p>
            <p>
              Ciudad: <strong>{city}</strong>
            </p>
          </div>

          <div className="w-full bg-tertiary-lgt dark:bg-tertiary-drk p-4 rounded-xl text-sm">
            <p>{complement}</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white w-full py-2 rounded-lg text-sm shadow-md mt-2"
          >
            Ver en el mapa
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg w-full max-w-xs p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-semibold mb-4 text-center">
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
// import Map, { Marker } from "react-map-gl/mapbox";
// import "mapbox-gl/dist/mapbox-gl.css";

// type AddressProps = {
//   id: string | null;
// };

// type Location = {
//   lat: number;
//   lng: number;
// };

// const Address: React.FC<AddressProps> = ({ id }) => {
//   const addresses = useSelector(selectAllAddresses);
//   const address = useMemo(
//     () => addresses.find((a) => a.id === id),
//     [addresses, id]
//   );

//   const gps = address?.gps;

//   const mapboxToken = import.meta.env.VITE_FIREBASE_MAP_BOX;
//   // const mapboxStyle = import.meta.env.VITE_FIREBASE_MAP_BOX_STYLE;
//   const mapboxStyle = "mapbox://styles/mapbox/standard";

//   // useMemo SEMPRE será chamado, mesmo que gps seja undefined
//   const [latitude, longitude] = useMemo(() => {
//     if (typeof gps === "string") {
//       const [lat, lng] = gps.split(", ").map(parseFloat);
//       return [lat, lng];
//     }
//     return [undefined, undefined];
//   }, [gps]);

//   const [userLocation, setUserLocation] = useState<Location | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

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

//   const device = useMemo(() => {
//     const ua = navigator.userAgent;
//     if (/iPhone|iPad/i.test(ua)) return "ios";
//     if (/Android/i.test(ua)) return "android";
//     return "desktop";
//   }, []);

//   if (!address) return <AddressSkeleton />;

//   const {
//     street = "",
//     number = "",
//     neighborhood = "",
//     city = "",
//     type,
//     confirmed,
//     photo = "",
//     active,
//     complement = "",
//   } = address;

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
//           <div
//             className=" flex items-center justify-center w-full rounded-2xl  mb-10
//           "
//           >
//             <Map
//               mapboxAccessToken={mapboxToken}
//               initialViewState={{
//                 longitude: Number(gps?.split(", ")[1]),
//                 latitude: Number(gps?.split(", ")[0]),
//                 zoom: 16,
//               }}
//               style={{ width: 600, height: 400 }}
//               mapStyle={mapboxStyle}
//             >
//               <Marker
//                 longitude={Number(gps?.split(", ")[1])}
//                 latitude={Number(gps?.split(", ")[0])}
//                 color="black"
//                 anchor="bottom"
//               ></Marker>
//             </Map>
//           </div>

//           <div className="">
//             <PhotoAddress hei="h-24" photo={photo} street={street} />
//             <p
//               className={`text-center font-bold ${
//                 !active
//                   ? "text-secondary"
//                   : confirmed
//                   ? "text-blue-600"
//                   : "text-orange-800"
//               }`}
//             >
//               {!active
//                 ? "DIRECCIÓN DESACTIVADA"
//                 : confirmed
//                 ? "Dirección confirmada"
//                 : "NECESITA CONFIRMACIÓN"}
//             </p>
//           </div>

//           <div className="flex flex-col items-center space-y-3 text-sm mt-4">
//             <div className="flex justify-between items-center w-full">
//               <span>{typeIcons[type]}</span>
//               <div className="flex items-center gap-2 text-xl">
//                 <MapPin />
//                 <span>
//                   {distance
//                     ? Number(distance) >= 1000
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

//             <div className="w-full bg-tertiary-lgt dark:bg-tertiary-drk p-6 rounded-xl ">
//               <p>{complement}</p>
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

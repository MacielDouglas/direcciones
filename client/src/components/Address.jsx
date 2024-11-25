import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import L from "leaflet";
import { useState, useEffect } from "react";
import {
  MdHouse,
  MdRestaurant,
  MdHotel,
  MdOutlineStorefront,
  MdOutlineApartment,
} from "react-icons/md";
import { Link } from "react-router-dom";

// Ícones personalizados para os marcadores
const personIcon = new L.Icon({
  iconUrl: "person.svg",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const pinMapIcon = new L.Icon({
  iconUrl: "pinMap.svg",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function Routing({ userLocation, destination }) {
  const map = useMap();
  const [route, setRoute] = useState(null);

  useEffect(() => {
    if (userLocation && destination) {
      const fetchRoute = async () => {
        const url = `https://router.project-osrm.org/route/v1/walking/${userLocation.lng},${userLocation.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          if (data && data.routes && data.routes.length) {
            const coordinates = data.routes[0].geometry.coordinates;
            const latlngs = coordinates.map(([lng, lat]) => [lat, lng]);

            // Cria uma camada de rota
            const polyline = L.polyline(latlngs, {
              color: "#6c63ff",
              weight: 4,
            }).addTo(map);

            setRoute(polyline);
          }
        } catch (error) {
          console.error("Erro ao obter a rota:", error);
        }
      };

      fetchRoute();
    }

    // Remove a rota ao desmontar
    return () => {
      if (route) {
        map.removeLayer(route);
      }
    };
  }, [userLocation, destination, map, route]);

  return null;
}

function Address({ id }) {
  const addresses = useSelector((state) => state.addresses.addressesData);
  const address = addresses.find((address) => address.id === id);

  const [userLocation, setUserLocation] = useState(null);

  if (!address) {
    return <p>Endereço não encontrado.</p>;
  }

  const { street, number, neighborhood, city, type, gps, complement } = address;

  // Coordenadas do endereço
  const [latitude, longitude] = gps
    .split(", ")
    .map((coord) => parseFloat(coord.trim()));

  // Obter localização atual do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.error("Erro ao obter localização do usuário.");
        }
      );
    }
  }, []);

  console.log(complement);
  return (
    <div className="w-full  justify-center flex">
      <div className=" max-w-lg p-4 border rounded shadow-md mb-52 mt-10">
        <h2 className="text-xl font-medium text-center mb-4">
          Informações do Endereço
        </h2>
        <div className="bg-white p-5 rounded-md drop-shadow-lg mb-4 space-y-3 flex flex-col gap-4">
          <div className="flex  gap-5">
            <span className="text-5xl self-center">
              {(type === "house" && <MdHouse />) ||
                (type === "department" && <MdOutlineApartment />) ||
                (type === "store" && <MdOutlineStorefront />) ||
                (type === "restaurant" && <MdRestaurant />) ||
                (type === "hotel" && <MdHotel />)}
            </span>
            <div className="text-sm w-full h-full">
              <p className="text-xl mb-2">
                Rua:{" "}
                <strong>
                  {street}, {number}
                </strong>
              </p>
              <p className="text-sm">
                Bairro: <strong>{neighborhood}, </strong>
              </p>
              <p className="text-sm">
                Cidade: <strong>{city}</strong>
              </p>
            </div>
            <div className="self-center">
              <Link
                to={`https://www.google.com/maps/dir/?api=1&origin=${userLocation?.lat},${userLocation?.lng}&destination=${latitude},${longitude}&travelmode=walking`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-4xl font-semibold"
              >
                IR
              </Link>
            </div>
          </div>
          {complement && (
            <div className="border-t border-t-gray-200">
              <p>{complement}</p>
            </div>
          )}
        </div>

        <div className="mb-6">
          <MapContainer
            center={[latitude, longitude]} // Centraliza no destino
            zoom={15} // Zoom inicial fixo
            style={{ height: "300px", width: "100%" }}
            className="rounded border z-0"
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">Carto</a> contributors & <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {/* Marcador do endereço */}
            <Marker position={[latitude, longitude]} icon={pinMapIcon}>
              <Popup>
                Endereço: {street}, {number}, {neighborhood}, {city}
              </Popup>
            </Marker>
            {/* Marcador do usuário */}
            {userLocation && (
              <Marker
                position={[userLocation.lat, userLocation.lng]}
                icon={personIcon}
              >
                <Popup>Você está aqui!</Popup>
              </Marker>
            )}
            {/* Rota */}
            {userLocation && (
              <Routing
                userLocation={userLocation}
                destination={{ lat: latitude, lng: longitude }}
              />
            )}
          </MapContainer>
        </div>
        {/* <div className="flex justify-around">
        <a
          href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation?.lat},${userLocation?.lng}&destination=${latitude},${longitude}&travelmode=walking`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Caminhar
        </a>
        <a
          href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation?.lat},${userLocation?.lng}&destination=${latitude},${longitude}&travelmode=driving`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Dirigir
        </a>
      </div> */}
      </div>
    </div>
  );
}

export default Address;

Address.propTypes = {
  id: PropTypes.string.isRequired,
};

// import { useSelector } from "react-redux";
// import PropTypes from "prop-types";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import "leaflet-routing-machine";
// import L from "leaflet";
// import { useState, useEffect } from "react";
// import {
// import { Link } from 'react-router-dom';
// MdHouse,
//   MdRestaurant,
//   MdHotel,
//   MdOutlineStorefront,
//   MdOutlineApartment,
// } from "react-icons/md";

// // Ícones personalizados para os marcadores
// const personIcon = new L.Icon({
//   iconUrl: "person.svg",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// const pinMapIcon = new L.Icon({
//   iconUrl: "pinMap.svg",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// function Routing({ userLocation, destination }) {
//   const map = useMap();
//   const [route, setRoute] = useState(null);

//   useEffect(() => {
//     if (userLocation && destination) {
//       const fetchRoute = async () => {
//         const url = `https://router.project-osrm.org/route/v1/walking/${userLocation.lng},${userLocation.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
//         try {
//           const response = await fetch(url);
//           const data = await response.json();
//           if (data && data.routes && data.routes.length) {
//             const coordinates = data.routes[0].geometry.coordinates;
//             const latlngs = coordinates.map(([lng, lat]) => [lat, lng]);

//             // Cria uma camada de rota
//             const polyline = L.polyline(latlngs, {
//               color: "#6c63ff",
//               weight: 4,
//             }).addTo(map);

//             // Ajusta o mapa para a rota
//             map.fitBounds(polyline.getBounds());

//             setRoute(polyline);
//           }
//         } catch (error) {
//           console.error("Erro ao obter a rota:", error);
//         }
//       };

//       fetchRoute();
//     }

//     return () => {
//       if (route) {
//         map.removeLayer(route); // Remove a rota ao desmontar
//       }
//     };
//   }, [userLocation, destination, map, route]);

//   return null;
// }

// function Address({ id }) {
//   const addresses = useSelector((state) => state.addresses.addressesData);
//   const address = addresses.find((address) => address.id === id);

//   const [userLocation, setUserLocation] = useState(null);

//   if (!address) {
//     return <p>Endereço não encontrado.</p>;
//   }

//   const { street, number, neighborhood, city, type, gps } = address;

//   // Coordenadas do endereço
//   const [latitude, longitude] = gps
//     .split(", ")
//     .map((coord) => parseFloat(coord.trim()));

//   // Obter localização atual do usuário
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUserLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });
//         },
//         () => {
//           console.error("Erro ao obter localização do usuário.");
//         }
//       );
//     }
//   }, []);

//   return (
//     <div className="w-full max-w-lg p-4 border rounded shadow-md mb-52">
//       <h2 className="text-xl font-medium text-center mb-4">
//         Informações do Endereço
//       </h2>
//       <div className="bg-white p-5 rounded-md drop-shadow-lg mb-4 space-y-3 flex items-center gap-4">
//         <span className="text-5xl">
//           {(type === "house" && <MdHouse />) ||
//             (type === "department" && <MdOutlineApartment />) ||
//             (type === "store" && <MdOutlineStorefront />) ||
//             (type === "restaurant" && <MdRestaurant />) ||
//             (type === "hotel" && <MdHotel />)}
//         </span>
//         <div>
//           <p>
//             Rua:{" "}
//             <strong>
//               {street}, {number}
//             </strong>
//           </p>
//           <p className="text-sm">
//             Bairro: <strong>{neighborhood}, </strong>
//           </p>
//           <p className="text-sm">
//             Cidade: <strong>{city}</strong>
//           </p>
//         </div>
//       </div>

//       <div className="mb-6">
//         <MapContainer
//           center={userLocation || [latitude, longitude]} // Centraliza no usuário ou no destino
//           zoom={15}
//           style={{ height: "300px", width: "100%" }}
//           className="rounded border z-0"
//         >
//           <TileLayer
//             url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
//             attribution='&copy; <a href="https://carto.com/">Carto</a> contributors & <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//           />
//           {/* Marcador do endereço */}
//           <Marker position={[latitude, longitude]} icon={pinMapIcon}>
//             <Popup>
//               Endereço: {street}, {number}, {neighborhood}, {city}
//             </Popup>
//           </Marker>
//           {/* Marcador do usuário */}
//           {userLocation && (
//             <Marker
//               position={[userLocation.lat, userLocation.lng]}
//               icon={personIcon}
//             >
//               <Popup>Você está aqui!</Popup>
//             </Marker>
//           )}
//           {/* Rota */}

//           {userLocation && (
//             <Routing
//               userLocation={userLocation}
//               destination={{ lat: latitude, lng: longitude }}
//             />
//           )}
//         </MapContainer>
//       </div>
//       <div className="flex justify-around">
//         <a
//           href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation?.lat},${userLocation?.lng}&destination=${latitude},${longitude}&travelmode=walking`}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Caminhar
//         </a>
//         <a
//           href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation?.lat},${userLocation?.lng}&destination=${latitude},${longitude}&travelmode=driving`}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
//         >
//           Dirigir
//         </a>
//       </div>
//     </div>
//   );
// }

// export default Address;

// Address.propTypes = {
//   id: PropTypes.string.isRequired,
// };

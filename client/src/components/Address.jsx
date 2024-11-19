import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect } from "react";
import {
  MdHouse,
  MdRestaurant,
  MdHotel,
  MdOutlineStorefront,
  MdOutlineApartment,
} from "react-icons/md";

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

function Address({ id }) {
  const addresses = useSelector((state) => state.addresses.addressesData);
  const address = addresses.find((address) => address.id === id);

  const [userLocation, setUserLocation] = useState(null);

  if (!address) {
    return <p>Endereço não encontrado.</p>;
  }

  const { street, number, neighborhood, city, type, gps } = address;

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

  return (
    <div className="w-full max-w-lg p-4 border rounded shadow-md mb-52">
      <h2 className="text-xl font-medium text-center mb-4">
        Informações do Endereço
      </h2>
      <div className="bg-white p-5 rounded-md drop-shadow-lg mb-4 space-y-3 flex items-center gap-4">
        <span className="text-5xl">
          {(type === "house" && <MdHouse />) ||
            (type === "department" && <MdOutlineApartment />) ||
            (type === "store" && <MdOutlineStorefront />) ||
            (type === "restaurant" && <MdRestaurant />) ||
            (type === "hotel" && <MdHotel />)}
        </span>
        <div>
          <p>
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
      </div>

      <div className="mb-6">
        <MapContainer
          center={[latitude, longitude]} // Centraliza o mapa no destino
          zoom={13}
          style={{ height: "200px", width: "100%" }}
          className="rounded border z-0"
        >
          <TileLayer
            url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${
              import.meta.env.VITE_MAPTILER_API_KEY
            }`}
            attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a> & <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
        </MapContainer>
      </div>
      <div className="flex justify-around">
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
      </div>
    </div>
  );
}

export default Address;

Address.propTypes = {
  id: PropTypes.string.isRequired,
};

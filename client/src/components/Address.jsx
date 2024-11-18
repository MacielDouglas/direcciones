import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";

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

  // Componente para centralizar no mapa
  const SetMapView = ({ coords }) => {
    const map = useMap();
    if (coords) {
      map.setView(coords, 13);
    }
    return null;
  };

  return (
    <div className="w-full max-w-lg p-4 border rounded shadow-md mb-52">
      <h2 className="text-xl font-bold mb-4">Informações do Endereço</h2>
      <ul className="mb-6">
        <li>
          <strong>Rua:</strong> {street}
        </li>
        <li>
          <strong>Número:</strong> {number}
        </li>
        <li>
          <strong>Bairro:</strong> {neighborhood}
        </li>
        <li>
          <strong>Cidade:</strong> {city}
        </li>
        <li>
          <strong>Tipo:</strong> {type}
        </li>
        <li>
          <strong>Coordenadas:</strong> {latitude}, {longitude}
        </li>
      </ul>
      <div className="mb-6">
        <MapContainer
          center={[latitude, longitude]}
          zoom={13}
          style={{ height: "350px", width: "100%" }}
          className="rounded border z-0"
        >
          <TileLayer
            url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${
              import.meta.env.VITE_MAPTILER_API_KEY
            }`}
            attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a> & <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* Marcador do endereço */}
          <Marker position={[latitude, longitude]}>
            <Popup>
              Endereço: {street}, {number}, {neighborhood}, {city}
            </Popup>
          </Marker>
          {/* Marcador do usuário */}
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>Você está aqui!</Popup>
            </Marker>
          )}
          <SetMapView
            coords={
              userLocation
                ? [
                    (latitude + userLocation.lat) / 2,
                    (longitude + userLocation.lng) / 2,
                  ]
                : [latitude, longitude]
            }
          />
        </MapContainer>
      </div>
      <div className="flex justify-around">
        <a
          href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation?.lat},${userLocation?.lng}&destination=${latitude},${longitude}&travelmode=walking`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Caminhar até o Endereço
        </a>
        <a
          href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation?.lat},${userLocation?.lng}&destination=${latitude},${longitude}&travelmode=driving`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Dirigir até o Endereço
        </a>
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

// function Address({ id }) {
//   const addresses = useSelector((state) => state.addresses.addressesData);

//   const address = addresses.find((address) => address.id === id);
//   console.log(address);
//   return <div>Address</div>;
// }

// export default Address;
// Address.propTypes = {
//   id: PropTypes.string.isRequired,
// };

import { useState } from "react";
import { useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Ícones personalizados para os marcadores
const yellowIcon = new L.Icon({
  iconUrl: "pinMapRed.svg", // Substitua pelo caminho correto do ícone amarelo
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const blueIcon = new L.Icon({
  iconUrl: "pinMap.svg", // Substitua pelo caminho correto do ícone azul
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const greenIcon = new L.Icon({
  iconUrl: "pinMapGreen.svg", // Substitua pelo caminho correto do ícone verde
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function NewCardManual() {
  const addresses = useSelector((state) => state.addresses.addressesData);
  const cards = useSelector((state) => state.cards.cardsData?.card || []);
  const [selectedAddresses, setSelectedAddresses] = useState([]);

  // Obter localização inicial do mapa (primeiro endereço ou fallback para coordenadas padrão)
  const defaultLocation = [0, 0]; // Substitua por coordenadas padrão ou um centro inicial relevante.
  const mapCenter = Object.values(addresses).length
    ? Object.values(addresses)[0].gps.split(", ").map(Number)
    : defaultLocation;

  // Filtra os endereços disponíveis
  const availableAddresses = Object.values(addresses).filter((address) => {
    return !cards.some((card) => card.street.includes(address.id));
  });

  // Alterna a seleção de endereços
  const toggleSelectAddress = (addressId) => {
    setSelectedAddresses((prevSelected) =>
      prevSelected.includes(addressId)
        ? prevSelected.filter((id) => id !== addressId)
        : [...prevSelected, addressId]
    );
  };

  // Define o ícone com base no estado do endereço
  const getIcon = (addressId) => {
    if (selectedAddresses.includes(addressId)) return greenIcon;
    if (cards.some((card) => card.street.includes(addressId)))
      return yellowIcon;
    return blueIcon;
  };

  // Função para criar um novo card
  const createCard = () => {
    console.log("Selected addresses for card creation:", selectedAddresses);
    // Adicione a lógica para criar o card aqui
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md mb-32">
      <h3 className="text-xl font-semibold mb-4">Select Addresses on Map</h3>
      <div className="h-[300px] w-full rounded-md overflow-hidden border">
        <MapContainer
          center={mapCenter}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {Object.values(addresses).map((address) => {
            const [lat, lng] = address.gps.split(", ").map(Number);
            const isSelected = selectedAddresses.includes(address.id);
            const hasCard = cards.some((card) =>
              card.street.includes(address.id)
            );
            return (
              <Marker
                key={address.id}
                position={[lat, lng]}
                icon={getIcon(address.id)}
                eventHandlers={{
                  click: () => {
                    if (!hasCard) toggleSelectAddress(address.id);
                  },
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
                      {hasCard ? (
                        <span className="inline-block px-2 py-1 text-xs rounded bg-yellow-600 text-white">
                          Has Card
                        </span>
                      ) : isSelected ? (
                        <span className="inline-block px-2 py-1 text-xs rounded bg-green-600 text-white">
                          Selected
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs rounded bg-blue-600 text-white">
                          Available
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
      {selectedAddresses.length > 0 && (
        <button
          onClick={createCard}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Card
        </button>
      )}
    </div>
  );
}

export default NewCardManual;

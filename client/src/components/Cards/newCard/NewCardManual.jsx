import { useState } from "react";
import { useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { NEW_CARD } from "./../../../graphql/mutation/cards.mutation";
import { useNavigate } from "react-router-dom";
import Loading from "../../../context/Loading";

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
  const [loading, setLoading] = useState(false); // Estado para gerenciar o loading
  const navigate = useNavigate();

  const [newCard] = useMutation(NEW_CARD, {
    onCompleted: async (data) => {
      // Adicionar delay mínimo de 2 segundos
      setTimeout(() => {
        setLoading(false);
        toast.success(data.cardMutation.message);
        navigate("/cards?tab=asignar");
      }, 2000);
    },
    onError: (error) => {
      // Adicionar delay mínimo de 2 segundos
      setTimeout(() => {
        setLoading(false);
        toast.error(`Error al crear una nueva tarjeta: ${error.message}`);
      }, 2000);
    },
  });

  const handleCreateCard = async (e) => {
    e.preventDefault();

    setLoading(true); // Ativar estado de loading

    try {
      await newCard({
        variables: {
          action: "create",
          newCard: {
            street: selectedAddresses,
          },
        },
      });
    } catch (error) {
      console.error("Error al crear una nueva tarjeta: ", error.message);
      // Garantir que o loading será desativado após 2 segundos
      setTimeout(() => setLoading(false), 2000);
    }
  };

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

  if (loading) {
    return <Loading text={"Creando una nueva tarjeta..."} />;
  }

  return (
    <div className="flex flex-col md:flex-row  h-full w-full">
      {/* Lista de endereços */}
      <div className="p-6 flex flex-col gap-4 md:w-2/3 border-r md:overflow-y-auto max-h-full">
        <h3 className="text-xl font-semibold">
          Seleccione las direcciones disponibles
        </h3>
        <p className="text-sm">
          Puedes seleccionar direcciones desde esta lista o directamente en el
          mapa.
        </p>
        <div className="overflow-y-auto border p-4 rounded max-h-[30vh] bg-primary">
          {availableAddresses.length ? (
            availableAddresses.map((address) => (
              <div
                key={address.id}
                className="flex items-center text-sm lg:text-lg justify-between border-b py-2"
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
          className="mt-4 px-6 py-2 border border-secondary text-sm lg:text-lg   hover:bg-secondary hover:text-primary transition-colors"
        >
          {showSelectedOnly ? "Mostrar todos" : "Mostrar seleccionados"}
        </button>
        <button
          onClick={handleCreateCard}
          className="mt-4 px-6 py-2 border border-secondary hover:bg-secondary hover:text-primary transition-colors text-sm lg:text-lg disabled:border-gray-200 disabled:text-gray-200 disabled:cursor-not-allowed disabled:hover:bg-primary"
          disabled={selectedAddresses.length === 0}
        >
          Crear tarjeta
        </button>
      </div>

      {/* Mapa */}
      <div className="lg:flex-grow md:relative w-full h-full">
        <MapContainer
          center={mapCenter}
          zoom={14}
          className="h-full w-full min-h-[400px] max-h-[100%] z-0 object-cover"
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

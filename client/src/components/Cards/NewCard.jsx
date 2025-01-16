import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { NEW_CARD } from "../../graphql/mutation/cards.mutation";
import Loading from "../../context/Loading";
import {
  MdHouse,
  MdRestaurant,
  MdHotel,
  MdOutlineStorefront,
  MdOutlineApartment,
} from "react-icons/md";

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

function NewCard() {
  const addresses = useSelector((state) => state.addresses.addressesData);
  const cards = useSelector((state) => state.cards.cardsData?.card || []);
  const [selectedAddresses, setSelectedAddresses] = useState([]);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [newCard] = useMutation(NEW_CARD, {
    onCompleted: async (data) => {
      setTimeout(() => {
        setLoading(false);
        toast.success(data.cardMutation.message);
        navigate("/cards?tab=asignar");
      }, 2000);
    },
    onError: (error) => {
      setTimeout(() => {
        setLoading(false);
        toast.error(`Error al crear una nueva tarjeta: ${error.message}`);
      }, 2000);
    },
  });

  const handleCreateCard = async (e) => {
    e.preventDefault();

    setLoading(true);

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
      setTimeout(() => setLoading(false), 2000);
    }
  };

  const availableAddresses = Object.values(addresses).filter(
    (address) => !cards.some((card) => card.street.includes(address.id))
  );

  const toggleSelectAddress = (addressId) => {
    setSelectedAddresses((prevSelected) =>
      prevSelected.includes(addressId)
        ? prevSelected.filter((id) => id !== addressId)
        : [...prevSelected, addressId]
    );
  };

  const getIcon = (addressId) => {
    if (selectedAddresses.includes(addressId)) return greenIcon;
    return blueIcon;
  };

  const displayedAddresses = showSelectedOnly
    ? availableAddresses.filter((address) =>
        selectedAddresses.includes(address.id)
      )
    : availableAddresses;

  const defaultLocation = [0, 0];
  const mapCenter = availableAddresses.length
    ? availableAddresses[0].gps.split(", ").map(Number)
    : defaultLocation;

  if (loading) {
    return <Loading text={"Creando una nueva tarjeta..."} />;
  }

  const typeIcons = useMemo(
    () => ({
      house: <MdHouse />,
      department: <MdOutlineApartment />,
      store: <MdOutlineStorefront />,
      restaurant: <MdRestaurant />,
      hotel: <MdHotel />,
    }),
    []
  );

  return (
    <div className="min-h-screen bg-details p-3 md:p-10  flex justify-center">
      <motion.div
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-medium text-gray-700 mb-6">
          Crear Tarjetas
        </h1>
        {addresses && (
          <>
            <p>
              Actualmente hay{" "}
              <span className="font-semibold">{addresses.length}</span>{" "}
              direcciones al total.
            </p>
            <p>
              <span className="font-semibold">{availableAddresses.length}</span>{" "}
              direcciones disponibles.{" "}
            </p>
            <p>
              <span className="font-semibold">{cards.length}</span> tarjetas
              creadas.
            </p>
          </>
        )}

        <div>
          <div className="flex flex-col md:flex-row my-3 h-full w-full  bg-white">
            <div className="border-t border-stone-50 flex flex-col gap-4 md:w-2/3 border-r md:overflow-y-auto max-h-full">
              <h3 className="text-xl font-semibold">
                Seleccione las direcciones disponibles
              </h3>
              <p className="text-sm">
                Puedes seleccionar direcciones desde esta lista o directamente
                en el mapa.
              </p>
              <div className="overflow-y-auto border p-4 rounded max-h-[30vh] bg-primary">
                {availableAddresses.length ? (
                  availableAddresses.map((address) => (
                    <div
                      key={address.id}
                      className="flex items-center text-sm lg:text-lg justify-between border-b py-2"
                    >
                      <div className="w-full flex items-center gap-3">
                        <img
                          src={address.photo}
                          className="object-cover w-24"
                          alt={`Foto de la calle: ${address.street}, ${address.number}`}
                        />
                        <div>
                          <span className="text-lg">
                            {typeIcons[address.type]}
                          </span>
                          <p>
                            <strong>{address.street}</strong>, {address.number}
                          </p>
                          <p>
                            {address.neighborhood}, {address.city}
                          </p>
                        </div>
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
                  <p className="text-gray-500">
                    No hay direcciones disponibles.
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowSelectedOnly(!showSelectedOnly)}
                className="px-6 py-2 border border-secondary text-sm lg:text-lg hover:bg-secondary hover:text-primary transition-colors"
              >
                {showSelectedOnly ? "Mostrar todos" : "Mostrar seleccionados"}
              </button>
              <button
                onClick={handleCreateCard}
                className="mb-5 px-6 py-2 border border-secondary hover:bg-secondary hover:text-primary transition-colors text-sm lg:text-lg disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-primary"
                disabled={selectedAddresses.length === 0}
              >
                Crear tarjeta
              </button>
            </div>

            <div className="md:ml-3 lg:flex-grow md:relative w-full h-full">
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
                          <img
                            src={address.photo}
                            className="object-cover w-36"
                            alt={`Foto de la calle: ${address.street}, ${address.number}`}
                          />
                          <p>
                            <span className="text-3xl">
                              {typeIcons[address.type]}
                            </span>
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
        </div>
      </motion.div>
    </div>
  );
}

export default NewCard;

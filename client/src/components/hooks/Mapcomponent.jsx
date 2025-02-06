import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import PropTypes from "prop-types";

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

function MapComponent({ addresses, selectedAddresses, setSelectedAddresses }) {
  const toggleSelectAddress = (addressId) => {
    setSelectedAddresses((prevSelected) =>
      prevSelected.includes(addressId)
        ? prevSelected.filter((id) => id !== addressId)
        : [...prevSelected, addressId]
    );
  };

  const getIcon = (addressId) => {
    return selectedAddresses.includes(addressId) ? greenIcon : blueIcon;
  };

  const defaultLocation = [0, 0];
  const mapCenter = addresses.length
    ? addresses[0].gps.split(", ").map(Number)
    : defaultLocation;

  return (
    <MapContainer
      center={mapCenter}
      zoom={14}
      className="min-h-[250px] z-0 object-cover"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {addresses.map((address) => {
        const [lat, lng] = address.gps.split(", ").map(Number);
        return (
          <Marker
            key={address.id}
            position={[lat, lng]}
            icon={getIcon(address.id)}
            eventHandlers={{ click: () => toggleSelectAddress(address.id) }}
          >
            <Popup>
              <div className="text-sm">
                <img
                  src={address.photo}
                  className="object-cover w-36"
                  alt={`Foto de ${address.street}, ${address.number}`}
                />
                <p>
                  <strong>{address.street}</strong>, {address.number}
                </p>
                <p>
                  {address.neighborhood}, {address.city}
                </p>
                <p className="mt-2">
                  {selectedAddresses.includes(address.id) ? (
                    <span className="inline-block px-2 py-1 text-xs rounded bg-green-600 text-white">
                      Selecionado
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-1 text-xs rounded bg-blue-600 text-white">
                      Disponível
                    </span>
                  )}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

MapComponent.propTypes = {
  addresses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      gps: PropTypes.string.isRequired,
      photo: PropTypes.string,
      street: PropTypes.string,
      number: PropTypes.string,
      neighborhood: PropTypes.string,
      city: PropTypes.string,
    })
  ).isRequired,
  selectedAddresses: PropTypes.arrayOf(PropTypes.string).isRequired,
  setSelectedAddresses: PropTypes.func.isRequired,
};

export default MapComponent;

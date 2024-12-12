import { useMemo, useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import L from "leaflet";
import {
  MdHouse,
  MdRestaurant,
  MdHotel,
  MdOutlineStorefront,
  MdOutlineApartment,
} from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

// Ícones personalizados para os marcadores
const createCustomIcon = (iconUrl) =>
  new L.Icon({
    iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

const personIcon = createCustomIcon("person.svg");
const pinMapIcon = createCustomIcon("pinMap.svg");

// Componente de Roteamento
function Routing({ userLocation, destination }) {
  const map = useMap();
  const [route, setRoute] = useState(null);
  let isMounted = true; // Verifica se o componente está montado

  const fetchRoute = useCallback(async () => {
    if (!map || !userLocation || !destination) return;

    const url = `https://router.project-osrm.org/route/v1/walking/${userLocation.lng},${userLocation.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data?.routes?.length && isMounted) {
        const coordinates = data.routes[0].geometry.coordinates;
        const latlngs = coordinates.map(([lng, lat]) => [lat, lng]);

        const polyline = L.polyline(latlngs, {
          color: "#6c63ff",
          weight: 4,
        });

        if (isMounted) {
          polyline.addTo(map);
          setRoute(polyline);
        }
      }
    } catch (error) {
      console.error("Erro ao obter a rota:", error);
    }
  }, [map, userLocation, destination]);

  useEffect(() => {
    fetchRoute();

    return () => {
      isMounted = false;
      if (route) {
        route.remove();
      }
    };
  }, [fetchRoute, route]);

  return null;
}

// Componente principal
function Address({ id }) {
  const addresses = useSelector((state) => state.addresses.addressesData);
  const address = addresses.find((address) => address.id === id);
  const navigate = useNavigate();

  const [userLocation, setUserLocation] = useState(null);

  if (!address) {
    return <p>Endereço não encontrado.</p>;
  }

  const { street, number, neighborhood, city, type, gps, complement } = address;

  const [latitude, longitude] = useMemo(
    () => gps.split(", ").map((coord) => parseFloat(coord.trim())),
    [gps]
  );

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation((prevLocation) => {
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            return prevLocation?.lat === newLocation.lat &&
              prevLocation?.lng === newLocation.lng
              ? prevLocation
              : newLocation;
          });
        },
        (error) => {
          console.error("Erro ao obter localização do usuário:", error);
        }
      );
    }
  }, []);

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

  const handleEdit = () => {
    navigate(`/address?tab=update-address&id=${id}`);
    console.log("Id do Addresses...", id);
  };

  return (
    <div className="w-full justify-center flex">
      <div className="max-w-lg p-4 border rounded shadow-md">
        <h2 className="text-xl font-medium text-center mb-4">
          Informaciones de la dirección
        </h2>
        <div className="bg-white p-5 rounded-md drop-shadow-lg mb-4 space-y-3">
          <div className="flex gap-5 justify-between">
            <span className="text-5xl self-center">{typeIcons[type]}</span>
            <div className="text-sm">
              <p className="text-xl mb-2">
                Rua: <strong>{`${street}, ${number}`}</strong>
              </p>
              <p>
                Bairro: <strong>{neighborhood}</strong>
              </p>
              <p>
                Cidade: <strong>{city}</strong>
              </p>
            </div>
            <Link
              to={`https://www.google.com/maps/dir/?api=1&origin=${userLocation?.lat},${userLocation?.lng}&destination=${latitude},${longitude}&travelmode=walking`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-4xl font-semibold self-center"
            >
              IR
            </Link>
          </div>
          <div className="flex justify-center bg-secondary text-primary">
            {/* <button className="w-full" onClick={handleEditClick(id)}>
              Editar
            </button> */}
          </div>
          {complement && (
            <div className="border-t border-gray-200 mt-2 pt-2">
              <p>{complement}</p>
            </div>
          )}
          <div className="flex justify-center">
            <button
              className="bg-secondary text-primary w-full p-2"
              onClick={handleEdit}
            >
              editar
            </button>
          </div>
        </div>

        <div>
          <MapContainer
            center={[latitude, longitude]}
            zoom={15}
            style={{ height: "300px", width: "100%" }}
            className="rounded border z-0"
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">Carto</a> contributors & <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <Marker position={[latitude, longitude]} icon={pinMapIcon}>
              <Popup>{`${street}, ${number}, ${neighborhood}, ${city}`}</Popup>
            </Marker>
            {userLocation && (
              <Marker
                position={[userLocation.lat, userLocation.lng]}
                icon={personIcon}
              >
                <Popup>Você está aqui!</Popup>
              </Marker>
            )}
            {userLocation && (
              <Routing
                userLocation={userLocation}
                destination={{ lat: latitude, lng: longitude }}
              />
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default Address;

Routing.propTypes = {
  userLocation: PropTypes.object,
  destination: PropTypes.object,
};

Address.propTypes = {
  id: PropTypes.string.isRequired,
};

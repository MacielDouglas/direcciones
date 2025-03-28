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
import { FaRoute } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { calculateDistance } from "../constants/direccion";

const createCustomIcon = (iconUrl) =>
  new L.Icon({
    iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

const personIcon = createCustomIcon("person.svg");
const pinMapIcon = createCustomIcon("pinMap.svg");

function Routing({ userLocation, destination }) {
  const map = useMap();
  const [route, setRoute] = useState(null);
  const [isMounted, setIsMounted] = useState(true);

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
  }, [map, userLocation, destination, isMounted]);

  useEffect(() => {
    fetchRoute();

    return () => {
      setIsMounted(false);
      if (route) {
        route.remove();
      }
    };
  }, [fetchRoute, route]);

  return null;
}

function Address({ id }) {
  const addresses = useSelector((state) => state.addresses.addressesData);
  const address = addresses.find((address) => address.id === id);
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);

  const {
    street,
    number,
    neighborhood,
    city,
    type,
    gps,
    complement,
    confirmed,
    photo,
  } = address;
  const [latitude, longitude] = useMemo(
    () => gps.split(", ").map(parseFloat),
    [gps]
  );

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (position) =>
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      (error) => console.error("Erro ao obter localização do usuário:", error)
    );
  }, []);

  const distance =
    userLocation && latitude && longitude
      ? calculateDistance(
          userLocation.lat,
          userLocation.lng,
          latitude,
          longitude
        ).toFixed(0)
      : "N/A";

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

  if (!address) return <p className="text-center">Endereço não encontrado.</p>;

  const openMap = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation?.lat},${userLocation?.lng}&destination=${latitude},${longitude}&travelmode=walking`;
    // const wazeUrl = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
    const appleMapsUrl = `maps://maps.apple.com/?saddr=${userLocation?.lat},${userLocation?.lng}&daddr=${latitude},${longitude}&dirflg=w`;

    if (navigator.userAgent.match(/iPhone|iPad|Mac/i)) {
      window.location.href = appleMapsUrl;
    } else if (navigator.userAgent.match(/Android/i)) {
      window.location.href = googleMapsUrl;
    } else {
      window.open(googleMapsUrl, "_blank");
    }
  };

  const handleEdit = () => navigate(`/address?tab=update-address&id=${id}`);

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      <div
        className={`p-5 rounded-md mb-4 ${
          confirmed ? "bg-primary" : "bg-red-100"
        }`}
      >
        <h2 className="text-xl font-medium text-center mb-4">
          Información de la dirección
        </h2>
        {photo && (
          <img
            src={photo}
            className="w-full h-48 object-cover rounded-md mb-3"
            alt={street}
          />
        )}
        <p
          className={`text-center font-bold ${
            confirmed ? "text-green-600" : "text-red-600"
          }`}
        >
          {confirmed ? "Dirección confirmada" : "Necesita confirmación"}
        </p>
        <div className="flex flex-col items-center space-y-3 text-sm">
          <div className="flex justify-between items-center w-full">
            <span className="text-5xl">{typeIcons[type]}</span>
            <div className="flex items-center gap-3 text-4xl ">
              <FaRoute />
              <p className="col-span-1 justify-self-end w-full text-2xl">
                {distance >= 1000
                  ? `${(distance / 1000).toFixed(2)}km`
                  : `${distance}m`}
              </p>
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
            onClick={openMap}
            className="bg-blue-500 text-white px-3 py-1 rounded-md mt-2"
          >
            ver en el mapa
          </button>
        </div>
        {complement && <p className="mt-2 text-center">{complement}</p>}

        <button
          className="w-full bg-black text-white py-2 rounded-md mt-3"
          onClick={handleEdit}
        >
          Editar dirección
        </button>
      </div>
      <div className="w-full h-72 rounded-md overflow-hidden ">
        <MapContainer
          center={[latitude, longitude]}
          zoom={15}
          className="h-full w-full z-10"
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
          <Marker position={[latitude, longitude]} icon={pinMapIcon}>
            <Popup>{`${street}, ${number}, ${neighborhood}, ${city}`}</Popup>
          </Marker>
          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={personIcon}
            >
              <Popup>¡Usted está aquí!</Popup>
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

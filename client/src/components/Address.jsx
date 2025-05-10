import { useMemo, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { useMutation } from "@apollo/client";
import { UPDATE_ADDRESS } from "../graphql/mutation/address.mutation";
import { toast } from "react-toastify";
import { setAddresses } from "../store/addressesSlice";
import ImageWithModal from "./hooks/ImageWithModal";

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
  const dispatch = useDispatch();
  const addresses = useSelector((state) => state.addresses);
  const address = addresses.addressesData.find((address) => address.id === id);
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [updateAddress, { loading }] = useMutation(UPDATE_ADDRESS, {
    onCompleted: (data) => {
      const updateAdd = data?.updateAddress?.address;

      if (!updateAdd) {
        toast.error("A resposta da API não retornou um endereço válido.");
        return;
      }

      toast.success("Endereço atualizado com sucesso!");

      dispatch(
        setAddresses({
          addresses: addresses.addressesData.map((addr) =>
            addr.id === updateAdd.id ? updateAdd : addr
          ),
        })
      );
      setIsModalOpen(false);
      navigate(`/address?tab=/address/${updateAdd.id}`);
    },

    onError: (error) => {
      toast.error(`Erro ao atualizar endereço: ${error.message}`);
    },
  });

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
    active,
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

  const handleCancelAddress = async () => {
    const { __typename, createdAt, ...addressy } = address;
    const updateAdd = {
      ...addressy,
      active: !address.active, // alterna true <-> false
    };

    await updateAddress({
      variables: {
        input: updateAdd,
      },
    });

    setIsModalOpen(false);
  };

  return (
    <div
      className={`w-full max-w-md pt-4  mx-auto shadow-lg rounded-lg ${
        !active ? "bg-red-100 text-red-800" : "bg-white"
      }`}
    >
      <div
        className={`p-5 m-4  rounded-md mb-4 ${
          !active ? "bg-red-300" : confirmed ? "bg-gray-100" : "bg-orange-200"
        }`}
      >
        <h2 className="text-xl font-medium text-center mb-4">
          Información de la dirección
        </h2>
        {photo && <ImageWithModal photo={photo} street={street} />}
        <p
          className={`text-center font-bold ${
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
        <button
          className={`w-full text-white py-2 rounded-md mt-3 ${
            !active ? "bg-green-500" : "bg-red-500"
          }`}
          onClick={() => setIsModalOpen(true)}
        >
          {!active ? "Activar dirección" : "Desactivar dirección"}
        </button>
      </div>
      <div className="w-full h-72 pb-10 overflow-hidden ">
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
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg p-6 max-w-lg min-w-80 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              ¿Estás seguro que deseas {active ? "DESACTIVAR" : "ACTIVAR"} esta
              dirección?
            </h2>

            <div className="mt-6 flex justify-center gap-4">
              <button
                className="bg-secondary text-white px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                No, cancelar
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleCancelAddress}
              >
                Sí, confirmo
              </button>
            </div>
          </div>
        </div>
      )}
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

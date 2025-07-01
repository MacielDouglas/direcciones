import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import {
  Bed,
  Home,
  Hotel,
  MapPin,
  MapPinHouse,
  Store,
  Utensils,
} from "lucide-react";
import { selectAllAddresses } from "../../store/selectors/addressSelectors";
import { calculateDistance } from "../../constants/address";
import PhotoAddress from "./components/PhotoAddress";
import AddressSkeleton from "./components/skeletons/AddressSkeleton";

import { useNavigate } from "react-router-dom";
import { selectIsSS } from "../../store/selectors/userSelectors";
import { useMutation } from "@apollo/client";
import { DELETE_ADDRESS } from "../../graphql/mutations/address.mutations";
import { setAddresses } from "../../store/addressSlice";
import ScrollToTop from "../../context/ScrollToTop";
import ButtonEditAddress from "./components/buttons/ButtonEditAddress";
import DisableAddressButton from "./components/buttons/DisableAddressButton";
import MapSection from "./components/MapSection";
import { useToastMessage } from "../../hooks/useToastMessage";

type AddressProps = {
  id: string;
};

type Location = {
  lat: number;
  lng: number;
};

const Address: React.FC<AddressProps> = ({ id }) => {
  const isSS = useSelector(selectIsSS);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addresses = useSelector(selectAllAddresses);
  const address = useMemo(
    () => addresses.find((a) => a.id === id),
    [addresses, id]
  );
  const { showToast } = useToastMessage();

  const [deleteAddressInput] = useMutation(DELETE_ADDRESS, {
    onCompleted: async (data) => {
      console.log(data);
      dispatch(
        setAddresses({
          addresses: addresses.filter(
            (a) => a.id !== data.deleteAddress.address.id
          ),
        })
      );
      showToast({
        message: "¡Dirección eliminada exitosamente!",
        type: "success",
      });

      navigate("/addresses");
    },
    onError: (error) => {
      showToast({
        message: `¡Error al eliminar la dirección!: ${error}`,
        type: "error",
      });
    },
  });

  const gps = address?.gps;

  const [latitude, longitude] = useMemo(() => {
    if (typeof gps === "string") {
      const [lat, lng] = gps.split(", ").map(parseFloat);
      return [lat, lng];
    }
    return [undefined, undefined];
  }, [gps]);

  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      (err) => console.error("Erro ao obter localização do usuário:", err)
    );
  }, []);

  const device = useMemo(() => {
    const ua = navigator.userAgent;
    if (/iPhone|iPad/i.test(ua)) return "ios";
    if (/Android/i.test(ua)) return "android";
    return "desktop";
  }, []);

  if (!address) return <AddressSkeleton />;

  const {
    street = "",
    number = "",
    neighborhood = "",
    city = "",
    type,
    confirmed,
    photo = "",
    active,
    complement = "",
    customName = "",
  } = address;

  const distance =
    userLocation && latitude && longitude
      ? calculateDistance(
          userLocation.lat,
          userLocation.lng,
          latitude,
          longitude
        ).toFixed(0)
      : null;

  const typeIcons: Record<string, JSX.Element> = {
    house: <Home size={28} />,
    department: <Hotel size={28} />,
    store: <Store size={28} />,
    restaurant: <Utensils size={28} />,
    hotel: <Bed size={28} />,
  };

  const handleOpenMap = (app: "google" | "waze" | "apple") => {
    const origin = userLocation
      ? `${userLocation.lat},${userLocation.lng}`
      : "";
    const destination = `${latitude},${longitude}`;

    const urls = {
      google: `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=walking`,
      waze: `https://waze.com/ul?ll=${destination}&navigate=yes`,
      apple: `maps://maps.apple.com/?saddr=${origin}&daddr=${destination}&dirflg=w`,
    };

    window.open(urls[app], "_blank");
    setIsModalOpen(false);
  };

  // const handleEdit = () => navigate(`/addresses?tab=update-address&id=${id}`);

  const handleDelete = async () => {
    await deleteAddressInput({
      variables: { deleteAddressId: id },
    });
  };

  return (
    <div className="w-full h-full bg-second-lgt dark:bg-tertiary-drk text-primary-drk dark:text-primary-lgt rounded-2xl max-w-md sm:max-w-2xl mx-auto p-2">
      <ScrollToTop />
      <div className="space-y-1 p-6">
        <div className="flex items-center gap-3">
          <MapPinHouse
            className="text-[var(--color-destaque-primary)]"
            size={20}
          />
          <h1 className="text-2xl font-semibold">
            Información de la dirección
          </h1>
        </div>

        {customName && (
          <h2 className="font-semibold text-xl"> - {customName}</h2>
        )}
      </div>
      <div
        className={`bg-primary-lgt dark:bg-primary-drk shadow-sm rounded-2xl overflow-hidden ${
          !active && "!bg-orange-950 text-primary-lgt"
        }`}
      >
        <MapSection showUserCards={false} singleAddressId={id} />

        <div className="p-4 space-y-6">
          <PhotoAddress hei="h-20" photo={photo} street={street} />

          <p
            className={`text-center font-semibold text-lg ${
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
          <div className="space-y-8">
            <div className="flex justify-between items-center text-sm">
              <span>{typeIcons[type]}</span>
              {address.customName && (
                <p className="text-lg text-neutral-500">{address.customName}</p>
              )}
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span className="font-medium">
                  {distance
                    ? Number(distance) >= 1000
                      ? `${(Number(distance) / 1000).toFixed(1)}km`
                      : `${distance}m`
                    : "N/A"}
                </span>
              </div>
            </div>

            <p className="text-xl font-semibold">
              Calle: {`${street}, ${number}`}
            </p>

            <div className="flex justify-between text-sm">
              <p>
                Barrio: <strong>{neighborhood}</strong>
              </p>
              <p>
                Ciudad: <strong>{city}</strong>
              </p>
            </div>

            <div className="w-full bg-tertiary-lgt dark:bg-tertiary-drk p-4 rounded-md text-sm">
              <p>{complement}</p>
            </div>
          </div>
          <button
            onClick={() => [setIsModalOpen(true), setIsDeleteOpen(false)]}
            className="bg-blue-600 text-white w-full py-3 rounded-md text-sm shadow-md mt-2"
          >
            Ver en el mapa
          </button>
          <div className="flex gap-5 font-semibold">
            <ButtonEditAddress id={id} />
            <DisableAddressButton id={id} setIsDeleteOpen={setIsDeleteOpen} />
          </div>
          {isSS && (
            <button
              onClick={() => [setIsModalOpen(true), setIsDeleteOpen(true)]}
              className="bg-red-600 text-white w-full py-3 rounded-md text-sm shadow-md mt-2"
            >
              Deletar Dirección
            </button>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 "
          onClick={() => setIsModalOpen(false)}
        >
          {isDeleteOpen ? (
            <>
              <div
                className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg w-full max-w-xl p-4 "
                onClick={() => setIsDeleteOpen(false)}
              >
                <h2 className="text-2xl font-semibold mb-4 text-center">
                  ¿Estás seguro de que deseas eliminar esta dirección?
                </h2>
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => handleDelete()}
                    className="w-full bg-red-600 text-white py-2 rounded-lg"
                  >
                    ELIMINAR DIRECCIÓN
                  </button>{" "}
                  <button
                    onClick={() => [
                      setIsModalOpen(false),
                      setIsDeleteOpen(false),
                    ]}
                    className="w-full py-2 text-sm text-gray-500 dark:text-gray-300 mt-2"
                  >
                    Cancelar
                  </button>{" "}
                </div>
              </div>
            </>
          ) : (
            <div
              className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg w-full max-w-xs p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-base font-semibold mb-4 text-center">
                Abrir com:
              </h2>
              <div className="flex flex-col gap-3">
                {(device === "android" || device === "ios") && (
                  <>
                    <button
                      onClick={() => handleOpenMap("google")}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg"
                    >
                      Google Maps
                    </button>
                    <button
                      onClick={() => handleOpenMap("waze")}
                      className="w-full bg-purple-600 text-white py-2 rounded-lg"
                    >
                      Waze
                    </button>
                  </>
                )}

                {device === "ios" && (
                  <button
                    onClick={() => handleOpenMap("apple")}
                    className="w-full bg-black text-white py-2 rounded-lg"
                  >
                    Apple Maps
                  </button>
                )}

                {device === "desktop" && (
                  <button
                    onClick={() => handleOpenMap("google")}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg"
                  >
                    Abrir no Google Maps
                  </button>
                )}

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-2 text-sm text-gray-500 dark:text-gray-300 mt-2"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Address;

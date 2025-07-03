import React, { useMemo } from "react";
import type { AddressData } from "../../../types/address.types";

type Location = {
  lat: number;
  lng: number;
};

type ModalAddressProps = {
  address: AddressData;
  isDeleteOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  setIsDeleteOpen: (value: boolean) => void;
  handleDelete: () => void | Promise<void>;
  handleReturnCard?: () => void | Promise<void>;
  userLocation: Location | null;
  isReturnCard: boolean;
};

const ModalAddress: React.FC<ModalAddressProps> = ({
  address,
  setIsModalOpen,
  isDeleteOpen,
  setIsDeleteOpen,
  handleDelete,
  userLocation,
  isReturnCard,
  handleReturnCard,
}) => {
  const device = useMemo(() => {
    const ua = navigator.userAgent;
    if (/iPhone|iPad/i.test(ua)) return "ios";
    if (/Android/i.test(ua)) return "android";
    return "desktop";
  }, []);

  const gps = address?.gps;

  const [latitude, longitude] = useMemo(() => {
    if (typeof gps === "string") {
      const [lat, lng] = gps.split(", ").map(parseFloat);
      return [lat, lng];
    }
    return [undefined, undefined];
  }, [gps]);

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

  return (
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
                onClick={() => [setIsModalOpen(false), setIsDeleteOpen(false)]}
                className="w-full py-2 text-sm text-gray-500 dark:text-gray-300 mt-2"
              >
                Cancelar
              </button>{" "}
            </div>
          </div>
        </>
      ) : isReturnCard ? (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-[90%] max-w-md shadow-xl relative text-xl">
            <h2>¿Estás seguro de que deseas devolver esta tarjeta.</h2>
            <div className="mt-6 flex justify-end gap-4">
              <button
                className="bg-zinc-950 text-white px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleReturnCard}
              >
                Devolver
              </button>
            </div>
          </div>
        </div>
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
  );
};

export default ModalAddress;

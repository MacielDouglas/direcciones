import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import type { AddressFormData } from "../types/adress.types";

const isValidLat = (lat: string) =>
  /^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/.test(lat);

const isValidLng = (lng: string) =>
  /^-?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/.test(lng);

const extractCoords = (value: string) => {
  const cleaned = value.replace(/[()]/g, "").trim();
  const parts = cleaned.split(",").map((s) => s.trim());
  if (parts.length !== 2) return null;
  const [lat, lng] = parts;
  return { lat, lng };
};

interface GpsInputProps {
  setFormData: React.Dispatch<React.SetStateAction<AddressFormData>>;
  formData: AddressFormData;
}

const GpsInput = ({ setFormData, formData }: GpsInputProps) => {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [error, setError] = useState("");
  const [isFetchingGps, setIsFetchingGps] = useState(false);

  const updateGps = useCallback(
    (latitude: string, longitude: string) => {
      if (!isValidLat(latitude) || !isValidLng(longitude)) {
        setError("Latitude ou longitude inválida.");
        setFormData((prev) => ({ ...prev, gps: "" }));
        return;
      }

      const formatted = `${parseFloat(latitude)}, ${parseFloat(longitude)}`;
      setFormData((prev) => ({ ...prev, gps: formatted }));
      setError("");
    },
    [setFormData]
  );

  useEffect(() => {
    if (lat && lng) updateGps(lat, lng);
  }, [lat, lng, updateGps]);

  useEffect(() => {
    if (formData.gps) {
      const coords = extractCoords(formData.gps);
      if (coords) {
        setLat(coords.lat);
        setLng(coords.lng);
      }
    }
  }, [formData.gps]);

  const handleLocationClick = () => {
    setIsFetchingGps(true);
    if (!navigator.geolocation) {
      setError("Geolocalização não suportada.");
      setIsFetchingGps(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const latStr = coords.latitude.toFixed(6);
        const lngStr = coords.longitude.toFixed(6);
        setLat(latStr);
        setLng(lngStr);
        updateGps(latStr, lngStr);
        setIsFetchingGps(false);
      },
      (err) => {
        setError(`Erro ao obter localização: ${err.message}`);
        setIsFetchingGps(false);
      }
    );
  };

  const handleClear = useCallback(() => {
    setLat("");
    setLng("");
    setError("");
    setFormData((prev) => ({ ...prev, gps: "" }));
  }, [setFormData]);

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      const coords = extractCoords(clipboardText);
      if (!coords) {
        setError("Formato inválido. Use: -8.507273, -35.007018");
        return;
      }

      const { lat: pastedLat, lng: pastedLng } = coords;
      if (!isValidLat(pastedLat) || !isValidLng(pastedLng)) {
        setError("Latitude ou longitude inválida.");
        return;
      }

      setLat(pastedLat);
      setLng(pastedLng);
      setError("");
    } catch {
      setError("Não foi possível acessar a área de transferência.");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-600 font-semibold">
        GPS (Lat, Long) *
      </label>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleLocationClick}
          disabled={isFetchingGps}
          className="px-4 py-2 bg-destaque-primary text-white rounded-lg text-sm disabled:opacity-50"
        >
          {isFetchingGps ? "Obtendo..." : "GPS Atual"}
        </button>

        <button
          type="button"
          onClick={handlePaste}
          className="px-4 py-2 bg-second-drk text-white rounded-lg text-sm"
        >
          Colar GPS
        </button>

        <button
          type="button"
          onClick={handleClear}
          disabled={!lat && !lng}
          className="px-4 py-2 bg-tertiary-drk text-white rounded-lg text-sm disabled:opacity-50 border dark:border-neutral-600"
        >
          Limpar
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          className="w-full bg-second-lgt dark:bg-second-drk border border-tertiary-lgt dark:border-tertiary-drk rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-destaque-primary focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Longitude"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          className="w-full bg-second-lgt dark:bg-second-drk border border-tertiary-lgt dark:border-tertiary-drk rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-destaque-primary focus:border-transparent"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!error && lat && lng && (
        <p className="text-blue-600 text-sm">
          Coordenada: {lat}, {lng}
        </p>
      )}

      <div className="mt-6 p-4 bg-[var(--color-second-lgt)] dark:bg-[var(--color-tertiary-drk)] rounded-lg border border-[var(--color-tertiary-lgt)] dark:border-[var(--color-tertiary-drk)]">
        <h3 className="font-medium text-[var(--color-destaque-primary)] flex items-center gap-2">
          Dica rápida
        </h3>
        <p className="text-[var(--color-destaque-second)] dark:text-[var(--color-tertiary-lgt)] text-sm mt-1">
          Puedes obtener las coordenadas GPS utilizando Google Maps. Simplemente
          mantenga presionada la ubicación deseada en el mapa.
        </p>
      </div>
    </div>
  );
};

GpsInput.propTypes = {
  setFormData: PropTypes.func.isRequired,
};

export default GpsInput;

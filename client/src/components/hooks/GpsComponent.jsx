import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const parseDms = (dms) => {
  const regex = /(\d+)°(\d+)'(\d+(?:\.\d+)?)"?([NSWE])/gi;
  const parts = [];
  let match;

  while ((match = regex.exec(dms))) {
    const [_, deg, min, sec, dir] = match;
    let decimal =
      parseFloat(deg) + parseFloat(min) / 60 + parseFloat(sec) / 3600;
    if (["S", "W"].includes(dir.toUpperCase())) decimal *= -1;
    parts.push(decimal);
  }

  return parts.length === 2 ? `${parts[0]}, ${parts[1]}` : null;
};

const normalizeGpsValue = (input) => {
  let value = input.trim();

  if (/\d+°\d+'\d+(\.\d+)?"?[NSWE]/i.test(value)) {
    return parseDms(value);
  }

  value = value.replace(/,/g, ".");

  const spaced = value.match(/^(-?\d+\.\d+)\s+(-?\d+\.\d+)$/);
  if (spaced) return `${spaced[1]}, ${spaced[2]}`;

  const joined = value.match(/^(-?\d+\.\d+)(-\d+\.\d+)$/);
  if (joined) return `${joined[1]}, ${joined[2]}`;

  const spacedLargeInt = value.match(/(-?\d{2})(\d{7,})\s+(-?\d{2})(\d{7,})/);
  if (spacedLargeInt)
    return `${spacedLargeInt[1]}.${spacedLargeInt[2]}, ${spacedLargeInt[3]}.${spacedLargeInt[4]}`;

  const joinedLargeInt = value.match(/(-?\d{2})(\d{7,})(-?\d{2})(\d{7,})/);
  if (joinedLargeInt)
    return `${joinedLargeInt[1]}.${joinedLargeInt[2]}, ${joinedLargeInt[3]}.${joinedLargeInt[4]}`;

  const cleaned = value
    .replace(/[();]/g, "")
    .replace(/\s+/g, "")
    .replace(/\.+/g, ".")
    .replace(/(-?\d+\.\d+)[^\d\-]+(-?\d+\.\d+)/, "$1, $2");

  const final = cleaned.match(/^(-?\d+\.\d+),\s*(-?\d+\.\d+)$/);
  if (final) return `${final[1]}, ${final[2]}`;

  return null;
};

const GpsComponent = ({ setFormData }) => {
  const [gpsInput, setGpsInput] = useState("");
  const [normalizedGps, setNormalizedGps] = useState("");
  const [error, setError] = useState("");
  const [isFetchingGps, setIsFetchingGps] = useState(false);

  const handleLocationClick = (e) => {
    e.preventDefault();
    setIsFetchingGps(true);
    if (!navigator.geolocation) {
      setError("Geolocalização não é suportada pelo navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const formatted = `${coords.latitude}, ${coords.longitude}`;
        setGpsInput(formatted);
        setNormalizedGps(formatted);
        setIsFetchingGps(false);
        setError("");
      },
      (err) => {
        setError("Erro ao obter localização: " + err.message);
        toast.error("No se puede obtener el GPS actual.");
        setIsFetchingGps(false);
      }
    );
  };

  const normalizeInput = useCallback(() => {
    if (!gpsInput.trim()) return;

    const result = normalizeGpsValue(gpsInput);
    if (result) {
      setNormalizedGps(result);
      setError("");
    } else {
      setNormalizedGps("");
      setError("Formato de coordenada inválido.");
    }
  }, [gpsInput]);

  useEffect(() => {
    if (normalizedGps) {
      setFormData((prev) => ({ ...prev, gps: normalizedGps }));
    }
  }, [normalizedGps, setFormData]);

  const handleClear = (e) => {
    e.preventDefault();
    setGpsInput("");
    setNormalizedGps("");
    setError("");
  };

  return (
    <>
      <p className="text-sm text-gray-600 mb-1 font-semibold">
        GPS (Lat, Long) *
      </p>
      <div className="flex justify-between align-items-center">
        <button
          onClick={handleLocationClick}
          className="px-4 py-2 bg-blue-500 text-white"
          type="button"
          disabled={isFetchingGps}
        >
          {isFetchingGps ? "Obteniendo..." : "GPS actual"}
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-secondary text-white disabled:opacity-50"
          disabled={!normalizedGps}
        >
          borrar gps
        </button>
      </div>
      <input
        type="text"
        placeholder={`Ej: -8.508111, -35.008334 u 8°30'24.3"S 35°00'10.9"W`}
        value={normalizedGps ? normalizedGps : gpsInput}
        onChange={(e) => setGpsInput(e.target.value)}
        onBlur={normalizeInput}
        className="w-full border-b-secondary border-b p-3 focus:outline-none focus:border-b"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {normalizedGps && !error && (
        <p className="text-blue-600 text-sm">
          Coordenada normalizada: {normalizedGps}
        </p>
      )}
    </>
  );
};

GpsComponent.propTypes = {
  setFormData: PropTypes.func.isRequired,
};

export default GpsComponent;

// import { useEffect, useState } from "react";
// import PropTypes from "prop-types";

// const GpsComponent = ({ setFormData }) => {
//   const [gpsInput, setGpsInput] = useState("");
//   const [normalizedGps, setNormalizedGps] = useState("");
//   const [error, setError] = useState("");

//   const getCurrentLocation = (e) => {
//     e.preventDefault();
//     if (!navigator.geolocation) {
//       setError("Geolocalização não é suportada pelo navegador.");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const lat = position.coords.latitude;
//         const lng = position.coords.longitude;
//         const formatted = `${lat}, ${lng}`;
//         setGpsInput(formatted);
//         setNormalizedGps(formatted);
//         setError("");
//       },
//       (err) => {
//         setError("Erro ao obter localização: " + err.message);
//       }
//     );
//   };

//   const dmsToDecimal = (dms) => {
//     const regex = /(\d+)°(\d+)'(\d+(\.\d+)?)"?([NSWE])/gi;
//     const parts = [];
//     let match;
//     while ((match = regex.exec(dms))) {
//       let degrees = parseFloat(match[1]);
//       let minutes = parseFloat(match[2]);
//       let seconds = parseFloat(match[3]);
//       let direction = match[5];

//       let decimal = degrees + minutes / 60 + seconds / 3600;
//       if (["S", "W"].includes(direction.toUpperCase())) {
//         decimal = -decimal;
//       }
//       parts.push(decimal);
//     }
//     return parts.length === 2 ? `${parts[0]}, ${parts[1]}` : null;
//   };

//   const normalizeGps = (value) => {
//     if (/\d+°\d+'\d+(\.\d+)?"?[NSWE]/i.test(value)) {
//       const decimal = dmsToDecimal(value);
//       if (decimal) {
//         setNormalizedGps(decimal);
//         setError("");
//         return;
//       } else {
//         setError("Formato DMS inválido.");
//         return;
//       }
//     }

//     let normalized = value.trim().replace(/,/g, ".");

//     // Formato: -8.505202730514217 -35.0097983421821
//     const spacedFloatMatch = normalized.match(/^(-?\d+\.\d+)\s+(-?\d+\.\d+)$/);
//     if (spacedFloatMatch) {
//       setNormalizedGps(`${spacedFloatMatch[1]}, ${spacedFloatMatch[2]}`);
//       setError("");
//       return;
//     }

//     // Formato: -8.505202730514217-35.0097983421821
//     const joinedFloatMatch = normalized.match(/^(-?\d+\.\d+)(-\d+\.\d+)$/);
//     if (joinedFloatMatch) {
//       setNormalizedGps(`${joinedFloatMatch[1]}, ${joinedFloatMatch[2]}`);
//       setError("");
//       return;
//     }

//     // Formato colado com inteiros grandes: -8505202730514217 -350097983421821
//     const spaceMatch = normalized.match(
//       /(-?\d{2})(\d{7,})\s+(-?\d{2})(\d{7,})/
//     );
//     if (spaceMatch) {
//       const lat = `${spaceMatch[1]}.${spaceMatch[2]}`;
//       const lng = `${spaceMatch[3]}.${spaceMatch[4]}`;
//       setNormalizedGps(`${lat}, ${lng}`);
//       setError("");
//       return;
//     }

//     const joinedMatch = normalized.match(/(-?\d{2})(\d{7,})(-?\d{2})(\d{7,})/);
//     if (joinedMatch) {
//       const lat = `${joinedMatch[1]}.${joinedMatch[2]}`;
//       const lng = `${joinedMatch[3]}.${joinedMatch[4]}`;
//       setNormalizedGps(`${lat}, ${lng}`);
//       setError("");
//       return;
//     }

//     // Limpeza final
//     let cleaned = normalized
//       .replace(/[()]/g, "")
//       .replace(/[;\s]+/g, "")
//       .replace(/\.+/g, ".")
//       .replace(/(\-?\d+\.\d+)[^\d\-]+(\-?\d+\.\d+)/, "$1, $2");

//     const match = cleaned.match(/^(-?\d+\.\d+),\s*(-?\d+\.\d+)$/);
//     if (match) {
//       setNormalizedGps(`${match[1]}, ${match[2]}`);
//       setError("");
//     } else {
//       setNormalizedGps("");
//       setError("Formato de coordenada inválido.");
//     }
//   };

//   const handleBlur = () => {
//     if (gpsInput.trim() !== "") {
//       normalizeGps(gpsInput);
//     }
//   };

//   useEffect(() => {
//     if (normalizedGps) {
//       setFormData((prev) => ({ ...prev, gps: normalizedGps }));
//     }
//   }, [normalizedGps, setFormData]);

//   return (
//     <>
//       <p className="text-sm text-gray-600 mb-1 font-semibold">
//         GPS (Lat, Long) *
//       </p>
//       <button
//         onClick={getCurrentLocation}
//         className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
//       >
//         Usar Localização Atual
//       </button>
//       <input
//         type="text"
//         placeholder="Digite ou cole coordenadas"
//         value={gpsInput}
//         onChange={(e) => setGpsInput(e.target.value)}
//         onBlur={handleBlur}
//         className="w-full border-b-secondary border-b p-3 focus:outline-none focus:border-b"
//       />
//       {error && <p className="text-red-500 text-sm">{error}</p>}
//       {normalizedGps && (
//         <p className="text-blue-600 text-sm">
//           Coordenada normalizada: {normalizedGps}
//         </p>
//       )}
//     </>
//   );
// };

// GpsComponent.propTypes = {
//   formData: PropTypes.object.isRequired,
//   setFormData: PropTypes.func.isRequired,
// };

// export default GpsComponent;

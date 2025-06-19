const initialFormState = {
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  gps: "",
  complement: "",
  photo: "",
  type: "house",
  active: true,
  confirmed: false,
  visited: false,
  customName: "",
};

// Funções de conversão
// const convertDMS = (dms) => {
//   const parts = dms.split(/[°'"]+/).map((part) => part.trim());
//   const directions = dms.match(/[NSEW]/gi) || [];

//   let deg = parseFloat(parts[0]);
//   const min = parts[1] ? parseFloat(parts[1]) / 60 : 0;
//   const sec = parts[2] ? parseFloat(parts[2]) / 3600 : 0;

//   let decimal = deg + min + sec;

//   if (directions.length > 0) {
//     const direction = directions[0].toUpperCase();
//     if (direction === "S" || direction === "W") {
//       decimal = -decimal;
//     }
//   }

//   return decimal;
// };

const gpsRegex =
  /^[-+]?([1-8]?\d(\.\d{1,})?|90(\.0+)?),\s*[-+]?((1[0-7]\d|\d{1,2})(\.\d{1,})?|180(\.0+)?)$/;

// const dmsToDecimal = (deg, min, sec) => {
//   return deg + min / 60 + sec / 3600;
// };

// const normalizeGPS = (gpsString) => {
//   try {
//     if (!gpsString || typeof gpsString !== "string") return gpsString;

//     // Remove parênteses e espaços desnecessários
//     let cleaned = gpsString.replace(/[()]/g, "").trim();

//     // Corrige casos como "-8.52528-35.01042"
//     cleaned = cleaned.replace(/(-?\d+\.\d+)(?=-?\d)/g, "$1,");
//     // cleaned = cleaned.replace(/,(?!\s)/g, ", ");

//     // Evita processar enquanto o número está incompleto
//     const parts = cleaned.split(/[,;\s]+/).filter((p) => p.trim() !== "");
//     if (
//       parts.length !== 2 ||
//       parts.some((p) => /^-?\d+\.\d*$/.test(p)) // número ainda incompleto (ex: -35.)
//     ) {
//       return gpsString;
//     }

//     // Verifica se já está no formato decimal correto
//     if (gpsRegex.test(cleaned)) {
//       const [lat, lon] = cleaned.split(/\s*,\s*/).map((n) => parseFloat(n));
//       return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
//     }

//     // Tenta parsear formato DMS (graus, minutos, segundos)
//     const dmsMatch = cleaned.match(
//       /([NS])?\s*(\d{1,3})[°ºd]?\s*(\d{1,3})['′]?\s*(\d{1,3}(?:\.\d+)?)[\"″]?\s*([NS])?[,;\s-]*([EW])?\s*(\d{1,3})[°ºd]?\s*(\d{1,3})['′]?\s*(\d{1,3}(?:\.\d+)?)[\"″]?\s*([EW])?/i
//     );

//     if (dmsMatch) {
//       const latDir = dmsMatch[1] || dmsMatch[5];
//       const latDeg = parseFloat(dmsMatch[2]);
//       const latMin = parseFloat(dmsMatch[3]);
//       const latSec = parseFloat(dmsMatch[4]);

//       const lonDir = dmsMatch[6] || dmsMatch[10];
//       const lonDeg = parseFloat(dmsMatch[7]);
//       const lonMin = parseFloat(dmsMatch[8]);
//       const lonSec = parseFloat(dmsMatch[9]);

//       let lat = dmsToDecimal(latDeg, latMin, latSec);
//       let lon = dmsToDecimal(lonDeg, lonMin, lonSec);

//       if (latDir?.toUpperCase() === "S") lat *= -1;
//       if (lonDir?.toUpperCase() === "W") lon *= -1;

//       return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
//     }

//     // Último fallback: separe e tente forçar o parse
//     if (parts.length === 2) {
//       const lat = parseFloat(parts[0]);
//       const lon = parseFloat(parts[1]);

//       if (!isNaN(lat) && !isNaN(lon)) {
//         return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
//       }
//     }

//     return gpsString;
//   } catch (error) {
//     console.error("Error normalizing GPS:", error);
//     return gpsString;
//   }
// };

const typeAddress = {
  house: "house",
  department: "department",
  store: "store",
  hotel: "hotel",
  restaurant: "restaurant",
};

const imagesAddresses = {
  house:
    "https://firebasestorage.googleapis.com/v0/b/orangeblog-dff3f.appspot.com/o/standard%2FHouse.webp?alt=media&token=3681c42d-021a-4384-9708-dadd6b41f23f",
  department:
    "https://firebasestorage.googleapis.com/v0/b/orangeblog-dff3f.appspot.com/o/standard%2FApartament.webp?alt=media&token=ee26536a-975d-4ce9-a119-8e8629c409b5",
  store:
    "https://firebasestorage.googleapis.com/v0/b/orangeblog-dff3f.appspot.com/o/standard%2FStore.webp?alt=media&token=7daaaa73-645f-4473-ad77-2a9085b7c3f1",
  restaurant:
    "https://firebasestorage.googleapis.com/v0/b/orangeblog-dff3f.appspot.com/o/standard%2Frestaurant.webp?alt=media&token=2736100b-bef6-4a33-9952-413a547c42a8",
  hotel:
    "https://firebasestorage.googleapis.com/v0/b/orangeblog-dff3f.appspot.com/o/standard%2FHotel.webp?alt=media&token=ed3d7e91-1a81-41d4-b2d2-e8dbc7519b3e",
};

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371000; // Raio da Terra em metros
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distância em metros
};

// const formatDate = (dateString) => {
//   const date = new Date(dateString);
//   return `${String(date.getDate()).padStart(2, "0")}/${String(
//     date.getMonth() + 1
//   ).padStart(2, "0")}/${date.getFullYear()}`;
// };

export {
  initialFormState,
  gpsRegex,
  // convertDMS,
  // normalizeGPS,
  typeAddress,
  imagesAddresses,
  calculateDistance,
  // formatDate,
};

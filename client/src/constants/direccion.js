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
};

// const gpsRegex =
//   /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?((1[0-7]\d|\d{1,2})(\.\d+)?|180(\.0+)?)$/;
// Adicione estas funções no seu arquivo constants/direccion.js
const gpsRegex =
  /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?((1[0-7]\d|\d{1,2})(\.\d+)?|180(\.0+)?)$/;

// Funções de conversão
const convertDMS = (dms) => {
  const parts = dms.split(/[°'"]+/).map((part) => part.trim());
  const directions = dms.match(/[NSEW]/gi) || [];

  let deg = parseFloat(parts[0]);
  const min = parts[1] ? parseFloat(parts[1]) / 60 : 0;
  const sec = parts[2] ? parseFloat(parts[2]) / 3600 : 0;

  let decimal = deg + min + sec;

  if (directions.length > 0) {
    const direction = directions[0].toUpperCase();
    if (direction === "S" || direction === "W") {
      decimal = -decimal;
    }
  }

  return decimal;
};

const normalizeGPS = (gpsString) => {
  try {
    // Remove parênteses se existirem
    let cleaned = gpsString.replace(/[()]/g, "").trim();

    // Verifica se já está no formato correto
    if (gpsRegex.test(cleaned)) {
      return cleaned;
    }

    // Formato DMS (graus, minutos, segundos): 8°30'24.3"S 35°00'10.9"W
    const dmsMatch = cleaned.match(
      /([NS]?)\s*([\d.]+)[°ºd]?\s*([\d.]+)?['′]?\s*([\d.]+)?["″]?\s*([NS]?)[,;\s]+\s*([EW]?)\s*([\d.]+)[°ºd]?\s*([\d.]+)?['′]?\s*([\d.]+)?["″]?\s*([EW]?)/i
    );

    if (dmsMatch) {
      const latParts = dmsMatch.slice(1, 5).filter(Boolean);
      const lonParts = dmsMatch.slice(6, 10).filter(Boolean);

      const latDMS = latParts.join("");
      const lonDMS = lonParts.join("");

      const lat = convertDMS(latDMS);
      const lon = convertDMS(lonDMS);

      return `${lat}, ${lon}`;
    }

    // Formato com vírgula ou espaço como separador
    const parts = cleaned.split(/[,;\s]+/).filter((part) => part.trim() !== "");
    if (parts.length === 2) {
      const lat = parseFloat(parts[0]);
      const lon = parseFloat(parts[1]);

      if (!isNaN(lat) && !isNaN(lon)) {
        return `${lat}, ${lon}`;
      }
    }

    // Se não conseguir converter, retorna o original para validação falhar
    return gpsString;
  } catch (error) {
    console.error("Error normalizing GPS:", error);
    return gpsString;
  }
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

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, "0")}/${String(
    date.getMonth() + 1
  ).padStart(2, "0")}/${date.getFullYear()}`;
};

export {
  initialFormState,
  gpsRegex,
  convertDMS,
  normalizeGPS,
  imagesAddresses,
  calculateDistance,
  formatDate,
};

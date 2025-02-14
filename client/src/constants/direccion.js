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

const gpsRegex =
  /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?((1[0-7]\d|\d{1,2})(\.\d+)?|180(\.0+)?)$/;

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

export { initialFormState, gpsRegex, imagesAddresses, calculateDistance };

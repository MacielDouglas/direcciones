const initialFormState = {
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  gps: "",
  complement: "",
  photo: "",
  type: "house",
  active: false,
  confirmed: false,
  visited: false,
};

const gpsRegex =
  /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?((1[0-7]\d|\d{1,2})(\.\d+)?|180(\.0+)?)$/;

const imagesAddresses = {
  house:
    "https://firebasestorage.googleapis.com/v0/b/orangeblog-dff3f.appspot.com/o/direcciones%2FHouse.webp?alt=media&token=2bf24765-d729-4868-9955-a4e485371377",
  department:
    "https://firebasestorage.googleapis.com/v0/b/orangeblog-dff3f.appspot.com/o/direcciones%2FApartament.webp?alt=media&token=e66b1ad1-d1ac-4af5-b13d-36610c09c720",
  store:
    "https://firebasestorage.googleapis.com/v0/b/orangeblog-dff3f.appspot.com/o/direcciones%2FStore.webp?alt=media&token=7b410ea6-577d-455f-b0b8-4f8b9785a86e",
  restaurant:
    "https://firebasestorage.googleapis.com/v0/b/orangeblog-dff3f.appspot.com/o/direcciones%2Frestaurant.webp?alt=media&token=a06a0e1d-2e30-49e1-8fbc-bc992d9c15c0",
  hotel:
    "https://firebasestorage.googleapis.com/v0/b/orangeblog-dff3f.appspot.com/o/direcciones%2FHotel.webp?alt=media&token=e44bb402-a1d0-434b-a73e-a95fed36618e",
};
export { initialFormState, gpsRegex, imagesAddresses };

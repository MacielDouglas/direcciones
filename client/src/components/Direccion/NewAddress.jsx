import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function NewAddress({ addresses = [] }) {
  const [formData, setFormData] = useState({
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    gps: "",
    complement: "",
    photo: null,
  });

  const [error, setError] = useState({});
  const [isFetchingGps, setIsFetchingGps] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const gpsRegex =
    /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?((1[0-7]\d|\d{1,2})(\.\d+)?|180(\.0+)?)$/;

  useEffect(() => {
    // Ativar o botão apenas se todos os campos obrigatórios estiverem preenchidos
    const isValid =
      formData.street &&
      formData.number &&
      formData.neighborhood &&
      formData.city &&
      (!formData.gps || gpsRegex.test(formData.gps)) &&
      Object.keys(error).length === 0;
    setIsButtonDisabled(!isValid);
  }, [formData, error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
    }
  };

  const handleGetCurrentGps = () => {
    setIsFetchingGps(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          gps: `${latitude}, ${longitude}`,
        }));
        setIsFetchingGps(false);
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        toast.error("Não foi possível obter o GPS atual.");
        setIsFetchingGps(false);
      }
    );
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.street) newErrors.street = "A rua é obrigatória.";
    if (!formData.number) newErrors.number = "O número é obrigatório.";
    if (!formData.neighborhood)
      newErrors.neighborhood = "O bairro é obrigatório.";
    if (!formData.city) newErrors.city = "A cidade é obrigatória.";
    if (formData.gps && !gpsRegex.test(formData.gps))
      newErrors.gps = "Coordenadas inválidas.";
    return newErrors;
  };

  const isDuplicateAddress = () => {
    return addresses.some(
      (address) =>
        address.street === formData.street &&
        address.number === formData.number &&
        address.city === formData.city
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    if (isDuplicateAddress()) {
      toast.error("Este endereço já está cadastrado.");
      return;
    }

    // Caso passe todas as validações
    toast.success("Endereço cadastrado com sucesso!");
    console.log("Dados enviados:", formData);
    setFormData({
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      gps: "",
      complement: "",
      photo: null,
    });
  };

  return (
    <div className="p-6 bg-tertiary min-h-screen text-black flex flex-col items-center pb-24">
      <h1 className="text-3xl font-bold mb-6">Adicionar Novo Endereço</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        {/* Street */}
        <div className="flex flex-col">
          <label className="font-medium text-lg">Rua *</label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            className="p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error.street && (
            <p className="text-red-500 text-sm">{error.street}</p>
          )}
        </div>

        {/* Number */}
        <div className="flex flex-col">
          <label className="font-medium text-lg">Número *</label>
          <input
            type="text"
            name="number"
            value={formData.number}
            onChange={handleChange}
            className="p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error.number && (
            <p className="text-red-500 text-sm">{error.number}</p>
          )}
        </div>

        {/* Neighborhood */}
        <div className="flex flex-col">
          <label className="font-medium text-lg">Bairro *</label>
          <input
            type="text"
            name="neighborhood"
            value={formData.neighborhood}
            onChange={handleChange}
            className="p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error.neighborhood && (
            <p className="text-red-500 text-sm">{error.neighborhood}</p>
          )}
        </div>

        {/* City */}
        <div className="flex flex-col">
          <label className="font-medium text-lg">Cidade *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error.city && <p className="text-red-500 text-sm">{error.city}</p>}
        </div>

        {/* GPS */}
        <div className="flex flex-col">
          <label className="font-medium text-lg">
            GPS (Latitude, Longitude)
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              name="gps"
              value={formData.gps}
              onChange={handleChange}
              className="flex-1 p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleGetCurrentGps}
              disabled={isFetchingGps}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              {isFetchingGps ? "Obtendo..." : "GPS Atual"}
            </button>
          </div>
          {error.gps && <p className="text-red-500 text-sm">{error.gps}</p>}
        </div>

        {/* Complement */}
        <div className="flex flex-col">
          <label className="font-medium text-lg">Complemento (opcional)</label>
          <textarea
            name="complement"
            maxLength="250"
            value={formData.complement}
            onChange={handleChange}
            className="p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Photo */}
        <div className="flex flex-col">
          <label className="font-medium text-lg">Foto (opcional)</label>
          <input
            type="file"
            accept="image/*"
            capture="camera"
            onChange={handlePhotoChange}
            className="p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formData.photo && (
            <p className="text-green-500 text-sm">
              Foto selecionada: {formData.photo.name}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isButtonDisabled}
          className={`w-full py-3 text-white font-bold rounded-md ${
            isButtonDisabled ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          Enviar
        </button>
      </form>
    </div>
  );
}

export default NewAddress;

// import { useState } from "react";

// function NewAddress({ addresses }) {
//   console.log(addresses);
//   const [formData, setFormData] = useState({
//     street: "",
//     number: "",
//     neighborhood: "",
//     city: "",
//     gps: "",
//     complement: "",
//     photo: null,
//   });

//   const [error, setError] = useState({});
//   const [isFetchingGps, setIsFetchingGps] = useState(false);

//   const gpsRegex =
//     /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?((1[0-7]\d|\d{1,2})(\.\d+)?|180(\.0+)?)$/;

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData((prev) => ({ ...prev, photo: file }));
//     }
//   };

//   const handleGetCurrentGps = () => {
//     setIsFetchingGps(true);
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         setFormData((prev) => ({
//           ...prev,
//           gps: `${latitude}, ${longitude}`,
//         }));
//         setIsFetchingGps(false);
//       },
//       (error) => {
//         console.error("Erro ao obter localização:", error);
//         setError((prev) => ({
//           ...prev,
//           gps: "Não foi possível obter o GPS atual.",
//         }));
//         setIsFetchingGps(false);
//       }
//     );
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.street) newErrors.street = "A rua é obrigatória.";
//     if (!formData.number) newErrors.number = "O número é obrigatório.";
//     if (!formData.neighborhood)
//       newErrors.neighborhood = "O bairro é obrigatório.";
//     if (!formData.city) newErrors.city = "A cidade é obrigatória.";
//     if (formData.gps && !gpsRegex.test(formData.gps))
//       newErrors.gps = "Coordenadas inválidas.";
//     return newErrors;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setError(validationErrors);
//     } else {
//       setError({});
//       console.log("Dados enviados:", formData);
//     }
//   };

//   return (
//     <div className="p-6 bg-tertiary min-h-screen text-black flex flex-col items-center mb-16">
//       <h1 className="text-3xl font-bold mb-6">Adicionar Novo Endereço</h1>
//       <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
//         {/* Street */}
//         <div className="flex flex-col">
//           <label className="font-medium text-lg">Rua *</label>
//           <input
//             type="text"
//             name="street"
//             value={formData.street}
//             onChange={handleChange}
//             className="p-3 rounded-lg border bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           {error.street && (
//             <p className="text-red-500 text-sm">{error.street}</p>
//           )}
//         </div>

//         {/* Number */}
//         <div className="flex flex-col">
//           <label className="font-medium text-lg">Número *</label>
//           <input
//             type="text"
//             name="number"
//             value={formData.number}
//             onChange={handleChange}
//             className="p-3 rounded-lg border bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           {error.number && (
//             <p className="text-red-500 text-sm">{error.number}</p>
//           )}
//         </div>

//         {/* Neighborhood */}
//         <div className="flex flex-col">
//           <label className="font-medium text-lg">Bairro *</label>
//           <input
//             type="text"
//             name="neighborhood"
//             value={formData.neighborhood}
//             onChange={handleChange}
//             className="p-3 rounded-lg border bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           {error.neighborhood && (
//             <p className="text-red-500 text-sm">{error.neighborhood}</p>
//           )}
//         </div>

//         {/* City */}
//         <div className="flex flex-col">
//           <label className="font-medium text-lg">Cidade *</label>
//           <input
//             type="text"
//             name="city"
//             value={formData.city}
//             onChange={handleChange}
//             className="p-3 rounded-lg border bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           {error.city && <p className="text-red-500 text-sm">{error.city}</p>}
//         </div>

//         {/* GPS */}
//         <div className="flex flex-col">
//           <label className="font-medium text-lg">
//             GPS (Latitude, Longitude)
//           </label>
//           <div className="flex space-x-2">
//             <input
//               type="text"
//               name="gps"
//               value={formData.gps}
//               onChange={handleChange}
//               className="flex-1 p-3 rounded-lg border bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               type="button"
//               onClick={handleGetCurrentGps}
//               disabled={isFetchingGps}
//               className="px-4 py-2 bg-blue-500 text-white rounded-lg"
//             >
//               {isFetchingGps ? "Obtendo..." : "GPS Atual"}
//             </button>
//           </div>
//           {error.gps && <p className="text-red-500 text-sm">{error.gps}</p>}
//         </div>

//         {/* Complement */}
//         <div className="flex flex-col">
//           <label className="font-medium text-lg">Complemento (opcional)</label>
//           <textarea
//             name="complement"
//             maxLength="250"
//             value={formData.complement}
//             onChange={handleChange}
//             className="p-3 rounded-lg border bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Photo */}
//         <div className="flex flex-col">
//           <label className="font-medium text-lg">Foto (opcional)</label>
//           <input
//             type="file"
//             accept="image/*"
//             capture="camera"
//             onChange={handlePhotoChange}
//             className="p-3 rounded-lg border bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           {formData.photo && (
//             <p className="text-green-500 text-sm">
//               Foto selecionada: {formData.photo.name}
//             </p>
//           )}
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           className="w-full py-3 bg-green-500 text-white font-bold rounded-lg"
//         >
//           Enviar
//         </button>
//       </form>
//     </div>
//   );
// }

// export default NewAddress;

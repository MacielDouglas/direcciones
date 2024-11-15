import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function InputField({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  maxLength,
  placeholder,
  isTextarea = false,
}) {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={name}
        className="text-sm text-gray-600 mb-1 font-semibold"
      >
        {label}
      </label>
      {isTextarea ? (
        <textarea
          name={name}
          maxLength={maxLength}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border-b-secondary border-b p-3 focus:outline-none focus:border-b"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border-b border-b-secondary p-3 focus:outline-none focus:border-b focus:border-orange-400 focus:bg-slate-50"
        />
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

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

  console.log(addresses);

  const [error, setError] = useState({});
  const [isFetchingGps, setIsFetchingGps] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const gpsRegex =
    /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?((1[0-7]\d|\d{1,2})(\.\d+)?|180(\.0+)?)$/;

  useEffect(() => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

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
    <div className="min-h-screen bg-primary p-4 md:p-10 flex flex-col items-center justify-center  mb-10">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-medium text-gray-700 mb-6">
          Nueva Dirección
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Calle *"
            placeholder="Ex: Rua Direita"
            name="street"
            value={formData.street}
            onChange={handleChange}
            error={error.street}
          />
          <InputField
            label="Numero *"
            name="number"
            placeholder="Ex: 123 u 123a"
            value={formData.number}
            onChange={handleChange}
            error={error.number}
          />
          <InputField
            label="Barrio *"
            name="neighborhood"
            placeholder="Ex: Vila Porto de Galinhas"
            value={formData.neighborhood}
            onChange={handleChange}
            error={error.neighborhood}
          />
          <InputField
            label="Ciudad *"
            name="city"
            placeholder="Ex: Ipojuca"
            value={formData.city}
            onChange={handleChange}
            error={error.city}
          />
          <InputField
            label="GPS (Latitude, Longitude)"
            name="gps"
            value={formData.gps}
            onChange={handleChange}
            error={error.gps}
            placeholder="Ex.: -23.5505, -46.6333"
            id="gps"
          />
          <button
            type="button"
            onClick={handleGetCurrentGps}
            disabled={isFetchingGps}
            className="px-4 py-2 bg-blue-500 text-white "
          >
            {isFetchingGps ? "Obtendo..." : "GPS Atual"}
          </button>

          {error.gps && <p className="text-red-500 text-sm">{error.gps}</p>}
          <InputField
            label="Complemento (opcional)"
            name="complement"
            placeholder="Ex: Apartamento 103, al lado del numero 32 y 897, pandaderia Pão Caseiro"
            value={formData.complement}
            onChange={handleChange}
            isTextarea
            maxLength="250"
          />
          <div className="flex flex-col">
            <label
              htmlFor="photo"
              className="text-sm text-gray-600 font-medium mb-1"
            >
              Foto (opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              // onChange={(e) => {
              //   const file = e.target.files[0];
              //   setFormData((prev) => ({ ...prev, photo: file }));
              // }}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.photo && (
              <p className="text-green-500 text-sm">
                Foto selecionada: {formData.photo.name}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isButtonDisabled}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              isButtonDisabled
                ? "bg-gray-300"
                : "bg-blue-500 hover:bg-blue-600 transition-colors"
            }`}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewAddress;

// import { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { motion } from "framer-motion";

// function InputField({
//   label,
//   name,
//   value,
//   onChange,
//   error,
//   type = "text",
//   maxLength,
//   placeholder,
// }) {
//   return (
//     <div className="relative flex flex-col">
//       <motion.label
//         htmlFor={name}
//         className={`absolute left-3 top-0 text-lg font-normal transition-all duration-300 ${
//           value ? "text-blue-500 text-xs" : "text-gray-400"
//         }`}
//         style={{ top: value ? "-10px" : "12px" }}
//       >
//         {label}
//       </motion.label>
//       {type === "textarea" ? (
//         <textarea
//           name={name}
//           maxLength={maxLength}
//           value={value}
//           onChange={onChange}
//           placeholder={placeholder}
//           className="bg-details border-b border-b-black p-3  focus:outline-none focus:bg-tertiary focus:border-none"
//         />
//       ) : (
//         <input
//           type={type}
//           name={name}
//           value={value}
//           onChange={onChange}
//           placeholder={placeholder}
//           className="bg-details border-b border-b-black p-3  focus:outline-none focus:bg-tertiary focus:border-none"
//         />
//       )}
//       {error && <p className="text-red-500 text-sm">{error}</p>}
//     </div>
//   );
// }

// function NewAddress({ addresses = [] }) {
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
//   const [isButtonDisabled, setIsButtonDisabled] = useState(true);

//   const gpsRegex =
//     /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?((1[0-7]\d|\d{1,2})(\.\d+)?|180(\.0+)?)$/;

//   useEffect(() => {
//     const isValid =
//       formData.street &&
//       formData.number &&
//       formData.neighborhood &&
//       formData.city &&
//       (!formData.gps || gpsRegex.test(formData.gps)) &&
//       Object.keys(error).length === 0;
//     setIsButtonDisabled(!isValid);
//   }, [formData, error]);

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
//         toast.error("Não foi possível obter o GPS atual.");
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

//   const isDuplicateAddress = () => {
//     return addresses.some(
//       (address) =>
//         address.street === formData.street &&
//         address.number === formData.number &&
//         address.city === formData.city
//     );
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setError(validationErrors);
//       return;
//     }

//     if (isDuplicateAddress()) {
//       toast.error("Este endereço já está cadastrado.");
//       return;
//     }

//     // Caso passe todas as validações
//     toast.success("Endereço cadastrado com sucesso!");
//     console.log("Dados enviados:", formData);
//     setFormData({
//       street: "",
//       number: "",
//       neighborhood: "",
//       city: "",
//       gps: "",
//       complement: "",
//       photo: null,
//     });
//   };

//   return (
//     <div className="p-6 bg-details min-h-screen text-black flex flex-col items-center pb-24">
//       <h1 className="text-3xl font-medium mb-6">Adicionar Novo Endereço</h1>
//       <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
//         <InputField
//           label="Rua *"
//           name="street"
//           value={formData.street}
//           onChange={handleChange}
//           error={error.street}
//         />
//         <InputField
//           label="Número *"
//           name="number"
//           value={formData.number}
//           onChange={handleChange}
//           error={error.number}
//         />
//         <InputField
//           label="Bairro *"
//           name="neighborhood"
//           value={formData.neighborhood}
//           onChange={handleChange}
//           error={error.neighborhood}
//         />
//         <InputField
//           label="Cidade *"
//           name="city"
//           value={formData.city}
//           onChange={handleChange}
//           error={error.city}
//         />
//         <div className="relative flex flex-col">
//           <motion.label
//             htmlFor="gps"
//             className={`absolute top-0 left-3 text-lg font-medium transition-all duration-300 ${
//               formData.gps ? "text-blue-500" : "text-gray-400"
//             }`}
//             style={{ top: formData.gps ? "-20px" : "10px" }}
//           >
//             GPS (Latitude, Longitude)
//           </motion.label>
//           <div className="flex space-x-2">
//             <input
//               type="text"
//               name="gps"
//               value={formData.gps}
//               onChange={handleChange}
//               id="gps"
//               className="flex-1 bg-details border-b border-b-black p-3  focus:outline-none focus:bg-tertiary focus:border-none"
//             />
//             <button
//               type="button"
//               onClick={handleGetCurrentGps}
//               disabled={isFetchingGps}
//               className="px-4 py-2 bg-blue-500 text-white "
//             >
//               {isFetchingGps ? "Obtendo..." : "GPS Atual"}
//             </button>
//           </div>
//           {error.gps && <p className="text-red-500 text-sm">{error.gps}</p>}
//         </div>
//         <InputField
//           label="Complemento (opcional)"
//           name="complement"
//           value={formData.complement}
//           onChange={handleChange}
//           type="textarea"
//           maxLength="250"
//         />
//         <div className="relative flex flex-col">
//           <motion.label
//             htmlFor="photo"
//             className="absolute top-0 left-3 text-lg font-medium transition-all duration-300"
//             style={{
//               top: formData.photo ? "-20px" : "10px",
//               color: formData.photo ? "blue" : "gray",
//             }}
//           >
//             Foto (opcional)
//           </motion.label>
//           <input
//             type="file"
//             accept="image/*"
//             capture="camera"
//             onChange={handlePhotoChange}
//             className="bg-details border-b border-b-black p-3  focus:outline-none focus:bg-tertiary focus:border-none"
//           />
//           {formData.photo && (
//             <p className="text-green-500 text-sm">
//               Foto selecionada: {formData.photo.name}
//             </p>
//           )}
//         </div>
//         <button
//           type="submit"
//           disabled={isButtonDisabled}
//           className={`w-full py-3 text-white font-bold  ${
//             isButtonDisabled ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
//           }`}
//         >
//           Enviar
//         </button>
//       </form>
//     </div>
//   );
// }

// export default NewAddress;

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

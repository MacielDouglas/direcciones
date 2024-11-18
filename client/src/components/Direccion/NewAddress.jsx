import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import InputField from "../../context/InputField";
import { useMutation } from "@apollo/client";
import { NEW_ADDRESS } from "../../graphql/mutation/address.mutation";
import { useSelector } from "react-redux";

function NewAddress({ addresses }) {
  const user = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    gps: "",
    complement: "",
    photo: null,
    type: "house",
    active: false,
    confirmed: false,
    visited: false,
  });

  const [error, setError] = useState({});
  const [isFetchingGps, setIsFetchingGps] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [existingAddress, setExistingAddress] = useState(null);
  const navigate = useNavigate();

  const [newAddress, { data }] = useMutation(NEW_ADDRESS, {
    onCompleted: async (data) => {
      console.log(data);
      toast.success(data.street);
    },
    onError: (error) => {
      toast.error(`Error ao cadastrar endereço: ${error.message}`);
    },
  });

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

  const checkIfAddressExists = () => {
    return addresses.find(
      (address) =>
        address.street === formData.street &&
        address.number === formData.number &&
        address.neighborhood === formData.neighborhood
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setError(validationErrors);
        return;
      }

      const existing = checkIfAddressExists();
      if (existing) {
        setExistingAddress(existing);
        toast.info("Endereço já existente! Selecione uma ação.");
        return;
      }

      await newAddress({
        variables: {
          action: "create",
          newAddress: {
            street: formData.street,
            number: formData.number,
            neighborhood: formData.neighborhood,
            city: formData.city,
            complement: formData.complement,
            gps: formData.gps,
            userId: user.userData.id,
            active: false,
            confirmed: false,
            visited: null,
            type: formData.type,
            photo:
              "https://minexco.com.br/wp-content/uploads/2017/12/casa-de-praia-foto-em-destaque-1024x683.png",
          },
        },
      });

      console.log("Dados enviados:", formData);
      toast.success("Endereço cadastrado com sucesso!");
      setFormData({
        street: "",
        number: "",
        neighborhood: "",
        city: "",
        gps: "",
        complement: "",
        photo: null,
        type: "house",
      });
    } catch (error) {
      console.error("Erro ao cadastrar endereço: ", error.message);
    }
  };

  const handleCancel = () => {
    setFormData({
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      gps: "",
      complement: "",
      photo: null,
      type: "casa",
    });
    setExistingAddress(null);
  };

  const handleEdit = () => {
    toast.info("Você pode revisar as informações.");
    setExistingAddress(null);
  };

  const handleModify = () => {
    navigate(`/update-address/${existingAddress.id}`);
  };

  return (
    <div className="min-h-screen bg-primary p-4 md:p-10 flex flex-col items-center justify-center mb-10">
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
          />
          <button
            type="button"
            onClick={handleGetCurrentGps}
            disabled={isFetchingGps}
            className="px-4 py-2 bg-blue-500 text-white"
          >
            {isFetchingGps ? "Obtendo..." : "GPS Atual"}
          </button>

          <div className="flex flex-col">
            <label
              htmlFor="type"
              className="text-sm text-gray-600 mb-1 font-semibold"
            >
              Tipo *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="house">Casa</option>
              <option value="department">Departamento</option>
              <option value="store">Comercio</option>
              <option value="hotel">Posada</option>
              <option value="restaurant">Restaurante</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="confirmed"
              className="text-sm text-gray-600 mb-1 font-semibold"
            >
              ¿Está confirmado? *
            </label>
            <select
              name="confirmed"
              value={formData.confirmed}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmed: e.target.value === "true",
                })
              }
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="false">No, hay que confirmar</option>
              <option value="true">Si, Confirmado</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="visited"
              className="text-sm text-gray-600 mb-1 font-semibold"
            >
              ¿Seguirás visitando? *
            </label>
            <select
              name="visited"
              value={formData.visited}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  visited: e.target.value === "true",
                })
              }
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="false">No, puede visita otro</option>
              <option value="true">Si, voy a visitar</option>
            </select>
          </div>

          <InputField
            label="Complemento (opcional)"
            name="complement"
            placeholder="Ex: Apartamento 103"
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
        {existingAddress && (
          <div className="p-6  w-full h-full flex  items-center justify-center  fixed inset-0 bg-black bg-opacity-50 ">
            <div className="bg-details h-72 max-h-96 p-5 flex  items-center justify-center  flex-col">
              <p className="text-xl mb-3">
                La dirección ya existe. Elige una acción:
              </p>
              <div className="flex gap-5 flex-col w-full">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-red-600 text-red-800 "
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 border border-blue-600 text-blue-800 "
                >
                  Reedición
                </button>
                <button
                  onClick={handleModify}
                  className="px-4 py-2 border border-green-600 text-green-800 "
                >
                  Modificar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

NewAddress.propTypes = {
  addresses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      street: PropTypes.string.isRequired,
      number: PropTypes.string.isRequired,
      neighborhood: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      gps: PropTypes.string,
      complement: PropTypes.string,
      photo: PropTypes.instanceOf(File),
      type: PropTypes.oneOf([
        "casa",
        "apartamento",
        "loja",
        "pousada",
        "restaurante",
      ]),
    })
  ),
};

export default NewAddress;
// import { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import InputField from "../../context/InputField";

// function NewAddress({ addresses }) {
//   const [formData, setFormData] = useState({
//     street: "",
//     number: "",
//     neighborhood: "",
//     city: "",
//     gps: "",
//     complement: "",
//     photo: null,
//     type: "casa", // Valor padrão para o tipo
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

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setError(validationErrors);
//       return;
//     }

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
//       type: "casa",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-primary p-4 md:p-10 flex flex-col items-center justify-center mb-10">
//       <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
//         <h1 className="text-3xl font-medium text-gray-700 mb-6">
//           Nueva Dirección
//         </h1>
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <InputField
//             label="Calle *"
//             placeholder="Ex: Rua Direita"
//             name="street"
//             value={formData.street}
//             onChange={handleChange}
//             error={error.street}
//           />
//           <InputField
//             label="Numero *"
//             name="number"
//             placeholder="Ex: 123 u 123a"
//             value={formData.number}
//             onChange={handleChange}
//             error={error.number}
//           />
//           <InputField
//             label="Barrio *"
//             name="neighborhood"
//             placeholder="Ex: Vila Porto de Galinhas"
//             value={formData.neighborhood}
//             onChange={handleChange}
//             error={error.neighborhood}
//           />
//           <InputField
//             label="Ciudad *"
//             name="city"
//             placeholder="Ex: Ipojuca"
//             value={formData.city}
//             onChange={handleChange}
//             error={error.city}
//           />
//           <InputField
//             label="GPS (Latitude, Longitude)"
//             name="gps"
//             value={formData.gps}
//             onChange={handleChange}
//             error={error.gps}
//             placeholder="Ex.: -23.5505, -46.6333"
//           />
//           <button
//             type="button"
//             onClick={handleGetCurrentGps}
//             disabled={isFetchingGps}
//             className="px-4 py-2 bg-blue-500 text-white"
//           >
//             {isFetchingGps ? "Obtendo..." : "GPS Atual"}
//           </button>

//           {error.gps && <p className="text-red-500 text-sm">{error.gps}</p>}
//           <div className="flex flex-col">
//             <label
//               htmlFor="type"
//               className="text-sm text-gray-600 mb-1 font-semibold"
//             >
//               Tipo *
//             </label>

//             <select
//               name="type"
//               value={formData.type}
//               onChange={handleChange}
//               className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="house">Casa</option>
//               <option value="department">Departamento</option>
//               <option value="store">Comercio</option>
//               <option value="hotel">Posada</option>
//               <option value="restaurant">Restaurante</option>
//             </select>
//           </div>
//           <InputField
//             label="Complemento (opcional)"
//             name="complement"
//             placeholder="Ex: Apartamento 103"
//             value={formData.complement}
//             onChange={handleChange}
//             isTextarea
//             maxLength="250"
//           />
//           <div className="flex flex-col">
//             <label
//               htmlFor="photo"
//               className="text-sm text-gray-600 font-medium mb-1"
//             >
//               Foto (opcional)
//             </label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handlePhotoChange}
//               className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             {formData.photo && (
//               <p className="text-green-500 text-sm">
//                 Foto selecionada: {formData.photo.name}
//               </p>
//             )}
//           </div>
//           <button
//             type="submit"
//             disabled={isButtonDisabled}
//             className={`w-full py-3 rounded-lg text-white font-semibold ${
//               isButtonDisabled
//                 ? "bg-gray-300"
//                 : "bg-blue-500 hover:bg-blue-600 transition-colors"
//             }`}
//           >
//             Enviar
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// NewAddress.propTypes = {
//   addresses: PropTypes.arrayOf(
//     PropTypes.shape({
//       street: PropTypes.string.isRequired,
//       number: PropTypes.string.isRequired,
//       neighborhood: PropTypes.string.isRequired,
//       city: PropTypes.string.isRequired,
//       gps: PropTypes.string,
//       complement: PropTypes.string,
//       photo: PropTypes.instanceOf(File),
//       type: PropTypes.oneOf([
//         "casa",
//         "apartamento",
//         "loja",
//         "pousada",
//         "restaurante",
//       ]),
//     })
//   ),
// };

// export default NewAddress;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import InputField from "../../context/InputField";
import FormUploadImage from "../../forms/FormUploadImage";
import { NEW_ADDRESS } from "../../graphql/mutation/address.mutation";
import {
  gpsRegex,
  imagesAddresses,
  initialFormState,
} from "../../constants/direccion.js";
import { setAddresses } from "../../store/addressesSlice";
import { GET_ADDRESS } from "./../../graphql/queries/address.query";

function NewAddress() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userData);
  const addresses = useSelector((state) => state.addresses.addressesData || []);

  const [formData, setFormData] = useState(initialFormState);

  const [error, setError] = useState({});
  const [isFetchingGps, setIsFetchingGps] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [charCount, setCharCount] = useState(250);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const [fetchAddresses, { refetch }] = useLazyQuery(GET_ADDRESS, {
    variables: { action: "get", input: { street: "" } },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data?.address?.address.length) {
        dispatch(setAddresses({ addresses: data.address.address }));
      } else {
        toast.warn("Nenhum endereço encontrado.");
      }
    },
    onError: (error) =>
      toast.error(`Erro ao buscar endereços: ${error.message}`),
  });

  const [newAddress] = useMutation(NEW_ADDRESS, {
    onCompleted: async (data) => {
      toast.success("Endereço cadastrado com sucesso!");
      await refetch();
      navigate(`/address?tab=/address/${data.addressMutation.address.id}`);
    },
    onError: (error) => {
      toast.error(`Erro ao cadastrar endereço: ${error.message}`),
        console.error(error);
      console.log("Error: ", error.message);
    },
  });

  useEffect(() => {
    setCharCount(250 - formData.complement.length);
  }, [formData.complement]);

  useEffect(() => {
    const isValid =
      formData.street &&
      formData.number &&
      formData.neighborhood &&
      formData.city &&
      formData.gps &&
      gpsRegex.test(formData.gps) &&
      Object.keys(error).length === 0;

    setIsButtonDisabled(!isValid);
  }, [formData, error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "complement" && value.length > 250) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGetCurrentGps = () => {
    setIsFetchingGps(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setFormData((prev) => ({
          ...prev,
          gps: `${coords.latitude}, ${coords.longitude}`,
        }));
        setIsFetchingGps(false);
      },
      () => {
        toast.error("Não foi possível obter o GPS atual.");
        setIsFetchingGps(false);
      }
    );
  };

  const checkIfAddressExists = () => {
    if (!Array.isArray(addresses)) return false; // Verifica se é um array válido

    return addresses.find(
      (addr) =>
        addr.street === formData.street &&
        addr.number === formData.number &&
        addr.neighborhood === formData.neighborhood
    );
  };

  const handleUploadComplete = (url) => {
    setFormData((prev) => ({ ...prev, photo: url }));
    setIsUploading(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setError(validationErrors);
        return;
      }

      if (checkIfAddressExists()) {
        toast.info("Endereço já cadastrado!");
        return;
      }

      // if (!formData.photo) {
      //   setFormData((prev) => ({
      //     ...prev,
      //     photo: imagesAddresses[formData.type],
      //   }));
      // }

      // console.log(formData);

      await newAddress({
        variables: {
          action: "create",
          newAddress: {
            ...formData,
            userId: user.id,
            group: user.group,
            photo: formData.photo
              ? formData.photo
              : imagesAddresses[formData.type],
          },
        },
      });
    } catch (error) {
      console.log(error);
      toast.error(`Erro ao cadastrar endereço: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen p-10 flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h1 className="text-2xl font-semibold mb-6">Novo Endereço</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Rua *"
            name="street"
            value={formData.street}
            onChange={handleChange}
            error={error.street}
          />
          <InputField
            label="Número *"
            name="number"
            value={formData.number}
            onChange={handleChange}
            error={error.number}
          />
          <InputField
            label="Bairro *"
            name="neighborhood"
            value={formData.neighborhood}
            onChange={handleChange}
            error={error.neighborhood}
          />
          <InputField
            label="Cidade *"
            name="city"
            value={formData.city}
            onChange={handleChange}
            error={error.city}
          />
          <InputField
            label="GPS (Lat, Long) *"
            name="gps"
            value={formData.gps}
            onChange={handleChange}
            error={error.gps}
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
          <p className="text-right text-sm text-gray-500">
            {charCount} caracteres restantes
          </p>

          <div className="w-full flex justify-center">
            <img
              src={
                formData.photo
                  ? formData.photo
                  : `${imagesAddresses[formData.type]}`
              }
              className="w-full max-w-xs rounded-lg border border-gray-300"
              alt="Imagem Enviada"
            />
          </div>

          <FormUploadImage onUploadComplete={handleUploadComplete} />
          <button
            type="submit"
            disabled={isButtonDisabled}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              isButtonDisabled
                ? "bg-gray-300"
                : "bg-blue-500 hover:bg-blue-600 transition-colors"
            }`}
          >
            {isUploading ? "Aguardando imagem..." : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewAddress;

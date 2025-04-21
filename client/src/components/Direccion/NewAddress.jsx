import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import InputField from "../../context/InputField";
import FormUploadImage from "../../forms/FormUploadImage";
import { NEW_ADDRESS } from "../../graphql/mutation/address.mutation";
import {
  gpsRegex,
  imagesAddresses,
  initialFormState,
  normalizeGPS,
} from "../../constants/direccion.js";
import { setAddresses } from "../../store/addressesSlice";

function NewAddress() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const direccion = useSelector((state) => state.addresses);

  const addresses = direccion.addressesData || [];

  const [formData, setFormData] = useState(initialFormState);
  const [charCount, setCharCount] = useState(250);
  const [isFetchingGps, setIsFetchingGps] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const [newAddressInput] = useMutation(NEW_ADDRESS, {
    onCompleted: async (data) => {
      if (!data.createAddress.success) {
        return toast.error(
          `Erro ao cadastrar endereço: ${data.createAddress.message}`
        );
      }
      toast.success("Endereço cadastrado com sucesso!");
      dispatch(
        setAddresses({
          addresses: [...addresses, data.createAddress.address],
        })
      );
      navigate(`/address?tab=/address/${data.createAddress.address.id}`);
    },
    onError: (error) =>
      toast.error(`Erro ao cadastrar endereço: ${error.message}`),
  });

  useEffect(() => {
    setCharCount(250 - formData.complement.length);
  }, [formData.complement]);

  useEffect(() => {
    const isValid =
      formData.street.trim() &&
      formData.number.trim() &&
      formData.neighborhood.trim() &&
      formData.city.trim() &&
      handleGPSCheck(formData.gps.trim());

    setIsButtonDisabled(!isValid);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "complement" && value.length > 250) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGPSCheck = (gpsValue) => {
    const normalized = normalizeGPS(gpsValue);
    setFormData((prev) => ({ ...prev, gps: normalized }));
    return gpsRegex.test(normalized);
  };

  const handleGetCurrentGps = () => {
    setIsFetchingGps(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const normalized = normalizeGPS(
          `${coords.latitude}, ${coords.longitude}`
        );
        setFormData((prev) => ({
          ...prev,
          gps: normalized,
        }));
        setIsFetchingGps(false);
      },
      () => {
        toast.error("No se puede obtener el GPS actual.");
        setIsFetchingGps(false);
      }
    );
  };

  const checkIfAddressExists = () => {
    return addresses.some(
      (addr) =>
        addr.street.trim().toLowerCase() ===
          formData.street.trim().toLowerCase() &&
        addr.number.trim().toLowerCase() ===
          formData.number.trim().toLowerCase() &&
        addr.neighborhood.trim().toLowerCase() ===
          formData.neighborhood.trim().toLowerCase()
    );
  };

  const handleUploadComplete = (url) => {
    setFormData((prev) => ({ ...prev, photo: url }));
    setIsUploading(false);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.street.trim()) errors.street = "La calle es obligatoria...";
    if (!formData.number.trim()) errors.number = "El número es obligatorio...";
    if (!formData.neighborhood.trim())
      errors.neighborhood = "El barrio es obligatorio...";
    if (!formData.city.trim()) errors.city = "La ciudad es obligatoria...";

    const normalizedGPS = normalizeGPS(formData.gps.trim());
    if (!gpsRegex.test(normalizedGPS)) {
      errors.gps = "Coordenadas no válidas";
      // Atualiza o campo com a tentativa de normalização
      setFormData((prev) => ({ ...prev, gps: normalizedGPS }));
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach((err) => toast.error(err));
      return;
    }

    if (addresses && checkIfAddressExists()) {
      toast.info("¡Dirección ya registrada!");
      return;
    }

    const photoUrl = formData.photo || imagesAddresses[formData.type];

    // const inputs = {
    //   ...formData,
    //   photo: photoUrl,
    // };

    try {
      await newAddressInput({
        variables: {
          newAddressInput: { ...formData, photo: photoUrl },
        },
      });
    } catch (error) {
      toast.error(`Error al registrar la dirección: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen py-5 px-6 flex items-center justify-center bg-details">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h1 className="text-2xl font-semibold mb-6">Nueva dirección</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Calle *"
            name="street"
            value={formData.street}
            onChange={handleChange}
            placeholder={`Ej: Rua Principal`}
          />
          <InputField
            label="Numero *"
            name="number"
            value={formData.number}
            onChange={handleChange}
            placeholder={`Ej: 123 u 123a`}
          />
          <InputField
            label="Vecindario o barrio *"
            name="neighborhood"
            value={formData.neighborhood}
            onChange={handleChange}
            placeholder={`Ej: Porto de Galinhas`}
          />
          <InputField
            label="Ciudad *"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder={`Ej: Ipojuca`}
          />
          <InputField
            label="GPS (Lat, Long) *"
            name="gps"
            value={formData.gps}
            onChange={(e) => {
              const normalized = normalizeGPS(e.target.value);
              setFormData((prev) => ({ ...prev, gps: normalized }));
            }}
            placeholder={`Ej: -8.508111, -35.008334 o 8°30'24.3"S 35°00'10.9"W`}
          />
          <button
            type="button"
            onClick={handleGetCurrentGps}
            disabled={isFetchingGps}
            className="px-4 py-2 bg-blue-500 text-white"
          >
            {isFetchingGps ? "Obteniendo..." : "GPS actual"}
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
              <option value="store">Negocio</option>
              <option value="hotel">Posada u Hotelaria</option>
              <option value="restaurant">Restaurante</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="confirmed"
              className="text-sm text-gray-600 mb-1 font-semibold"
            >
              ¿Confirmado? *
            </label>
            <select
              name="confirmed"
              value={formData.confirmed ? true : false}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  confirmed: e.target.value === "true",
                }))
              }
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="false">No, tienes que confirmar.</option>
              <option value="true">Sí, dirección confirmada.</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="visited"
              className="text-sm text-gray-600 mb-1 font-semibold"
            >
              ¿Seguirá visitando? *
            </label>
            <select
              name="visited"
              value={formData.visited ? true : false}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  visited: e.target.value === "true",
                }))
              }
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="false">No, alguien más puede visitar</option>
              <option value="true">Sí, seguiré visitando.</option>
            </select>
          </div>

          <InputField
            label="Complemento (opcional)"
            name="complement"
            placeholder="Ej: Casa 1  Departamento 1001"
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
              src={formData.photo || imagesAddresses[formData.type]}
              className="object-cover rounded-t-md w-full h-64 border border-gray-300"
              alt="Pré-visualização da imagem"
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
            {isUploading ? "Esperando imagen..." : "Crear dirección"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewAddress;

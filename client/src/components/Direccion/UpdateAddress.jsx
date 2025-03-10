import { useMutation } from "@apollo/client";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UPDATE_ADDRESS } from "../../graphql/mutation/address.mutation";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { gpsRegex, imagesAddresses } from "../../constants/direccion";
import FormUploadImage from "../../forms/FormUploadImage";
import InputField from "../../context/InputField";
import { setAddresses } from "../../store/addressesSlice";

function UpdateAddress({ id }) {
  const [formData, setFormData] = useState({});
  const [changedFields, setChangedFields] = useState({});
  const [isFetchingGps, setIsFetchingGps] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [charCount, setCharCount] = useState(250);
  const [newUrlPhoto, setNewUrlPhoto] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const addresses = useSelector((state) => state.addresses);
  const address = addresses.addressesData.find((address) => address.id === id);

  useEffect(() => {
    if (address) {
      setFormData(address);
    }
  }, [address]);

  useEffect(() => {
    setCharCount(250 - (formData.complement ? formData.complement.length : 0));
  }, [formData.complement]);

  useEffect(() => {
    if (!changedFields) {
      setIsButtonDisabled(true);
      return;
    }

    const fieldValidators = {
      street: (value) => !!value?.trim(),
      number: (value) => !!value?.trim(),
      neighborhood: (value) => !!value?.trim(),
      city: (value) => !!value?.trim(),
      gps: (value) => gpsRegex.test(value?.trim()),
      type: (value) => !!value?.trim(),
      complement: (value) => !!value?.trim(),
      photo: (value) => !!value?.trim(),
      confirmed: (value) => typeof value === "boolean",
      visited: (value) => typeof value === "boolean",
    };

    // Verifica se pelo menos um campo presente é válido
    const isValid = Object.entries(changedFields).some(([key, value]) =>
      fieldValidators[key]?.(value)
    );

    setIsButtonDisabled(!isValid);
  }, [changedFields]);

  const [updateAddress, { loading }] = useMutation(UPDATE_ADDRESS, {
    onCompleted: (data) => {
      setIsButtonDisabled(true);
      toast.success("Endereço atualizado com sucesso!");

      const updateAdd = data.updateAddress.address;

      dispatch(
        setAddresses({
          addresses: addresses.addressesData.map((addr) =>
            addr.id === updateAdd.id ? updateAdd : addr
          ),
        })
      );
      navigate(`/address?tab=/address/${updateAdd.id}`);
    },
    onError: (error) => {
      setIsButtonDisabled(false);
      toast.error(`Erro ao atualizar endereço: ${error.message}`);
    },
  });

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
        toast.error("No se puede obtener el GPS actual.");
        setIsFetchingGps(false);
      }
    );
  };

  const handleUploadComplete = (url) => {
    setIsUploading(true);
    setIsButtonDisabled(true);
    setNewUrlPhoto({ photo: url });
    setChangedFields((prev) => ({ ...prev, photo: url }));
    setIsUploading(false);
    setIsButtonDisabled(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = ["confirmed", "visited"].includes(name)
      ? value === "true"
      : value;

    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
    setChangedFields((prev) => {
      const updatedFields = {
        ...prev,
        [name]: parsedValue !== address[name] ? parsedValue : undefined,
      };

      if (name === "type" && imagesAddresses[value] && !newUrlPhoto) {
        updatedFields.photo = imagesAddresses[value];
      }

      return updatedFields;
    });
  };

  const checkIfAddressExists = () => {
    if (!addresses?.addressesData || !Array.isArray(addresses.addressesData)) {
      return false;
    }

    return addresses.addressesData.some((addr) => {
      const street = addr?.street?.trim().toLowerCase() || "";
      const number = addr?.number?.trim().toLowerCase() || "";
      const neighborhood = addr?.neighborhood?.trim().toLowerCase() || "";

      const changedStreet = changedFields?.street?.trim().toLowerCase() || "";
      const changedNumber = changedFields?.number?.trim().toLowerCase() || "";
      const changedNeighborhood =
        changedFields?.neighborhood?.trim().toLowerCase() || "";

      return (
        street === changedStreet &&
        number === changedNumber &&
        neighborhood === changedNeighborhood
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newUrlPhoto || formData.type) {
      const photoUrl = newUrlPhoto || imagesAddresses[formData.type];
      setChangedFields((prev) => ({
        ...prev,
        photo: photoUrl,
      }));
    }

    const updatedData = Object.fromEntries(
      Object.entries(changedFields).filter(([_, value]) => value !== undefined)
    );

    if (addresses && checkIfAddressExists()) {
      toast.info("¡Dirección ya registrada!");
      return;
    }

    if (!address) {
      toast.error("Erro: endereço não encontrado.");
      return;
    }
    const updateAd = {
      ...updatedData,
      id: address.id,
    };

    if (Object.keys(updatedData).length > 0) {
      await updateAddress({
        variables: {
          input: updateAd,
        },
      });
      // onClose();
    }
  };

  return (
    <div className="min-h-screen bg-details p-4 md:p-10 flex flex-col itens-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-medium text-gray-700 mb-6">
          Actualizar la dirección
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Calle *"
            name="street"
            value={formData.street || ""}
            onChange={handleChange}
            placeholder={`Ej: Rua Principal`}
          />
          <InputField
            label="Numero *"
            name="number"
            value={formData.number || ""}
            onChange={handleChange}
            placeholder={`Ej: 123 u 123a`}
          />
          <InputField
            label="Vecindario o barrio *"
            name="neighborhood"
            value={formData.neighborhood || ""}
            onChange={handleChange}
            placeholder={`Ej: Porto de Galinhas`}
          />
          <InputField
            label="Ciudad *"
            name="city"
            value={formData.city || ""}
            onChange={handleChange}
            placeholder={`Ej: Ipojuca`}
          />
          <InputField
            label="GPS (Lat, Long) *"
            name="gps"
            value={formData.gps || ""}
            onChange={handleChange}
            placeholder={`Ej: -8.508111, -35.008334`}
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
              value={formData.type || ""}
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
              value={formData.confirmed}
              onChange={handleChange}
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={false}>No, tienes que confirmar.</option>
              <option value={true}>Sí, dirección confirmada.</option>
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
              value={formData.visited}
              onChange={handleChange}
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={false}>No, alguien más puede visitar</option>
              <option value={true}>Sí, seguiré visitando.</option>
            </select>
          </div>

          <InputField
            label="Complemento (opcional)"
            name="complement"
            placeholder="Ej: Casa 1  Departamento 1001"
            value={formData.complement || ""}
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
                newUrlPhoto
                  ? newUrlPhoto.photo
                  : changedFields.type
                  ? imagesAddresses[changedFields.type]
                  : formData.photo || newUrlPhoto
              }
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
            {isUploading
              ? "Esperando imagen..."
              : loading
              ? "Enviando alteraciones..."
              : "Enviar"}
            {/* {isUploading ? "Esperando imagen..." : "Enviar alterações"} */}
          </button>
        </form>
      </div>
    </div>
  );
}
UpdateAddress.propTypes = {
  id: PropTypes.string.isRequired,
};

export default UpdateAddress;

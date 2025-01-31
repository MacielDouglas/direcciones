import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import InputField from "../../context/InputField";
import { useMutation } from "@apollo/client";
import { UPDATE_ADDRESS } from "../../graphql/mutation/address.mutation"; // Supõe que existe uma mutation para atualização
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

function UpdateAddress({ addresses, id }) {
  const addressToEdit = addresses.find((address) => address.id === id);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

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

  const [updateAddress] = useMutation(UPDATE_ADDRESS, {
    onCompleted: () => {
      toast.success("Endereço atualizado com sucesso!");
      navigate("/address?tab=search-address"); // Redireciona após a atualização
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar endereço: ${error.message}`);
    },
  });

  const gpsRegex =
    /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?((1[0-7]\d|\d{1,2})(\.\d+)?|180(\.0+)?)$/;

  // Preenche os valores iniciais do formulário com os dados de `addressToEdit`
  useEffect(() => {
    if (addressToEdit) {
      setFormData({
        street: addressToEdit.street || "",
        number: addressToEdit.number || "",
        neighborhood: addressToEdit.neighborhood || "",
        city: addressToEdit.city || "",
        gps: addressToEdit.gps || "",
        complement: addressToEdit.complement || "",
        photo: addressToEdit.photo,
        type: addressToEdit.type || "house",
        active: addressToEdit.active || false,
        confirmed: addressToEdit.confirmed || false,
        visited: addressToEdit.visited || false,
      });
    }
  }, [addressToEdit]);

  // Validações do formulário
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setError(validationErrors);
        return;
      }

      await updateAddress({
        variables: {
          action: "update",
          addressMutationId: id, // ID do endereço que será atualizado
          updateAddressInput: {
            street: formData.street,
            number: formData.number,
            neighborhood: formData.neighborhood,
            city: formData.city,
            gps: formData.gps,
            complement: formData.complement,
            userId: user.userData.id,
            active: formData.active,
            confirmed: formData.confirmed,
            visited: formData.visited,
            type: formData.type,
            photo: formData.photo ? "https://url-da-imagem-selecionada" : null, // Exemplo de uso de uma URL estática
          },
        },
      });
    } catch (error) {
      console.error("Erro ao atualizar endereço: ", error.message);
      toast.error("Erro ao atualizar o endereço.");
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
            placeholder="Ex: Rua Direita"
            name="street"
            value={formData.street}
            onChange={handleChange}
            error={error.street}
          />
          <InputField
            label="Número *"
            name="number"
            placeholder="Ex: 123 ou 123A"
            value={formData.number}
            onChange={handleChange}
            error={error.number}
          />
          <InputField
            label="Bairro *"
            name="neighborhood"
            placeholder="Ex: Vila Porto de Galinhas"
            value={formData.neighborhood}
            onChange={handleChange}
            error={error.neighborhood}
          />
          <InputField
            label="Cidade *"
            name="city"
            placeholder="Ex: Ipojuca"
            value={formData.city}
            onChange={handleChange}
            error={error.city}
          />
          <InputField
            label="GPS (Latitude, Longitude)"
            name="gps"
            placeholder="Ex.: -23.5505, -46.6333"
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
            label="Complemento"
            name="complement"
            placeholder="Ex.: Apartamento 103"
            value={formData.complement}
            onChange={handleChange}
          />
          <button
            type="submit"
            disabled={isButtonDisabled}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              isButtonDisabled ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Atualizar Endereço
          </button>
        </form>
      </div>
    </div>
  );
}

UpdateAddress.propTypes = {
  addresses: PropTypes.array,
  id: PropTypes.string,
};

export default UpdateAddress;

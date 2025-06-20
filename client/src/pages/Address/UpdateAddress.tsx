import { useDispatch, useSelector } from "react-redux";
import { useMemo, useState, useCallback } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { UPDATE_ADDRESS } from "../../graphql/mutations/address.mutations";
import { selectAllAddresses } from "../../store/selectors/addressSelectors";
import { setAddresses } from "../../store/addressSlice";

import { Bed, Home, Hotel, MapPinCheck, Store, Utensils } from "lucide-react";
import InputField from "./ui/InputField";
import GpsComponent from "./components/GpsComponent";
import PhotoComponent from "./components/PhotoComponent";

import type { imagesAddresses } from "../../constants/address";

type AddressType = keyof typeof imagesAddresses;

interface UpdateAddressProps {
  id: string | null;
}

const addressTypes = [
  { value: "house", label: "Casa", icon: <Home size={18} /> },
  { value: "department", label: "Departamento", icon: <Hotel size={18} /> },
  { value: "store", label: "Negócio", icon: <Store size={18} /> },
  { value: "hotel", label: "Hotel", icon: <Bed size={18} /> },
  { value: "restaurant", label: "Restaurante", icon: <Utensils size={18} /> },
] as const;

const COMPLEMENT_MAX_LENGTH = 250;

const UpdateAddress = ({ id }: UpdateAddressProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addresses = useSelector(selectAllAddresses);

  const address = useMemo(
    () => addresses.find((a) => a.id === id) || null,
    [addresses, id]
  );

  const [formData, setFormData] = useState({
    street: address?.street ?? "",
    number: address?.number ?? "",
    neighborhood: address?.neighborhood ?? "",
    city: address?.city ?? "",
    gps: address?.gps ?? "",
    complement: address?.complement ?? "",
    photo: address?.photo ?? "",
    type: address?.type ?? "house",
    active: address?.active ?? true,
    confirmed: address?.confirmed ?? false,
    visited: address?.visited ?? false,
    customName: address?.customName ?? "",
  });

  const [isUploading, setIsUploading] = useState(false);

  const [updateAddress, { loading }] = useMutation(UPDATE_ADDRESS, {
    onCompleted: ({ updateAddress }) => {
      dispatch(
        setAddresses({
          addresses: addresses.map((a) =>
            a.id === updateAddress.address.id ? updateAddress.address : a
          ),
        })
      );
      toast.success("¡Dirección modificada exitosamente!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      navigate(`/addresses?tab=/address/${updateAddress.address.id}`);
    },
    onError: (error) => {
      toast.error(`¡Error al modificar la dirección!, ${error.message}`, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    },
  });

  const isFormValid = useMemo(() => {
    const requiredFields = [
      "street",
      "number",
      "neighborhood",
      "city",
      "gps",
      "photo",
      "type",
    ];
    const hasEmpty = requiredFields.some((key) => {
      const value = formData[key as keyof typeof formData];
      return typeof value === "string" ? !value.trim() : !value;
    });

    const changed = (Object.keys(formData) as (keyof typeof formData)[]).some(
      (key) => {
        return formData[key] !== (address ? address[key] : undefined);
      }
    );

    return !hasEmpty && changed;
  }, [formData, address]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSelectType = useCallback((type: AddressType) => {
    setFormData((prev) => ({ ...prev, type }));
  }, []);

  const handleUploadComplete = useCallback((url: string) => {
    setFormData((prev) => ({ ...prev, photo: url }));
    setIsUploading(false);
  }, []);

  const handleToggleConfirmed = () => {
    setFormData((prev) => ({ ...prev, confirmed: !prev.confirmed }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    await updateAddress({
      variables: {
        input: {
          id,
          ...formData,
        },
      },
    });
  };

  console.log(id);

  return (
    <div className="w-full h-full bg-second-lgt dark:bg-tertiary-drk text-primary-drk dark:text-primary-lgt rounded-2xl max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <MapPinCheck
          className="text-[var(--color-destaque-primary)]"
          size={24}
        />
        Atualizar endereço
      </h1>
      {!id ? (
        <div className="space-y-10 bg-primary-lgt dark:bg-second-drk p-6 rounded-lg text-xl">
          <h2 className="text-2xl font-semibold">
            No ha seleccionado ninguna dirección para cambiar.
          </h2>
          <p>Seleccione primero una dirección para poder realizar cambios.</p>
          <p>
            En esta sección puede cambiar el nombre de la calle, el número, el
            barrio y la ciudad.
          </p>
          <p>
            Puede agregar información adicional para ayudarle a encontrar la
            dirección, como:{" "}
            <span className="font-semibold">
              Dos casas después de la esquina... o frente al supermercado...
            </span>
          </p>
          <p>También puede agregar o cambiar la foto y las coordenadas GPS</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de endereço */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Tipo</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {addressTypes.map(({ value, label, icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleSelectType(value)}
                  className={`flex items-center justify-center gap-2 border rounded-lg p-3 transition-colors ${
                    formData.type === value
                      ? "bg-[var(--color-destaque-second)] text-white dark:bg-[var(--color-tertiary-lgt)] dark:text-black"
                      : "border-gray-300 text-gray-700 dark:text-gray-300 hover:border-gray-400"
                  }`}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          </div>

          {["department", "hotel", "store", "restaurant"].includes(
            formData.type
          ) && (
            <InputField
              label="Nome do local"
              name="customName"
              value={formData.customName}
              onChange={handleChange}
              placeholder="Ej: Condominio Aguas Claras"
              maxLength={250}
            />
          )}

          <InputField
            label="Calle *"
            name="street"
            value={formData.street}
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Número *"
              name="number"
              value={formData.number}
              onChange={handleChange}
              required
            />
            <InputField
              label="Bairro *"
              name="neighborhood"
              value={formData.neighborhood}
              onChange={handleChange}
              required
            />
          </div>
          <InputField
            label="Cidade *"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />

          <InputField
            label="Complemento"
            name="complement"
            value={formData.complement}
            onChange={handleChange}
            isTextarea
            maxLength={COMPLEMENT_MAX_LENGTH}
          />
          <p className="text-right text-sm text-gray-500">
            {COMPLEMENT_MAX_LENGTH - (formData.complement?.length || 0)}{" "}
            caracteres restantes
          </p>

          <GpsComponent formData={formData} setFormData={setFormData} />
          <PhotoComponent
            formData={formData}
            onUploadComplete={handleUploadComplete}
          />

          <div className="mt-4">
            <label className="text-sm text-gray-600 font-semibold mb-1">
              Confirmado *
            </label>
            <div className="flex items-center gap-4 font-bold">
              <p className={!formData.confirmed ? "text-destaque-primary" : ""}>
                NO
              </p>
              <label className="relative block h-8 w-14 rounded-full bg-gray-300 dark:bg-gray-600">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={formData.confirmed}
                  onChange={handleToggleConfirmed}
                />
                <span className="absolute inset-y-0 start-0 m-1 grid size-6 place-content-center rounded-full bg-white transition-[inset-inline-start] peer-checked:start-6 dark:bg-gray-900" />
              </label>
              <p className={formData.confirmed ? "text-destaque-primary" : ""}>
                SÍ
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="p-3 w-full border rounded-full bg-primary-drk dark:bg-destaque-primary text-primary-lgt dark:text-primary-drk hover:bg-destaque-second hover:dark:bg-orange-700 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            disabled={!isFormValid || isUploading || loading}
          >
            {loading
              ? "Atualizando..."
              : !isFormValid
              ? "No hubo ningún cambio"
              : "Actualizar dirección"}
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdateAddress;

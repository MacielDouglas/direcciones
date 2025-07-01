import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { UPDATE_ADDRESS } from "../../graphql/mutations/address.mutations";
import { selectAllAddresses } from "../../store/selectors/addressSelectors";
import { setAddresses } from "../../store/addressSlice";

import { Bed, Home, Hotel, MapPinCheck, Store, Utensils } from "lucide-react";
import InputField from "./ui/InputField";
import GpsComponent from "./components/GpsComponent";
import PhotoComponent from "./components/PhotoComponent";

import type { imagesAddresses } from "../../constants/address";
import { useToastMessage } from "../../hooks/useToastMessage";

type AddressType = keyof typeof imagesAddresses;
interface UpdateAddressProps {
  id: string | null;
}

const COMPLEMENT_MAX_LENGTH = 250;
const STORAGE_KEY = "update-address-form";

const addressTypes = [
  { value: "house", label: "Casa", icon: <Home size={18} /> },
  { value: "department", label: "Departamento", icon: <Hotel size={18} /> },
  { value: "store", label: "Negócio", icon: <Store size={18} /> },
  { value: "hotel", label: "Hotel", icon: <Bed size={18} /> },
  { value: "restaurant", label: "Restaurante", icon: <Utensils size={18} /> },
] as const;

const defaultFormData = {
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  gps: "",
  complement: "",
  photo: "",
  type: "house" as AddressType,
  active: true,
  confirmed: false,
  visited: false,
  customName: "",
};

const UpdateAddress = ({ id }: UpdateAddressProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addresses = useSelector(selectAllAddresses);
  const hasInitialized = useRef(false);
  const { showToast } = useToastMessage();

  const address = useMemo(
    () => addresses.find((a) => a.id === id) || null,
    [addresses, id]
  );

  const [formData, setFormData] = useState({ ...defaultFormData });

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
      showToast({
        message: "¡Dirección modificada exitosamente!",
        type: "success",
      });
      navigate(`/addresses?tab=/address/${updateAddress.address.id}`);
    },
    onError: (error) => {
      showToast({
        message: `¡Error al modificar la dirección!: ${error.message}`,
        type: "error",
      });
    },
  });

  useEffect(() => {
    if (address && !hasInitialized.current) {
      const safeAddress = Object.fromEntries(
        Object.entries({ ...defaultFormData, ...address }).map(([k, v]) => [
          k,
          v === null ? "" : v,
        ])
      ) as typeof defaultFormData;

      setFormData(safeAddress);
      hasInitialized.current = true;
    }
  }, [address]);

  useEffect(() => {
    if (id) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, id]);

  const isFormValid = useMemo(() => {
    const required: (keyof typeof formData)[] = [
      "street",
      "number",
      "neighborhood",
      "city",
      "gps",
      "photo",
      "type",
    ];

    const hasEmpty = required.some((key) =>
      typeof formData[key] === "string"
        ? !formData[key].toString().trim()
        : !formData[key]
    );

    if (!address) return false;

    // Normaliza ambos os objetos para comparação
    const clean = (obj: Record<string, unknown>) =>
      JSON.stringify(
        Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v ?? ""]))
      );

    const formClean = clean(formData);
    const addressClean = clean({ ...defaultFormData, ...address });

    const changed = formClean !== addressClean;

    return !hasEmpty && changed;
  }, [formData, address]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value ?? "" }));
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
    if (!id || !address) return;

    const allowedKeys = [
      "id",
      "street",
      "number",
      "neighborhood",
      "city",
      "gps",
      "complement",
      "photo",
      "type",
      "active",
      "confirmed",
      "visited",
      "customName",
    ];

    const input = Object.fromEntries(
      Object.entries({ id, ...formData }).filter(([k]) =>
        allowedKeys.includes(k)
      )
    );

    await updateAddress({ variables: { input } });
  };

  if (!id) {
    return (
      <div className="space-y-6 bg-primary-lgt dark:bg-second-drk p-6 rounded-lg max-w-2xl mx-auto text-lg">
        <h2 className="text-2xl font-semibold">
          No se ha seleccionado ninguna dirección.
        </h2>
        <p>Seleccione una dirección para editar su información</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-second-lgt dark:bg-tertiary-drk text-primary-drk dark:text-primary-lgt rounded-2xl">
      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <MapPinCheck
          className="text-[var(--color-destaque-primary)]"
          size={24}
        />
        Atualizar endereço
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Tipo</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {addressTypes.map(({ value, label, icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleSelectType(value)}
                className={`flex items-center justify-center gap-2 border rounded-lg p-3 transition ${
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

        {/* Nome personalizado para locais */}
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
          disabled={!isFormValid || isUploading || loading}
          className="p-3 w-full border rounded-full bg-primary-drk dark:bg-destaque-primary text-primary-lgt dark:text-primary-drk hover:bg-destaque-second hover:dark:bg-orange-700 transition disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          {loading
            ? "Atualizando..."
            : !isFormValid
            ? "No hubo ningún cambio"
            : "Actualizar dirección"}
        </button>
      </form>
    </div>
  );
};

export default UpdateAddress;

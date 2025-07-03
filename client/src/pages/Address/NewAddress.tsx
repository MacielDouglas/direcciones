import {
  Bed,
  Camera,
  CheckCheck,
  ChevronRight,
  Home,
  MapPinCheck,
  MapPinPlus,
  NotebookPen,
  Hotel,
  Store,
  Utensils,
  ChevronLeft,
} from "lucide-react";
import { useEffect, useState } from "react";
import GpsComponent from "./components/GpsComponent";
import { ProgressSteps, Step } from "./ui/ProgressSteps";
import ButtonSteps from "./ui/ButtonSteps";
import PhotoComponent from "./components/PhotoComponent";
import InputField from "./ui/InputField";
import { imagesAddresses, typeAddress } from "../../constants/address";
import CompletedForm from "./components/CompletedForm";
import type { AddressFormData } from "../../types/address.types";
import { useNewAddress } from "../../graphql/hooks/useAddress";

type AddressType = keyof typeof typeAddress;

interface AddressTypeOption {
  value: AddressType;
  label: string;
  icon: React.ReactNode;
}

const addressTypes: AddressTypeOption[] = [
  { value: "house", label: "Casa", icon: <Home size={18} /> },
  { value: "department", label: "Departamento", icon: <Hotel size={18} /> },
  { value: "store", label: "Negócio", icon: <Store size={18} /> },
  { value: "hotel", label: "Hotel", icon: <Bed size={18} /> },
  { value: "restaurant", label: "Restaurante", icon: <Utensils size={18} /> },
];

type FormStep = 1 | 2 | 3 | 4;

const NewAddress = () => {
  const [formData, setFormData] = useState<AddressFormData>({
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    gps: "",
    complement: "",
    photo: "",
    type: "house",
    active: true,
    confirmed: false,
    visited: false,
    customName: "",
  });

  const [step, setStep] = useState<FormStep>(1);
  const [charCount, setCharCount] = useState(250);
  const [isUploading, setIsUploading] = useState(false);
  const { newAddress } = useNewAddress();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "complement" && value.length > 250) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectType = (type: AddressType) => {
    setFormData((prev) => ({ ...prev, type }));
  };

  useEffect(() => {
    setCharCount(250 - formData.complement.length);
  }, [formData.complement]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const nextStep = () => step < 4 && setStep((prev) => (prev + 1) as FormStep);
  const prevStep = () => step > 1 && setStep((prev) => (prev - 1) as FormStep);

  const handleUploadComplete = (url: string) => {
    setFormData((prev) => ({ ...prev, photo: url }));
    setIsUploading(false);
  };

  const validateForm = (): Partial<Record<keyof AddressFormData, string>> => {
    const errors: Partial<Record<keyof AddressFormData, string>> = {};
    if (!formData.street.trim()) errors.street = "La calle es obligatoria...";
    if (!formData.number.trim()) errors.number = "El numero es obligatorio...";
    if (!formData.neighborhood.trim())
      errors.neighborhood = "El barrio es obligatorio...";
    if (!formData.city.trim()) errors.city = "La ciudad es obligatoria...";
    if (!formData.gps.trim()) errors.gps = "GPS obligatorio";

    return errors;
  };

  const validationErrors = validateForm();
  const notUpload = Object.keys(validationErrors).length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach((err) => console.error(err));
      return;
    }

    const photoUrl =
      formData.photo || imagesAddresses[formData.type as AddressType];

    try {
      await newAddress({
        variables: {
          newAddressInput: {
            ...formData,
            photo: photoUrl,
            gps: formData.gps.replace(/,(?!\s)/g, ", "),
          },
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error al registrar la dirección: ${error.message}`);
      } else {
        console.error("Error al registrar la dirección:", error);
      }
    }
  };

  return (
    <div className="w-full h-full bg-second-lgt dark:bg-tertiary-drk text-primary-drk dark:text-primary-lgt  rounded-2xl max-w-2xl mx-auto md:p-6">
      <div className="flex items-center gap-4 mb-6 p-6 md:p-0">
        <MapPinPlus
          className="text-[var(--color-destaque-primary)]"
          size={24}
        />
        <h1 className="text-2xl font-semibold">Nueva dirección</h1>
      </div>

      <div className="bg-primary-lgt dark:bg-primary-drk  shadow-sm overflow-hidden md:rounded-2xl">
        <div className="p-1 md:p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <div className="p-6 md:p-0">
                  <h2 className="text-xl font-semibold mb-4">
                    Tipo de endereço
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                    {addressTypes.map(({ value, label, icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleSelectType(value)}
                        className={`flex items-center justify-center gap-2 border rounded-lg p-3 ${
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

                  {["department", "hotel", "store", "restaurant"].includes(
                    formData.type
                  ) && (
                    <InputField
                      label={
                        formData.type === "department"
                          ? "Nombre del condomino *"
                          : formData.type === "hotel"
                          ? "Nombre del hotel o posada"
                          : formData.type === "restaurant"
                          ? "Nombre del restaurante, cafe, heladería..."
                          : "Nombre de la tienda, taller o local..."
                      }
                      name="customName"
                      value={formData.customName}
                      onChange={handleChange}
                      placeholder={
                        formData.type === "department"
                          ? "Ej: Condominio Aguas Claras *"
                          : formData.type === "hotel"
                          ? "Ej: Hotel o Posada Buena Vista *"
                          : formData.type === "restaurant"
                          ? "Ej: Comida Boa Gourmet"
                          : "Ej: Loja Compre Bem"
                      }
                      error={undefined}
                      maxLength={250}
                    />
                  )}
                </div>
                <h2 className="text-xl font-semibold mb-4">
                  Informações básicas
                </h2>

                <InputField
                  label="Calle *"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Nombre de la calle"
                  error={undefined}
                  maxLength={250}
                />

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Número *"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    placeholder="Ej: 123 ou s/n"
                    error={undefined}
                    maxLength={250}
                  />
                  <InputField
                    label="Bairro *"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleChange}
                    placeholder="Ej: Porto de Galinhas"
                    error={undefined}
                    maxLength={250}
                  />
                </div>

                <InputField
                  label="Cidade *"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Ej: Ipojuca"
                  error={undefined}
                  maxLength={250}
                />

                <InputField
                  label="Complemento (opcional)"
                  name="complement"
                  value={formData.complement}
                  onChange={handleChange}
                  placeholder="Ej: Casa 1, Apt 201"
                  isTextarea
                  maxLength={250}
                  error={undefined}
                />
                <p className="text-right text-sm text-gray-500">
                  {charCount} caracteres restantes
                </p>

                <div className="mt-4">
                  <label className="text-sm text-gray-600 font-semibold mb-1">
                    Confirmado *
                  </label>
                  <div className="flex items-center gap-4 font-bold">
                    <p
                      className={
                        formData.confirmed
                          ? ""
                          : "text-destaque-primary font-bold"
                      }
                    >
                      NO
                    </p>
                    <label
                      htmlFor="AcceptConditions"
                      className="relative block h-8 w-14 rounded-full bg-gray-300 transition-colors [-webkit-tap-highlight-color:_transparent] has-checked:bg-destaque-primary dark:bg-gray-600"
                    >
                      <input
                        type="checkbox"
                        id="AcceptConditions"
                        className="peer sr-only"
                        checked={formData.confirmed}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            confirmed: !prev.confirmed,
                          }))
                        }
                      />

                      <span className="absolute inset-y-0 start-0 m-1 grid size-6 place-content-center rounded-full bg-white text-gray-700 transition-[inset-inline-start] peer-checked:start-6 peer-checked:*:first:hidden *:last:hidden peer-checked:*:last:block dark:bg-gray-900 dark:text-gray-200">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                          />
                        </svg>

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"
                          />
                        </svg>
                      </span>
                    </label>
                    <p
                      className={
                        formData.confirmed ? "text-destaque-primary" : ""
                      }
                    >
                      SÍ
                    </p>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-xl font-semibold mb-6">Ubicación GPS</h2>
                <GpsComponent formData={formData} setFormData={setFormData} />
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-xl font-semibold mb-6">Foto do local</h2>
                <PhotoComponent
                  formData={formData}
                  onUploadComplete={handleUploadComplete}
                />
              </>
            )}

            {step === 4 && (
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Revisar e Enviar</h2>
                <CompletedForm
                  formData={formData}
                  validateForm={validateForm}
                  addressTypes={addressTypes}
                />
                <div className="flex w-full justify-center pt-5">
                  <button
                    type="submit"
                    className="p-3 w-full border rounded-full mx-auto cursor-pointer disabled:bg-tertiary-drk disabled:border-tertiary-drk disabled:text-neutral-500 disabled:cursor-not-allowed"
                    disabled={isUploading || notUpload}
                  >
                    {notUpload
                      ? "No se puede enviar"
                      : "Enviar Nueva Dirección"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="px-6 pb-6 flex justify-between flex-col">
          <div className="p-4">
            <ProgressSteps currentStep={step} totalSteps={4}>
              <Step active={step >= 1}>
                <span className="hidden sm:inline">Detalhes</span>
                <NotebookPen />
              </Step>
              <Step active={step >= 2}>
                <span className="hidden sm:inline">Localização</span>
                <MapPinCheck />
              </Step>
              <Step active={step >= 3}>
                <span className="hidden sm:inline">Foto</span>
                <Camera />
              </Step>
              <Step active={step >= 4}>
                <span className="hidden sm:inline">Final</span>
                <CheckCheck />
              </Step>
            </ProgressSteps>
          </div>

          <div className="flex justify-between">
            {step > 1 ? (
              <ButtonSteps
                onClick={prevStep}
                variant="secondary"
                disabled={false}
              >
                <ChevronLeft size={18} /> Voltar
              </ButtonSteps>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <ButtonSteps onClick={nextStep}>
                Próximo <ChevronRight size={18} />
              </ButtonSteps>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewAddress;

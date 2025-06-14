import { imagesAddresses } from "../../../constants/address";

type AddressType = keyof typeof imagesAddresses;

interface FormData {
  type: AddressType;
  customName?: string;
  photo?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  complement?: string;
  gps?: string;
  confirmed?: boolean;
}

interface AddressTypeOption {
  value: AddressType;
  label: string;
  icon: React.ReactNode;
}

interface CompletedFormProps {
  formData: FormData;
  validateForm: () => Record<string, string>;
  addressTypes: AddressTypeOption[];
}

const CompletedForm = ({
  formData,
  validateForm,
  addressTypes,
}: CompletedFormProps) => {
  const error = validateForm();
  console.log(Object.keys(error).length);
  return (
    <div className="flex flex-col space-y-4">
      <h2>Por favor, revise informações</h2>
      <div className="text-sm space-y-2 ">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 ">
          {addressTypes.map(
            ({ value, label, icon }) =>
              formData.type === value && (
                <p
                  key={value}
                  className={`flex items-center  gap-2 font-bold text-2xl`}
                >
                  {icon}
                  {label}
                </p>
              )
          )}
        </div>
        {formData.type !== "house" && (
          <p>
            Nombre del local:{" "}
            <span className="text-lg font-semibold">{formData.customName}</span>
          </p>
        )}
      </div>
      <div className="w-full flex justify-center">
        <img
          src={formData.photo || imagesAddresses[formData.type]}
          alt="Pré-visualização da imagem"
          className="object-cover rounded-md w-full h-64 border border-gray-300"
        />
      </div>
      <div className="text-sm space-y-2 ">
        <p
          className={(error.street || error.number) && "text-destaque-primary"}
        >
          Calle:{" "}
          <span className="text-lg font-semibold">
            {error.street || error.number
              ? `${error.street || error.number}`
              : `${formData.street}, ${formData.number}`}
          </span>
        </p>
        <p className={error.neighborhood && "text-destaque-primary"}>
          Barrio:{" "}
          <span className="text-lg font-semibold">
            {error.neighborhood
              ? `${error.neighborhood}`
              : `${formData.neighborhood}`}
          </span>
        </p>
        <p className={error.city && "text-destaque-primary"}>
          Ciudad:{" "}
          <span className="text-lg font-semibold">
            {error.city ? `${error.city}` : `${formData.city}`}
          </span>
        </p>

        <p>
          Complemento:{" "}
          <span className="text-lg font-semibold">{formData.complement}</span>
        </p>

        <p className={error.gps && "text-destaque-primary"}>
          GPS:{" "}
          <span className="text-lg font-semibold">
            {error.gps ? `${error.gps}` : `${formData.gps}`}
          </span>
        </p>

        <p>
          Confimado:{" "}
          <span className="text-lg font-semibold">
            {formData.confirmed ? "Sí" : "No"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default CompletedForm;

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

  return (
    <div className="w-full h-full bg-second-lgt dark:bg-tertiary-drk text-primary-drk dark:text-primary-lgt rounded-2xl max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <MapPinCheck
          className="text-[var(--color-destaque-primary)]"
          size={24}
        />
        Atualizar endereço
      </h1>
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
    </div>
  );
};

export default UpdateAddress;

// import { useDispatch, useSelector } from "react-redux";
// import { selectAllAddresses } from "../../store/selectors/addressSelectors";
// import { useMemo, useState } from "react";
// import { useMutation } from "@apollo/client";
// import { UPDATE_ADDRESS } from "../../graphql/mutations/address.mutations";
// import { useNavigate } from "react-router-dom";
// import { setAddresses } from "../../store/addressSlice";
// import toast from "react-hot-toast";
// import type { imagesAddresses } from "../../constants/address";
// import { Bed, Home, Hotel, MapPinCheck, Store, Utensils } from "lucide-react";
// import InputField from "./ui/InputField";
// import GpsComponent from "./components/GpsComponent";
// import PhotoComponent from "./components/PhotoComponent";

// type AddressType = keyof typeof imagesAddresses;

// interface UpdateAddressProps {
//   id: string | null;
// }

// const addressTypes = [
//   { value: "house", label: "Casa", icon: <Home size={18} /> },
//   { value: "department", label: "Departamento", icon: <Hotel size={18} /> },
//   { value: "store", label: "Negócio", icon: <Store size={18} /> },
//   { value: "hotel", label: "Hotel", icon: <Bed size={18} /> },
//   { value: "restaurant", label: "Restaurante", icon: <Utensils size={18} /> },
// ] as const;

// const COMPLEMENT_MAX_LENGTH = 250;

// const UpdateAddress = ({ id }: UpdateAddressProps) => {
//   const addresses = useSelector(selectAllAddresses);
//   const address = useMemo(
//     () => addresses.find((a) => a.id === id),
//     [addresses, id]
//   );

//   const [updateAddress, { loading }] = useMutation(UPDATE_ADDRESS, {
//     onCompleted: (data) => {
//       const updatedAddress = data.updateAddress.address;
//       dispatch(
//         setAddresses({
//           addresses: addresses.map((addr) =>
//             addr.id === updatedAddress.id ? updatedAddress : addr
//           ),
//         })
//       );
//       toast.success("¡Dirección modificada exitosamente!", {
//         style: {
//           borderRadius: "10px",
//           background: "#333",
//           color: "#fff",
//         },
//       });
//       navigate(`/addresses?tab=/address/${updatedAddress.id}`);
//     },
//     onError: (error) => {
//       toast.error(`¡Error al modificar la dirección!, ${error.message}`, {
//         style: {
//           borderRadius: "10px",
//           background: "#333",
//           color: "#fff",
//         },
//       });
//     },
//   });

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     street: address?.street || "",
//     number: address?.number || "",
//     neighborhood: address?.neighborhood || "",
//     city: address?.city || "",
//     gps: address?.gps || "",
//     complement: address?.complement || "",
//     photo: address?.photo || "",
//     type: address?.type || "house",
//     active: address?.active ?? true,
//     confirmed: address?.confirmed ?? false,
//     visited: address?.visited ?? false,
//     customName: address?.customName || "",
//   });
//   const [isUploading, setIsUploading] = useState(false);

//   const isFormValid = useMemo(() => {
//     // Campos obrigatórios (não podem ser vazios)
//     const requiredFields = [
//       formData.street?.trim(),
//       formData.number?.trim(),
//       formData.neighborhood?.trim(),
//       formData.city?.trim(),
//       formData.type?.trim(),
//       formData.gps?.trim(),
//       formData.photo?.trim(),
//     ];

//     // Verifica se algum campo obrigatório está vazio
//     const hasEmptyRequiredField = requiredFields.some(
//       (field) => !field || field.length === 0
//     );

//     if (hasEmptyRequiredField) {
//       return false; // Se algum campo obrigatório estiver vazio, retorna falso
//     }

//     // Verifica se algum campo foi alterado (incluindo complement e customName)
//     const hasChanged = [
//       formData.street.trim() !== address?.street?.trim(),
//       formData.number.trim() !== address?.number?.trim(),
//       formData.neighborhood.trim() !== address?.neighborhood?.trim(),
//       formData.city.trim() !== address?.city?.trim(),
//       formData.type.trim() !== address?.type?.trim(),
//       formData.gps.trim() !== address?.gps?.trim(),
//       formData.complement?.trim() !== address?.complement?.trim(), // Opcional
//       formData.photo.trim() !== address?.photo?.trim(),
//       Boolean(formData.customName?.trim() || address?.customName?.trim()) &&
//         formData.customName?.trim() !== address?.customName?.trim(), // Opcional
//       formData.confirmed !== address?.confirmed,
//       formData.visited !== address?.visited,
//     ].some(Boolean);

//     return hasChanged;
//   }, [formData, address]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSelectType = (type: AddressType) => {
//     setFormData((prev) => ({ ...prev, type }));
//   };

//   const handleUploadComplete = (url: string) => {
//     setFormData((prev) => ({ ...prev, photo: url }));
//     setIsUploading(false);
//   };

//   const handleToggleConfirmed = () => {
//     const newValue = !formData.confirmed;
//     setFormData((prev) => ({ ...prev, confirmed: newValue }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!address) {
//       console.error("Error: Address not found.");
//       return;
//     }

//     const updateData = {
//       // id: address.id,
//       id: id,
//       ...Object.fromEntries(
//         Object.entries(formData).filter(([, value]) => value !== undefined)
//       ),
//     };

//     try {
//       await updateAddress({
//         variables: {
//           input: updateData,
//         },
//       });
//     } catch (error) {
//       console.error("Failed to update address:", error);
//     }
//   };

//   return (
//     <div className="w-full h-full bg-second-lgt dark:bg-tertiary-drk text-primary-drk dark:text-primary-lgt rounded-2xl max-w-2xl mx-auto p-6">
//       <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
//         <MapPinCheck
//           className="text-[var(--color-destaque-primary)]"
//           size={24}
//         />
//         Atualizar endereço
//       </h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <h2 className="text-xl font-semibold mb-2">Tipo</h2>
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//             {/* onClick={() => } */}
//             {addressTypes.map(({ value, label, icon }) => (
//               <button
//                 key={value}
//                 type="button"
//                 onClick={() => [
//                   handleSelectType((formData.type = value)),
//                   toast.success("Operação concluída!"),
//                 ]}
//                 className={`flex items-center justify-center gap-2 border rounded-lg p-3 transition-colors ${
//                   formData.type === value
//                     ? "bg-[var(--color-destaque-second)] text-white dark:bg-[var(--color-tertiary-lgt)] dark:text-black"
//                     : "border-gray-300 text-gray-700 dark:text-gray-300 hover:border-gray-400"
//                 }`}
//               >
//                 {icon}
//                 {label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {["department", "hotel", "store", "restaurant"].includes(
//           formData.type
//         ) && (
//           <InputField
//             label="Nome do local"
//             name="customName"
//             value={formData.customName}
//             onChange={handleChange}
//             placeholder="Ej: Condominio Aguas Claras"
//             maxLength={250}
//           />
//         )}

//         <InputField
//           label="Calle *"
//           name="street"
//           value={formData.street}
//           onChange={handleChange}
//           placeholder="Nombre de la calle"
//           maxLength={250}
//           required
//         />

//         <div className="grid grid-cols-2 gap-4">
//           <InputField
//             label="Número *"
//             name="number"
//             value={formData.number}
//             onChange={handleChange}
//             placeholder="Ej: 123 ou s/n"
//             maxLength={250}
//             required
//           />
//           <InputField
//             label="Bairro *"
//             name="neighborhood"
//             value={formData.neighborhood}
//             onChange={handleChange}
//             placeholder="Ej: Porto de Galinhas"
//             maxLength={250}
//             required
//           />
//         </div>

//         <InputField
//           label="Cidade *"
//           name="city"
//           value={formData.city}
//           onChange={handleChange}
//           placeholder="Ej: Ipojuca"
//           maxLength={250}
//           required
//         />

//         <InputField
//           label="Complemento"
//           name="complement"
//           value={formData.complement}
//           onChange={handleChange}
//           placeholder="Ej: Casa 1, Apt 201"
//           isTextarea
//           maxLength={COMPLEMENT_MAX_LENGTH}
//         />
//         <p className="text-right text-sm text-gray-500">
//           {COMPLEMENT_MAX_LENGTH - (formData.complement?.length || 0)}{" "}
//           caracteres restantes
//         </p>

//         <GpsComponent formData={formData} setFormData={setFormData} />

//         <PhotoComponent
//           formData={formData}
//           onUploadComplete={handleUploadComplete}
//         />

//         <div className="mt-4">
//           <label className="text-sm text-gray-600 font-semibold mb-1">
//             Confirmado *
//           </label>
//           <div className="flex items-center gap-4 font-bold">
//             <p
//               className={
//                 !formData.confirmed ? "text-destaque-primary font-bold" : ""
//               }
//             >
//               NO
//             </p>
//             <label className="relative block h-8 w-14 rounded-full bg-gray-300 transition-colors [-webkit-tap-highlight-color:_transparent] has-checked:bg-destaque-primary dark:bg-gray-600">
//               <input
//                 type="checkbox"
//                 className="peer sr-only"
//                 checked={formData.confirmed}
//                 onChange={handleToggleConfirmed}
//               />

//               <span className="absolute inset-y-0 start-0 m-1 grid size-6 place-content-center rounded-full bg-white text-gray-700 transition-[inset-inline-start] peer-checked:start-6 peer-checked:*:first:hidden *:last:hidden peer-checked:*:last:block dark:bg-gray-900 dark:text-gray-200">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth="1.5"
//                   stroke="currentColor"
//                   className="size-4"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M6 18 18 6M6 6l12 12"
//                   />
//                 </svg>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth="1.5"
//                   stroke="currentColor"
//                   className="size-4"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="m4.5 12.75 6 6 9-13.5"
//                   />
//                 </svg>
//               </span>
//             </label>
//             <p className={formData.confirmed ? "text-destaque-primary" : ""}>
//               SÍ
//             </p>
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="p-3 w-full border rounded-full cursor-pointer bg-primary-drk dark:bg-destaque-primary text-primary-lgt dark:text-primary-drk hover:bg-destaque-second hover:dark:bg-orange-700 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
//           disabled={!isFormValid || isUploading || loading}
//         >
//           {loading
//             ? "Atualizando..."
//             : !isFormValid
//             ? "No hubo ningún cambio"
//             : "Actualizar dirección"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default UpdateAddress;

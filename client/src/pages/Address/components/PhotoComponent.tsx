import { useState, useMemo } from "react";
import heic2any from "heic2any";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../../../firebase/firebase";
import { imagesAddresses } from "../../../constants/address";

const MAX_FILE_SIZE_MB = 5;

type AddressType = keyof typeof imagesAddresses;

interface PhotoComponentProps {
  onUploadComplete: (url: string) => void;
  formData: {
    photo?: string;
    type: AddressType;
    [key: string]: unknown;
  };
}

const PhotoComponent = ({
  onUploadComplete,
  formData,
}: PhotoComponentProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Calcula a imagem de fallback apenas uma vez
  const fallbackImage = useMemo(
    () => formData.photo || imagesAddresses[formData.type],
    [formData.photo, formData.type]
  );

  // Imagem atual a ser exibida
  const currentImage = previewUrl || fallbackImage;

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith("image/")) {
      return "Por favor, selecione um arquivo de imagem válido.";
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `A imagem deve ter no máximo ${MAX_FILE_SIZE_MB}MB.`;
    }
    return null;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      let processedFile = file;

      // Converter HEIC/HEIF para JPEG
      if (file.type === "image/heic" || file.type === "image/heif") {
        const heicResult = await heic2any({ blob: file, toType: "image/jpeg" });
        const blob = Array.isArray(heicResult) ? heicResult[0] : heicResult;
        processedFile = new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
          type: "image/jpeg",
        });
      }

      // Converter para WebP
      const webpFile = await convertToWebP(processedFile);
      setImageFile(webpFile);
      setPreviewUrl(URL.createObjectURL(webpFile));
      setError("");
    } catch (err) {
      console.error("Erro ao processar a imagem:", err);
      setError("Erro ao processar a imagem.");
    }
  };

  const convertToWebP = (file: File, quality = 0.9): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject("Erro no canvas.");

          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject("Falha ao converter para WebP.");
              resolve(
                new File([blob], file.name.replace(/\.\w+$/, ".webp"), {
                  type: "image/webp",
                })
              );
            },
            "image/webp",
            quality
          );
        };
        img.onerror = () => reject("Erro ao carregar a imagem.");
        img.src = reader.result as string;
      };
      reader.onerror = () => reject("Erro ao ler o arquivo.");
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async () => {
    if (!imageFile) {
      setError("Nenhuma imagem selecionada.");
      return;
    }

    setIsUploading(true);
    try {
      const storage = getStorage(app);
      const storageRef = ref(storage, `direcciones/${imageFile.name}`);
      const metadata = { contentType: "image/webp" };

      await uploadBytes(storageRef, imageFile, metadata);
      const downloadURL = await getDownloadURL(storageRef);

      onUploadComplete(downloadURL);

      // Limpar estado
      setImageFile(null);
      setPreviewUrl("");
      setError("");
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Erro ao enviar a imagem.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="w-full flex justify-center">
        <img
          src={currentImage}
          alt="Pré-visualização da imagem"
          className="object-cover rounded-md w-full h-64 border border-gray-300"
        />
      </div>

      <h2 className="text-xl font-semibold text-gray-800">
        ¿Quieres enviar una foto?
      </h2>
      <p className="text-sm text-gray-600 text-center max-w-md">
        Puedes seleccionar una foto existente o tomar una nueva. Luego, haz clic
        en "Subir imagen" para completar el envío.
      </p>

      <input
        type="file"
        accept="image/*, .heic, .heif"
        onChange={handleImageChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        onClick={handleUpload}
        disabled={!imageFile || isUploading}
        className={`px-4 py-2 text-white font-medium rounded-lg transition-colors duration-200 ${
          !imageFile || isUploading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {isUploading ? "Enviando..." : "Subir imagen"}
      </button>
    </div>
  );
};

export default PhotoComponent;

// import { useState } from "react";
// import heic2any from "heic2any";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { app } from "../../../firebase/firebase";
// import { imagesAddresses } from "../../../constants/address";

// const MAX_FILE_SIZE_MB = 5;

// type AddressType = keyof typeof imagesAddresses;

// interface PhotoComponentProps {
//   onUploadComplete: (url: string) => void;
//   formData: {
//     photo?: string;
//     type: AddressType;
//     [key: string]: unknown;
//   };
// }

// const PhotoComponent = ({
//   onUploadComplete,
//   formData,
// }: PhotoComponentProps) => {
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState("");
//   const [error, setError] = useState("");
//   const [isUploading, setIsUploading] = useState(false);

//   const fallbackImage = formData.photo || imagesAddresses[formData.type];

//   const validateFile = (file: File): string | null => {
//     if (!file.type.startsWith("image/")) {
//       return "Por favor, selecione um arquivo de imagem válido.";
//     }
//     if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
//       return `A imagem deve ter no máximo ${MAX_FILE_SIZE_MB}MB.`;
//     }
//     return null;
//   };

//   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const validationError = validateFile(file);
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     try {
//       let processedFile = file;

//       if (file.type === "image/heic" || file.type === "image/heif") {
//         const heicResult = await heic2any({ blob: file, toType: "image/jpeg" });
//         const blob = Array.isArray(heicResult) ? heicResult[0] : heicResult;
//         processedFile = new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
//           type: "image/jpeg",
//         });
//       }

//       const webpFile = await convertToWebP(processedFile);
//       setImageFile(webpFile);
//       setPreviewUrl(URL.createObjectURL(webpFile));
//       setError("");
//     } catch (err) {
//       console.error("Erro ao processar a imagem:", err);
//       setError("Erro ao processar a imagem.");
//     }
//   };

//   const convertToWebP = (file: File, quality = 0.9): Promise<File> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => {
//         const img = new Image();
//         img.onload = () => {
//           const canvas = document.createElement("canvas");
//           canvas.width = img.width;
//           canvas.height = img.height;
//           const ctx = canvas.getContext("2d");
//           if (!ctx) return reject("Erro no canvas.");

//           ctx.drawImage(img, 0, 0);
//           canvas.toBlob(
//             (blob) => {
//               if (!blob) return reject("Falha ao converter para WebP.");
//               resolve(
//                 new File([blob], file.name.replace(/\.\w+$/, ".webp"), {
//                   type: "image/webp",
//                 })
//               );
//             },
//             "image/webp",
//             quality
//           );
//         };
//         img.onerror = () => reject("Erro ao carregar a imagem.");
//         img.src = reader.result as string;
//       };
//       reader.onerror = () => reject("Erro ao ler o arquivo.");
//       reader.readAsDataURL(file);
//     });
//   };

//   const handleUpload = async () => {
//     if (!imageFile) {
//       setError("Nenhuma imagem selecionada.");
//       return;
//     }

//     setIsUploading(true);
//     try {
//       const storage = getStorage(app);
//       const storageRef = ref(storage, `direcciones/${imageFile.name}`);
//       const metadata = { contentType: "image/webp" };

//       await uploadBytes(storageRef, imageFile, metadata);
//       const downloadURL = await getDownloadURL(storageRef);

//       onUploadComplete(downloadURL);

//       // Clean up
//       setImageFile(null);
//       setPreviewUrl("");
//       setError("");
//     } catch (err) {
//       console.error("Upload failed:", err);
//       setError("Erro ao enviar a imagem.");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center gap-4 p-4 bg-gray-100 rounded-lg shadow-md">
//       <div className="w-full flex justify-center">
//         <img
//           src={previewUrl || fallbackImage}
//           alt="Pré-visualização da imagem"
//           className="object-cover rounded-md w-full h-64 border border-gray-300"
//         />
//       </div>

//       <h2 className="text-xl font-semibold text-gray-800">
//         ¿Quieres enviar una foto?
//       </h2>
//       <p className="text-sm text-gray-600 text-center max-w-md">
//         Puedes seleccionar una foto existente o tomar una nueva. Luego, haz clic
//         en "Subir imagen" para completar el envío.
//       </p>

//       <input
//         type="file"
//         accept="image/*, .heic, .heif"
//         onChange={handleImageChange}
//         className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
//       />

//       {previewUrl && (
//         <img
//           src={previewUrl}
//           alt="Prévia"
//           className="w-full max-w-xs rounded-lg border border-gray-300"
//         />
//       )}

//       {error && <p className="text-sm text-red-500">{error}</p>}

//       <button
//         onClick={handleUpload}
//         disabled={!imageFile || isUploading}
//         className={`px-4 py-2 text-white font-medium rounded-lg transition-colors duration-200 ${
//           !imageFile || isUploading
//             ? "bg-gray-400 cursor-not-allowed"
//             : "bg-indigo-600 hover:bg-indigo-700"
//         }`}
//       >
//         {isUploading ? "Enviando..." : "Subir imagen"}
//       </button>
//     </div>
//   );
// };

// export default PhotoComponent;

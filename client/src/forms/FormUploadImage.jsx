import { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";

const FormUploadImage = ({ onUploadComplete }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Por favor, envie um arquivo de imagem.");
      return;
    }

    setError("");
    try {
      const webpImage = await convertToWebP(file, 0.9);
      setImage(webpImage);
      setPreview(URL.createObjectURL(webpImage));
    } catch (error) {
      console.error("Erro ao converter a imagem:", error);
      setError("Erro ao processar a imagem.");
    }
  };

  const convertToWebP = (file, quality = 0.9) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(
                new File([blob], `${file.name.split(".")[0]}.webp`, {
                  type: "image/webp",
                })
              );
            } else {
              reject(new Error("Erro ao criar blob da imagem."));
            }
          },
          "image/webp",
          quality
        );
      };

      reader.onerror = () => reject(new Error("Erro ao ler o arquivo."));
      img.onerror = () => reject(new Error("Erro ao carregar a imagem."));
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async () => {
    if (!image) {
      setError("Nenhuma imagem selecionada.");
      return;
    }

    setIsUploading(true);
    try {
      const storage = getStorage(app);
      const storageRef = ref(storage, `direcciones/${image.name}`);
      await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(storageRef);

      onUploadComplete(downloadURL);
      setImage(null);
      setPreview("");
      setError("");
      setIsUploading(false);
    } catch (error) {
      console.error("Erro ao enviar a imagem:", error);
      setError("Erro ao enviar a imagem.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800">Subir Imagem</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
      />
      {preview && (
        <img
          src={preview}
          alt="Pré-visualização"
          className="w-full max-w-xs rounded-lg border border-gray-300"
        />
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        onClick={handleUpload}
        disabled={!image || isUploading}
        className={`px-4 py-2 text-white font-medium rounded-lg ${
          image && !isUploading
            ? "bg-indigo-600 hover:bg-indigo-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {isUploading ? "Enviando..." : "Enviar Imagem"}
      </button>
    </div>
  );
};

export default FormUploadImage;

// import { useState } from "react";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { app } from "../firebase";

// const FormUploadImage = ({ setIsUploading }) => {
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState("");
//   const [error, setError] = useState("");
//   // const [isUploading, setIsUploading] = useState(false);

//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (!file.type.startsWith("image/")) {
//         setError("Por favor, envie um arquivo de imagem.");
//         return;
//       }

//       try {
//         const webpImage = await convertToWebP(file, 0.9); // Converte para WebP com qualidade de 90%
//         setImage(webpImage);

//         const previewURL = URL.createObjectURL(webpImage);
//         setPreview(previewURL);
//         setError("");
//       } catch (error) {
//         console.error("Erro ao converter a imagem:", error);
//         setError("Erro ao processar a imagem.");
//       }
//     }
//   };

//   const convertToWebP = (file, quality = 0.9) => {
//     return new Promise((resolve, reject) => {
//       const img = new Image();
//       const reader = new FileReader();

//       reader.onload = (e) => {
//         img.src = e.target.result;
//       };

//       img.onload = () => {
//         const canvas = document.createElement("canvas");
//         const ctx = canvas.getContext("2d");

//         canvas.width = img.width;
//         canvas.height = img.height;

//         ctx.drawImage(img, 0, 0, img.width, img.height);

//         canvas.toBlob(
//           (blob) => {
//             if (blob) {
//               resolve(
//                 new File([blob], `${file.name.split(".")[0]}.webp`, {
//                   type: "image/webp",
//                 })
//               );
//             } else {
//               reject(new Error("Erro ao criar blob da imagem."));
//             }
//           },
//           "image/webp",
//           quality
//         );
//       };

//       reader.onerror = () => reject(new Error("Erro ao ler o arquivo."));
//       img.onerror = () => reject(new Error("Erro ao carregar a imagem."));
//       reader.readAsDataURL(file);
//     });
//   };

//   const handleUpload = async () => {
//     if (!image) {
//       setError("Nenhuma imagem selecionada.");
//       return;
//     }

//     try {
//       const storage = getStorage(app); // Usa o `app` já inicializado
//       const storageRef = ref(storage, `direcciones/${image.name}`);

//       await uploadBytes(storageRef, image);
//       const downloadURL = await getDownloadURL(storageRef);

//       setIsUploading(downloadURL);

//       console.log("URL da imagem:", downloadURL);
//       alert("Imagem enviada com sucesso!");

//       setImage(null);
//       setPreview("");
//     } catch (error) {
//       console.error("Erro ao enviar a imagem:", error);
//       setError("Erro ao enviar a imagem.");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center gap-4 p-4 bg-gray-100 rounded-lg shadow-md">
//       <h2 className="text-xl font-semibold text-gray-800">
//         Subir imagen (opcional)
//       </h2>

//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleImageChange}
//         className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
//       />
//       {preview && (
//         <img
//           src={preview}
//           alt="Pré-visualização"
//           className="w-full max-w-xs rounded-lg border border-gray-300"
//         />
//       )}
//       {error && <p className="text-sm text-red-500">{error}</p>}
//       <button
//         onClick={handleUpload}
//         disabled={!image}
//         className={`px-4 py-2 text-white font-medium rounded-lg ${
//           image
//             ? "bg-indigo-600 hover:bg-indigo-700"
//             : "bg-gray-400 cursor-not-allowed"
//         }`}
//       >
//         Enviar Imagem
//       </button>
//     </div>
//   );
// };

// export default FormUploadImage;

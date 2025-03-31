import { useState } from "react";
import heic2any from "heic2any";
import PropTypes from "prop-types";
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
      setError("Por favor, sube un archivo de imagen.");
      return;
    }

    try {
      let convertedFile = file;

      if (file.type === "image/heic" || file.type === "image/heif") {
        const blob = await heic2any({ blob: file, toType: "image/jpeg" });
        convertedFile = new File([blob], `${file.name.split(".")[0]}.jpg`, {
          type: "image/jpeg",
        });
      }

      const webpImage = await convertToWebP(convertedFile);
      setImage(webpImage);
      setPreview(URL.createObjectURL(webpImage));
      setError("");
    } catch (error) {
      console.error("Error al convertir la imagen:", error);
      setError("Error al procesar la imagen.");
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
              reject(new Error("Error al procesar la imagen."));
            }
          },
          "image/webp",
          quality
        );
      };

      reader.onerror = () => reject(new Error("Error al leer el archivo."));
      img.onerror = () => reject(new Error("Error al cargar la imagen."));
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async () => {
    if (!image) {
      setError("No hay ninguna imagen seleccionada.");
      return;
    }

    setIsUploading(true);
    try {
      const storage = getStorage(app);
      const storageRef = ref(storage, `direcciones/${image.name}`);
      // const storageRef = ref(storage, `standard/${image.name}`);
      const metadata = {
        contentType: "image/webp", // Forçar o tipo da imagem
      };
      await uploadBytes(storageRef, image, metadata);
      const downloadURL = await getDownloadURL(storageRef);

      onUploadComplete(downloadURL);
      setImage(null);
      setPreview("");
      setError("");
    } catch (error) {
      setError(`Error al cargar la imagen: ${error}.`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800">
        ¿Quieres enviar una foto?
      </h2>
      <p className="text-sm text-gray-600">
        Si deseas enviar una foto, primero debes tomar una foto o seleccionar
        una, luego debes enviar la imagen. Sólo entonces podrás enviar el
        formulario.
      </p>
      <input
        type="file"
        accept="image/*, .heic, .heif"
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
        {isUploading ? "Enviando..." : "Subir imagen"}
      </button>
    </div>
  );
};

FormUploadImage.propTypes = {
  onUploadComplete: PropTypes.func.isRequired,
};

export default FormUploadImage;

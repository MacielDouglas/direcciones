import { useState } from "react";
import PhotoAddressSkeleton from "./skeletons/PhotoAddressSkeleton";

interface PhotoAddressProps {
  photo?: string;
  street: string;
  wid?: string;
  hei?: string;
}

const PhotoAddress: React.FC<PhotoAddressProps> = ({
  photo,
  street,
  wid = "w-full",
  hei = "h-48",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const toggleModal = () => setIsModalOpen((prev) => !prev);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {photo && (
        <button
          onClick={toggleModal}
          className="block focus:outline-none focus:ring-2 focus:ring-primary rounded-2xl overflow-hidden"
          aria-label={`Ver foto do endereço: ${street}`}
        >
          {isLoading && <PhotoAddressSkeleton />}

          {!hasError && (
            <img
              src={photo}
              alt={`Foto da rua ${street}`}
              className={`object-cover rounded-xl transition-opacity duration-300 ${wid} ${hei} shadow-sm ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
            />
          )}

          {hasError && (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-zinc-800 text-sm text-center text-gray-500 p-4 rounded-xl">
              Falha ao carregar imagem
            </div>
          )}
        </button>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] rounded-3xl overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photo}
              alt={`Foto ampliada da rua ${street}`}
              className="w-full h-full object-contain bg-black rounded-3xl"
            />
            <button
              onClick={closeModal}
              aria-label="Fechar visualização da imagem"
              className="absolute top-4 right-4 bg-black/60 text-white text-xl rounded-full w-10 h-10 flex items-center justify-center shadow-md backdrop-blur"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoAddress;

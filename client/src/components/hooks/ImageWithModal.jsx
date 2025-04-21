import { useState } from "react";
import PropTypes from "prop-types";

function ImageWithModal({ photo, street, wid, hei }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {photo && (
        <div className="cursor-pointer" onClick={toggleModal}>
          <img
            src={photo}
            className={`object-cover rounded-md mb-3 ${wid ? wid : "w-full"} ${
              hei ? hei : "h-48"
            }`}
            alt={street}
          />
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={photo}
              className="max-w-full max-h-[90vh] object-contain"
              alt={street}
              onClick={(e) => e.stopPropagation()} // Previne o fechamento ao clicar na imagem
            />
            <button
              className="absolute top-2 right-2 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
              onClick={closeModal}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
}
ImageWithModal.propTypes = {
  photo: PropTypes.string.isRequired,
  street: PropTypes.string.isRequired,
};

export default ImageWithModal;

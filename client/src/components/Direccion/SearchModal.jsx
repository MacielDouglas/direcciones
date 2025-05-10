import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdHouse,
  MdRestaurant,
  MdHotel,
  MdOutlineStorefront,
  MdOutlineApartment,
} from "react-icons/md";
import { RiCloseLine } from "react-icons/ri";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

function SearchModal({ isOpen, onClose }) {
  const addresses = useSelector((state) => state.addresses.addressesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAddresses = addresses.filter((address) =>
    address.street.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredAddresses.length / itemsPerPage);

  const paginatedAddresses = filteredAddresses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-secondary bg-opacity-85 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ y: "-100vh" }}
            animate={{ y: 0 }}
            exit={{ y: "100vh" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-details rounded-lg shadow-lg w-full max-w-3xl p-6 md:p-12 h-screen overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl uppercase tracking-widest">
                Buscar Dirección
              </h1>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-4xl focus:outline-none"
              >
                <RiCloseLine />
              </button>
            </div>

            <div className="mb-4 border-b pb-4 flex flex-col items-center gap-4">
              <input
                type="text"
                placeholder="Buscar dirección"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full max-w-md p-2 border  shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => setSearchTerm("")}
                className="py-2 px-4 border border-secondary hover:bg-gray-100"
              >
                Limpiar búsqueda
              </button>

              <h2>
                Encontrado {searchTerm.length && filteredAddresses.length}{" "}
                {searchTerm.length > 1 && filteredAddresses.length === 1
                  ? "dirección"
                  : "direcciones"}
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              <AnimatePresence>
                {searchTerm &&
                  paginatedAddresses.map((address) => (
                    <motion.div
                      key={address.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col sm:flex-row items-start sm:items-center pb-4 border-b"
                    >
                      <Link
                        to={`/address?tab=/address/${address.id}`}
                        className={`"w-full ${
                          !address.active && "text-red-500"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">
                            {(address.type === "house" && <MdHouse />) ||
                              (address.type === "department" && (
                                <MdOutlineApartment />
                              )) ||
                              (address.type === "store" && (
                                <MdOutlineStorefront />
                              )) ||
                              (address.type === "restaurant" && (
                                <MdRestaurant />
                              )) ||
                              (address.type === "hotel" && <MdHotel />)}
                          </span>
                          <div>
                            <p className="text-lg font-semibold">
                              {address.street}, {address.number}
                            </p>
                            <p
                              className={`text-sm ${
                                !address.active && "text-red-500"
                              }`}
                            >
                              {/* <p className="text-sm text-gray-600"> */}
                              {address.city}, {address.neighborhood}
                            </p>
                            <p className="text-sm truncate">
                              {address.complement}
                            </p>
                            <p
                              className={`text-sm ${
                                !address.active
                                  ? "text-red-500 font-semibold"
                                  : address.confirmed
                                  ? "text-blue-600"
                                  : "text-orange-600 font-semibold"
                              }`}
                            >
                              {!address.active
                                ? "Dirección inactiva"
                                : address.confirmed
                                ? "Dirección confirmada"
                                : "NECESITA CONFIRMACIÓN"}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>

            {searchTerm && filteredAddresses.length > itemsPerPage && (
              <div className="flex justify-center mt-6 gap-2">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}

            {!searchTerm && (
              <div className="text-center text-lg mt-6">
                <p>Para empezar, busque una calle por su nombre</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SearchModal;

SearchModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

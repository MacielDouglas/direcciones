import { useState, useEffect } from "react";
import {
  MdHouse,
  MdRestaurant,
  MdHotel,
  MdOutlineStorefront,
  MdOutlineApartment,
} from "react-icons/md";
import SearchModal from "./SearchModal";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../../context/Loading";
import { calculateDistance } from "../../constants/direccion";

function SearchAddress() {
  const addresses = useSelector((state) => state.addresses.addressesData);
  const [currentPage, setCurrentPage] = useState(1);
  const [userLocation, setUserLocation] = useState(null); // Localização do usuário
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const openSearchModal = () => setIsSearchOpen(true);
  const closeSearchModal = () => setIsSearchOpen(false);

  // Captura a localização do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Erro ao obter a localização do usuário:", error);
        }
      );
    }
  }, []);

  if (addresses === null)
    return (
      <div className="p-8">
        <Loading text="No tenemos direcciones para buscar..." />;
      </div>
    );
  // Ordena os endereços em ordem decrescente (por id ou outra propriedade relevante)
  const sortedAddresses = [...addresses].sort((a, b) => b - a);

  // Configuração da paginação
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedAddresses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAddresses = sortedAddresses.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-details py-5 px-6  flex flex-col items-center justify-center">
      <div className="flex items-center justify-center my-6 bg-details ">
        <button
          onClick={openSearchModal}
          className="w-full max-w-xs bg-secondary text-white font-semibold py-3 px-6 shadow-md hover:bg-sky-700 transition-colors"
        >
          Pesquisar direcciones
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 space-y-6 w-full">
        <h2 className="text-center">
          Encontrado, {sortedAddresses.length}{" "}
          {sortedAddresses.length <= 1 ? "dirección" : "direcciones"}
        </h2>
        <ul className="space-y-4">
          {paginatedAddresses.length > 0 ? (
            paginatedAddresses.map((address, index) => {
              const gpsCoordinates = address.gps.split(","); // Supondo que o formato é "latitude,longitude"
              const latitude = parseFloat(gpsCoordinates[0]);
              const longitude = parseFloat(gpsCoordinates[1]);

              const distance =
                userLocation && latitude && longitude
                  ? calculateDistance(
                      userLocation.latitude,
                      userLocation.longitude,
                      latitude,
                      longitude
                    ).toFixed(0) // Distância em metros, arredondada
                  : "N/A";

              return (
                <li
                  key={index}
                  className={`border-b p-5 border-gray-200 flex justify-center flex-col ${
                    !address.confirmed ? "bg-red-100" : "bg-primary"
                  }`}
                >
                  <Link
                    to={`/address?tab=/address/${address.id}`}
                    className="grid grid-cols-7 w-full "
                  >
                    <p className="text-3xl col-span-1 w-10">
                      {(address.type === "house" && <MdHouse />) ||
                        (address.type === "department" && (
                          <MdOutlineApartment />
                        )) ||
                        (address.type === "store" && <MdOutlineStorefront />) ||
                        (address.type === "restaurant" && <MdRestaurant />) ||
                        (address.type === "hotel" && <MdHotel />)}
                    </p>
                    <div className="col-span-5 w-full  flex flex-col gap-5">
                      <div>
                        <p className="text-gray-800 font-semibold text-lg ">
                          {address.street}, {address.number}.
                        </p>
                        <p className="text-gray-500 text-sm">
                          {address.city}, {address.neighborhood},
                        </p>
                      </div>
                      <p
                        className={`${
                          address.confirmed
                            ? ""
                            : "font-semibold text-orange-500"
                        }`}
                      >
                        {address.confirmed
                          ? "Confirmado"
                          : "necesita confirmar"}
                      </p>
                    </div>

                    <p className="col-span-1 justify-self-end text-sm w-full">
                      {distance >= 1000
                        ? `${(distance / 1000).toFixed(2)}km`
                        : `${distance}m`}
                    </p>
                  </Link>
                </li>
              );
            })
          ) : (
            <p>No se encontraron direcciones</p>
          )}
        </ul>
      </div>

      <div className="flex items-center justify-center mt-6 space-x-4 text-sky-800 mb-20">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
      <SearchModal
        isOpen={isSearchOpen}
        onClose={closeSearchModal}
        addresses={addresses}
      />
    </div>
  );
}

export default SearchAddress;

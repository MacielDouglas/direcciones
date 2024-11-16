import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  MdHouse,
  MdRestaurant,
  MdHotel,
  MdOutlineStorefront,
  MdOutlineApartment,
} from "react-icons/md";
import PropTypes from "prop-types";

function SearchAddress({ addresses }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [userLocation, setUserLocation] = useState(null); // Localização do usuário

  const navigate = useNavigate();

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

  // Função para calcular a distância usando a fórmula de Haversine
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371000; // Raio da Terra em metros
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distância em metros
  };

  // Filtra os endereços com base no termo de busca
  const filteredAddresses = addresses.filter((address) =>
    address.street.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Configuração da paginação
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredAddresses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAddresses = filteredAddresses.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleAddNewAddress = () => {
    navigate("/new-address");
  };

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
    <div className="">
      <div className="flex items-center justify-center my-6">
        <input
          type="text"
          placeholder="Buscar dirección"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full max-w-xs p-2 border border-stone-400 rounded-lg text-gray-800 shadow focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>
      <div className="flex items-center justify-center mb-6">
        <button
          onClick={handleAddNewAddress}
          className="w-full max-w-xs bg-secondary text-white font-semibold py-2 rounded-lg shadow-md hover:bg-sky-700 transition-colors"
        >
          Nueva Dirección
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 space-y-6">
        <h2 className="text-center">
          Encontrado, {addresses.length && filteredAddresses.length}{" "}
          {filteredAddresses.length <= 1 ? "dirección" : "direcciones"}
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
                    !address.confirmed ? "bg-primary" : ""
                  }`}
                >
                  <div className="grid grid-cols-7 w-full ">
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
                          {address.street}, {address.number},
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
                  </div>
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
    </div>
  );
}

export default SearchAddress;

SearchAddress.propTypes = {
  addresses: PropTypes.array.isRequired,
};

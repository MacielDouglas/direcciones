import {
  Bed,
  Home,
  Hotel,
  MapPinned,
  Search,
  Store,
  Utensils,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { selectAllAddresses } from "../../store/selectors/addressSelectors";
import { calculateDistance } from "../../constants/address";
import { Link } from "react-router-dom";

const iconMap = {
  house: Home,
  department: Hotel,
  store: Store,
  restaurant: Utensils,
  hotel: Bed,
};

const ITEMS_PER_PAGE = 10;

const SearchAddress = () => {
  const addresses = useSelector(selectAllAddresses);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => {
        setUserLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
      }
    );
  }, []);

  const filteredAddresses = addresses.filter((a) => {
    const term = searchTerm.toLowerCase();
    return (
      a.street?.toLowerCase().includes(term) ||
      a.neighborhood?.toLowerCase().includes(term) ||
      a.complement?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredAddresses.length / ITEMS_PER_PAGE);
  const paginated = filteredAddresses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full min-h-screen bg-second-lgt dark:bg-[var(--color-tertiary-drk)] text-[var(--color-primary-drk)] dark:text-[var(--color-primary-lgt)] p-4 max-w-2xl mx-auto rounded-2xl">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4 mb-6 p-2">
        <Search className="text-[var(--color-destaque-primary)]" size={24} />
        <h1 className="text-2xl font-semibold">Pesquisar direcciones</h1>
      </div>

      {/* Input de busca */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6 ">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Buscar calle, barrio, complemento..."
          className="w-full  flex-1 px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[var(--color-destaque-primary)] text-base bg-primary-lgt dark:bg-primary-drk"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm("");
              setCurrentPage(1);
            }}
            className="text-sm px-4 py-2 rounded-md bg-destaque-second dark:bg-destaque-second hover:bg-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 transition"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Contador */}
      <p className="text-sm mb-4">
        {filteredAddresses.length === 0
          ? "Nenhum endereço encontrado."
          : `Encontrado${filteredAddresses.length > 1 ? "s" : ""}: ${
              filteredAddresses.length
            } endereço${filteredAddresses.length > 1 ? "s" : ""}.`}
      </p>

      {/* Lista de endereços */}
      <ul className="space-y-4">
        {paginated.map((address, index) => {
          const [latStr, lngStr] = address.gps?.split(",") ?? [];
          const lat = parseFloat(latStr);
          const lng = parseFloat(lngStr);
          const Icon =
            iconMap[address.type as keyof typeof iconMap] || MapPinned;

          const distance =
            userLocation && lat && lng
              ? calculateDistance(
                  userLocation.latitude,
                  userLocation.longitude,
                  lat,
                  lng
                ).toFixed(0)
              : null;

          const statusColor = !address.active
            ? "text-red-500"
            : address.confirmed
            ? "text-blue-600"
            : "text-orange-600";

          const statusText = !address.active
            ? "Endereço inativo"
            : address.confirmed
            ? "Endereço confirmado"
            : "Necessita confirmação";

          return (
            <li key={index}>
              <Link
                className={`grid grid-cols-5  gap-4 p-4 bg-white dark:bg-primary-drk rounded-xl shadow-sm w-full ${
                  !address.active && "!bg-orange-200 dark:!bg-orange-950"
                }`}
                to={`/addresses?tab=/address/${address.id}`}
              >
                <div className="col-span-1 h-full flex items-center justify-center">
                  <Icon
                    className="text-[var(--color-destaque-primary)] "
                    size={32}
                  />
                </div>

                <div className="w-full col-span-3">
                  {address.customName && (
                    <h2 className="text-sm text-neutral-500">
                      {address.customName}
                    </h2>
                  )}
                  <p className="font-semibold text-base">
                    {address.street}, {address.number}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {address.neighborhood} - {address.city}
                  </p>
                  {address.complement && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-full ">
                      {address.complement}
                    </p>
                  )}
                  <p className={`mt-2 text-sm font-medium ${statusColor}`}>
                    {statusText}
                  </p>
                </div>
                <div className="flex flex-col items-center text-sm mt-1 text-muted-foreground col-span-1 h-full justify-center">
                  <MapPinned size={20} />
                  <span>
                    {distance
                      ? Number(distance) >= 1000
                        ? `${(Number(distance) / 1000).toFixed(1)}km`
                        : `${distance}m`
                      : "N/A"}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 text-sm text-[var(--color-primary-drk)] dark:text-[var(--color-primary-lgt)]">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="mx-4">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-40"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchAddress;

import { useState } from "react";
import { Link } from "react-router-dom";
import { Bed, Home, Hotel, Store, Utensils, X } from "lucide-react";
import { useSelector } from "react-redux";
import { selectAllAddresses } from "../../../store/selectors/addressSelectors";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const iconMap = {
  house: Home,
  department: Hotel,
  store: Store,
  restaurant: Utensils,
  hotel: Bed,
};

const ITEMS_PER_PAGE = 10;

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const addresses = useSelector(selectAllAddresses);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = addresses.filter((a) =>
    a.street.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-2xl h-[90vh] bg-[var(--color-second-lgt)] dark:bg-[var(--color-tertiary-drk)] text-[var(--color-primary-drk)] dark:text-[var(--color-primary-lgt)] rounded-2xl shadow-lg overflow-y-auto p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg sm:text-xl font-semibold tracking-wide uppercase">
            Buscar Dirección
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="text-2xl text-muted-foreground hover:text-red-500 transition"
          >
            <X />
          </button>
        </div>

        {/* Search input */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar calle..."
            className="flex-1 w-full max-w-md px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
          />
          <button
            onClick={handleClearSearch}
            className="text-sm px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-300"
          >
            Limpiar
          </button>
        </div>

        {/* Resultado da busca */}
        {searchTerm ? (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              {filtered.length} dirección{filtered.length !== 1 && "es"}{" "}
              encontrado
              {filtered.length !== 1 ? "as" : "a"}.
            </p>

            <div className="space-y-4">
              {paginated.map((address) => {
                const Icon =
                  iconMap[address.type as keyof typeof iconMap] ?? Home;

                const statusText = !address.active
                  ? "Dirección inactiva"
                  : address.confirmed
                  ? "Dirección confirmada"
                  : "NECESITA CONFIRMACIÓN";

                const statusColor = !address.active
                  ? "text-red-500"
                  : address.confirmed
                  ? "text-blue-600"
                  : "text-orange-600";

                return (
                  <Link
                    key={address.id}
                    to={`/address?tab=/address/${address.id}`}
                    className="block bg-white dark:bg-gray-800 rounded-xl p-4 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition w-full"
                  >
                    <div className="flex items-start gap-4 w-full">
                      <div className="text-2xl text-muted-foreground w-full">
                        <Icon />
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-semibold">
                          {address.street}, {address.number}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {address.city}, {address.neighborhood}
                        </p>
                        {address.complement && (
                          <p className="text-sm text-gray-500 dark:text-gray-400  whitespace-nowrap overflow-hidden truncate">
                            {address.complement}
                          </p>
                        )}

                        <p
                          className={`text-sm font-medium mt-1 ${statusColor}`}
                        >
                          {statusText}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {filtered.length > ITEMS_PER_PAGE && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-8 h-8 rounded-full text-sm font-semibold transition ${
                      currentPage === i + 1
                        ? "bg-sky-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-muted-foreground text-base mt-8">
            Para empezar, escriba el nombre de una calle.
          </div>
        )}
      </div>
    </div>
  );
}

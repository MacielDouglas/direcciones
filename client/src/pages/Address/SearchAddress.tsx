import { Search } from "lucide-react";
import { useSelector } from "react-redux";
import { selectAllAddresses } from "../../store/selectors/addressSelectors";

const SearchAddress = () => {
  const addresses = useSelector(selectAllAddresses);

  return (
    <div className="w-full h-full bg-[var(--color-second-lgt)] dark:bg-[var(--color-tertiary-drk)] text-[var(--color-primary-drk)] dark:text-[var(--color-primary-lgt)] p-6 rounded-2xl max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Search className="text-[var(--color-destaque-primary)]" size={24} />
        <h1 className="text-2xl font-semibold">Pesquisar direcciones</h1>
      </div>

      <div className="bg-[var(--color-primary-lgt)] dark:bg-[var(--color-primary-drk)] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">
            Encontrado, {addresses.length} direcciones.
          </h2>

          <ul></ul>
        </div>
      </div>
    </div>
  );
};

export default SearchAddress;

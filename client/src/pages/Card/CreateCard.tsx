import { useSelector } from "react-redux";
import { selectAllAddresses } from "../../store/selectors/addressSelectors";
import { selectAllCards } from "../../store/selectors/cardsSelectors";
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import MapSection from "../Address/components/MapSection";
import PhotoAddress from "../Address/components/PhotoAddress";
import { useFetchCards, useNewCard } from "../../graphql/hooks/useCards";
import { useToastMessage } from "../../hooks/useToastMessage";
import type { AddressData } from "../../types/address.types";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  return (
    "#" +
    Array.from(
      { length: 6 },
      () => letters[Math.floor(Math.random() * 16)]
    ).join("")
  );
};

const CreateCard = () => {
  const addresses = useSelector(selectAllAddresses) as AddressData[];
  const cards = useSelector(selectAllCards);

  const { newCard } = useNewCard();
  const { fetchCards } = useFetchCards();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { showToast } = useToastMessage();

  const filteredAddresses = useMemo(() => {
    return addresses.filter(
      (address) =>
        !cards.some((card) =>
          card.street.some((street: { id: string }) => street.id === address.id)
        )
    );
  }, [addresses, cards]);

  const addressColors = useMemo(() => {
    const colorMap: { id: string; color: string }[] = [];
    filteredAddresses.forEach((address) => {
      colorMap.push({ id: address.id, color: getRandomColor() });
    });
    return colorMap;
  }, [filteredAddresses]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCreateCard = async () => {
    if (selectedIds.length === 0) return;

    setSelectedIds([]);
    try {
      await newCard({
        variables: {
          newCard: {
            street: selectedIds,
          },
        },
      });

      await fetchCards();
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : String(error);
      showToast({
        message: `Error al crear una nueva tajeta: ${errorMessage}`,
        type: "error",
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-second-lgt dark:bg-[var(--color-tertiary-drk)] text-[var(--color-primary-drk)] dark:text-[var(--color-primary-lgt)] max-w-2xl mx-auto rounded-2xl p-2 pb-10">
      <div className="flex flex-col gap-4 p-6">
        <h1 className="text-2xl font-semibold">Crear Tarjeta</h1>
        <h2 className="text-xl font-semibold">
          {filteredAddresses?.length} direcciones disponibles
        </h2>
        <h3 className="text-lg font-semibold">
          {cards?.length} tarjetas creadas.
        </h3>
      </div>

      <MapSection
        showUserCards={false}
        multipleAddressIds={addressColors.map((item) => ({
          id: item.id,
          color: selectedIds.includes(item.id) ? "#000" : item.color,
        }))}
        selectedIds={selectedIds}
        onSelectAddress={(id) => toggleSelect(id)}
      />

      <button
        className=" w-2/3 mt-4 rounded-2xl h-12 text-base flex items-center justify-center disabled:opacity-50 bg-destaque-primary cursor-pointer text-black mx-auto"
        onClick={handleCreateCard}
        disabled={selectedIds.length === 0}
      >
        {selectedIds.length === 0 ? (
          "No se puede crear tarjeta"
        ) : (
          <>
            <Plus className="mr-2" size={18} />
            Crear Tarjeta
          </>
        )}
      </button>

      <div className="space-y-5 h-full overflow-y-auto mt-10 bg-primary-lgt dark:bg-primary-drk overflow-hidden py-6 px-2 rounded-2xl">
        {filteredAddresses.map((address) => {
          const colorObj = addressColors.find((c) => c.id === address.id);
          const isSelected = selectedIds.includes(address.id);

          return (
            <div
              key={address.id}
              className={`relative border border-neutral-300 dark:border-neutral-800 rounded-2xl p-4 cursor-pointer ${
                isSelected
                  ? "bg-destaque-second text-primary-lgt dark:bg-tertiary-lgt dark:text-black"
                  : "text-gray-700 dark:text-gray-300 hover:border-gray-400"
              }`}
              onClick={() => toggleSelect(address.id)}
            >
              <div
                className="absolute top-2 right-2 w-[20px] h-[20px] rounded-full"
                style={{
                  backgroundColor: isSelected ? "#000" : colorObj?.color,
                  border: isSelected ? "1px solid white" : "none",
                }}
              />

              <div className="flex justify-between items-center w-full h-full">
                <div className="w-1/4 h-full flex items-center">
                  <PhotoAddress
                    hei="h-20"
                    wid="w-20"
                    photo={address.photo}
                    street={address.street}
                  />
                </div>
                <div className="w-3/4">
                  {address.customName && (
                    <p className="text-neutral-400 dark:text-neutral-400 font-semibold">
                      {address.customName}
                    </p>
                  )}
                  <div className="text-base font-medium">
                    {address.street}, {address.number}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {address.neighborhood} - {address.city}
                    {address.complement && ` (${address.complement})`}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredAddresses.length === 0 && (
          <div className="text-center text-muted-foreground mt-4">
            Todos os endereços já estão em cartões.
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCard;

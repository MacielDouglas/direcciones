import { Dock, Save } from "lucide-react";
import { useSelector } from "react-redux";
import { selectAllAddresses } from "../../store/selectors/addressSelectors";
import { selectAllCards } from "../../store/selectors/cardsSelectors";
import { useMemo, useState } from "react";
import MapSection from "../Address/components/MapSection";
import PhotoAddress from "../Address/components/PhotoAddress";
import { useToastMessage } from "../../hooks/useToastMessage";
import { useFetchCards, useUpdateCard } from "../../graphql/hooks/useCards";
import type { AddressData } from "../../types/address.types";

type UpadateCardProps = {
  id: string;
};

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

const UpadateCard = ({ id }: UpadateCardProps) => {
  const addresses = useSelector(selectAllAddresses) as AddressData[];
  const cards = useSelector(selectAllCards);
  const { showToast } = useToastMessage();
  const { updateCardInput } = useUpdateCard();
  const { fetchCards } = useFetchCards();

  const card = useMemo(
    () => cards.find((cd) => cd.id === id) || null,
    [cards, id]
  );

  const [selectedIds, setSelectedIds] = useState<string[]>(
    card?.street.map((st: { id: string }) => st.id) || []
  );

  const filteredAddresses = useMemo(() => {
    return addresses.filter((address) => {
      const alreadyInCard = card?.street.some(
        (st: { id: string }) => st.id === address.id
      );
      const alreadyInOtherCard = cards.some(
        (c) =>
          c.id !== card?.id &&
          c.street.some((st: { id: string }) => st.id === address.id)
      );
      return !alreadyInOtherCard || alreadyInCard;
    });
  }, [addresses, cards, card]);

  const addressColors = useMemo(() => {
    return filteredAddresses.map((address) => ({
      id: address.id,
      color: getRandomColor(),
    }));
  }, [filteredAddresses]);

  const toggleSelect = (addressId: string) => {
    setSelectedIds((prev) =>
      prev.includes(addressId)
        ? prev.filter((id) => id !== addressId)
        : [...prev, addressId]
    );
  };

  const handleUpdateCard = async () => {
    try {
      await updateCardInput({
        variables: {
          updateCardInput: {
            id: card?.id,
            street: selectedIds,
          },
        },
      });
      await fetchCards();
      showToast({
        message: "Tarjeta actualizada correctamente.",
        type: "success",
      });
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : String(error);
      showToast({
        message: `Error al actualizar la tarjeta: ${errorMessage}`,
        type: "error",
      });
    }
  };

  if (!card) {
    return (
      <div className="space-y-6 bg-primary-lgt dark:bg-second-drk p-6 rounded-lg max-w-2xl mx-auto text-lg">
        <h2 className="text-2xl font-semibold">No se encontró la tarjeta.</h2>
        <p>Seleccione una tarjeta válida para editarla.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-second-lgt dark:bg-[var(--color-tertiary-drk)] text-[var(--color-primary-drk)] dark:text-[var(--color-primary-lgt)] max-w-2xl mx-auto rounded-2xl p-2 pb-10">
      <div className="flex flex-col gap-4 p-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Dock className="text-[var(--color-destaque-primary)]" size={24} />
          Actualizar Tarjetas
        </h1>
        <h2 className="text-xl font-semibold">
          {filteredAddresses?.length} direcciones disponibles
        </h2>
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
        onClick={handleUpdateCard}
        disabled={selectedIds.length === 0}
      >
        <Save className="mr-2" size={18} />
        Guardar Cambios
      </button>

      <div className="space-y-5 h-full overflow-y-auto mt-10 bg-primary-lgt dark:bg-primary-drk overflow-hidden py-6 px-2 rounded-2xl">
        <div className="p-3 space-y-3">
          <h2 className="text-xl">Tarjeta Nº {card.number}</h2>
          <p>
            Esta tarjeta tiene: {card.street.length} direc
            {card.street.length > 1 ? "iones" : "ión"}
          </p>
          <h2 className="text-lg">
            Direcciones disponibles: {filteredAddresses?.length}
          </h2>
        </div>
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
            No hay direcciones disponibles para este tarjeta.
          </div>
        )}
      </div>
    </div>
  );
};

export default UpadateCard;

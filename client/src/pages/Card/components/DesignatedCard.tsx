import { Dock, MapPin, RotateCcw } from "lucide-react";
import { formatDate } from "../../../constants/address";
import { useGetUsers } from "../../../graphql/hooks/useUser";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAllUsersOthers } from "../../../store/selectors/ohterUsersSelectors";
import { Button } from "../../../components/ui/FormElements";
import { useFetchCards, useReturnCard } from "../../../graphql/hooks/useCards";
import type { Card } from "../types/card.types";
import { addressIcons, getNeighborhoodSummary } from "../constants/constants";

interface DesignatedCardProps {
  designated?: boolean;
  selectedNotAssigned?: string[];
  selectedAssigned?: string[];
  toggleSelect: (id: string, assigned: boolean) => void;
  cards: Card[];
}

const DesignatedCard = ({
  cards,
  designated,
  selectedNotAssigned,
  toggleSelect,
}: DesignatedCardProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedCardUserId, setSelectedCarUserId] = useState<string | null>(
    null
  );
  const { returnCardMutation } = useReturnCard("null");
  const { fetchCards } = useFetchCards();

  const { fetchUsers } = useGetUsers();
  const users = useSelector(selectAllUsersOthers);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSelect = (cardId: string) => {
    if (designated) {
      setSelectedCardId(cardId === selectedCardId ? null : cardId);
    } else {
      toggleSelect(cardId, false);
    }
  };

  const handleReturnCard = async () => {
    if (selectedCardId) toggleSelect(selectedCardId, true);

    await returnCardMutation({
      variables: {
        returnCardInput: {
          cardId: selectedCardId,
          userId: selectedCardUserId,
        },
      },
    });

    setShowConfirm(false);
    setSelectedCardId(null);
    fetchCards();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        {designated ? "Tarjetas asignadas" : "Tarjetas no asignadas"}
      </h2>
      {cards.map((card) => {
        const isSelected = designated
          ? selectedCardId === card.id
          : (selectedNotAssigned ?? []).includes(card.id);

        return (
          <div
            key={card.id}
            className={`border rounded-2xl p-4 cursor-pointer transition-all duration-200 bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-950 shadow-sm ${
              isSelected
                ? "bg-neutral-700 text-white dark:bg-tertiary-lgt dark:text-black"
                : "border-gray-400 text-gray-700 dark:text-neutral-300 hover:border-gray-400"
            }`}
          >
            <div onClick={() => handleSelect(card.id)}>
              <div className="flex flex-col w-full space-y-2">
                <div className="w-full flex gap-3 justify-between items-center">
                  <p className="font-semibold inline-flex gap-2">
                    <Dock /> Tarjeta n° {card.number}
                  </p>
                  <p className="text-sm">
                    {designated
                      ? `Enviado en: ${formatDate(card.startDate ?? "")}`
                      : `Devuelto en: ${formatDate(card.endDate ?? "")}`}
                  </p>
                </div>

                <p className="font-medium inline-flex gap-2 text-neutral-500 self-end text-sm">
                  <MapPin /> {card.street.length} direcciones
                </p>

                {designated && (
                  <p className="font-semibold text-base text-neutral-500">
                    {card.usersAssigned?.length
                      ? users
                          .filter(
                            (usr) => usr.id === card.usersAssigned?.[0]?.userId
                          )
                          .map((usr) => <span key={usr.id}>{usr.name}</span>)
                      : null}
                  </p>
                )}

                <div className="mt-2 space-y-1">
                  {card.street.map((str) => (
                    <p
                      key={str.id}
                      className="text-sm inline-flex items-center gap-2"
                    >
                      <span className="text-neutral-500 ">
                        {str.type !== undefined ? addressIcons[str.type] : null}
                      </span>
                      {str.street}, {str.number}
                    </p>
                  ))}
                  <p className="mt-2 text-sm text-neutral-500">
                    Bairros: {getNeighborhoodSummary(card.street)}
                  </p>
                </div>
              </div>
            </div>
            {designated && isSelected && (
              <Button
                className="mt-4 w-full bg-neutral-800 text-white hover:bg-orange-600"
                onClick={() => {
                  // e.stopPropagation();
                  setShowConfirm(true);
                  setSelectedCarUserId(
                    card?.usersAssigned && card.usersAssigned.length > 0
                      ? card.usersAssigned[0].userId
                      : null
                  );
                }}
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Retornar tarjeta
              </Button>
            )}
          </div>
        );
      })}

      {cards.length === 0 && (
        <p className="text-muted-foreground">Nenhuma tarjeta disponível.</p>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl w-[90%] max-w-sm space-y-4 text-center shadow-xl">
            <h3 className="text-lg font-semibold">
              ¿Estás seguro que deseas devolver la tarjeta?
            </h3>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setShowConfirm(false)}>Cancelar</Button>
              <Button
                className="bg-neutral-950 text-white hover:bg-orange-600"
                onClick={handleReturnCard}
              >
                Sí, devolver
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignatedCard;

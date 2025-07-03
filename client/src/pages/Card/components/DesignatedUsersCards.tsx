import { Dock, MapPin } from "lucide-react";
import { formatDate } from "../../../constants/address";
import { useSelector } from "react-redux";
import { selectAllUsersOthers } from "../../../store/selectors/ohterUsersSelectors";
import { selectAllCards } from "../../../store/selectors/cardsSelectors";
import { useNavigate } from "react-router-dom";
import { useDesignateCard } from "../../../graphql/hooks/useCards";
// import type { Card } from "../types/card.types";
import { addressIcons, getNeighborhoodSummary } from "../constants/constants";
import type { Card } from "../../../types/cards.types";
// import { Dispatch, SetStateAction } from "react";

import type { Dispatch, SetStateAction } from "react";

interface DesignatedUsersCardsProps {
  filteredCards: Card[];
  selectedCardUserId?: string;
  setSelectedCarUserId: Dispatch<SetStateAction<string | undefined>>;
  setSelectedNotAssigned?: Dispatch<SetStateAction<string[]>>;
}

const DesignatedUsersCards = ({
  filteredCards,
  selectedCardUserId,
  setSelectedCarUserId,
  setSelectedNotAssigned,
}: DesignatedUsersCardsProps) => {
  const users = useSelector(selectAllUsersOthers);
  const cards = useSelector(selectAllCards) as Card[];
  const navigate = useNavigate();
  const { designateCardInput } = useDesignateCard();

  const handleSelect = (userId: string) => {
    setSelectedCarUserId(userId === selectedCardUserId ? undefined : userId);
    navigate("/cards?tab=send-card");
  };

  const handleSend = async () => {
    await designateCardInput({
      variables: {
        assignCardInput: {
          cardIds: filteredCards.map((card) => card.id),
          userId: selectedCardUserId,
        },
      },
    });

    setSelectedCarUserId(undefined);
    if (setSelectedNotAssigned) {
      setSelectedNotAssigned([]);
    }
  };

  return (
    <div className="w-full space-y-5">
      <h2>Tarjetas selecionadas: {filteredCards.length}</h2>
      {filteredCards.map((card) => {
        return (
          <div
            key={card.id}
            className={`border rounded-2xl p-4  transition-all duration-200  dark:border-neutral-800  shadow-sm bg-neutral-700 text-white dark:bg-tertiary-lgt dark:text-black `}
          >
            <div className="flex flex-col w-full space-y-">
              <div className="w-full flex gap-3 justify-between items-center">
                <p className="font-semibold inline-flex gap-2">
                  <Dock /> Tarjeta n° {card.number}
                </p>
                <p className="text-sm">
                  Devuelto en: {formatDate(card.startDate ?? "")}
                </p>
              </div>
              <p className="font-medium inline-flex gap-2 text-neutral-500 self-end text-sm">
                <MapPin /> {card.street.length} direcciones
              </p>

              <div className="mt-2 space-y-1">
                {card.street.map((str) => (
                  <p key={str.id} className="text-sm">
                    {str.street}, {str.number}
                  </p>
                ))}
                <p className="mt-2 text-sm text-neutral-500">
                  Bairros: {getNeighborhoodSummary(card.street)}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      <div className="w-full space-y-5">
        <h3>Selecione um usuário</h3>
        {users &&
          users.map((usr) => {
            const skd = cards.filter(
              (card) => card.usersAssigned?.[0]?.userId === usr.id
            );

            return (
              <div
                key={usr.id}
                onClick={() => handleSelect(usr.id)}
                className={`border rounded-2xl p-4 cursor-pointer transition-all duration-200 bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-950 shadow-sm space-y-4 ${
                  selectedCardUserId === usr.id
                    ? "bg-neutral-700 text-white dark:bg-tertiary-lgt dark:text-black"
                    : "border-gray-400 text-gray-700 dark:text-neutral-300 hover:border-gray-400"
                }`}
              >
                <div className="flex justify-between">
                  <p className="font-semibold">{usr.name}</p>{" "}
                  <p>Tarjetas: {skd.length}</p>
                </div>
                <div className="space-y-6">
                  {skd.map((str) => (
                    <div
                      key={str.id}
                      className="p-2 border rounded-lg border-neutral-600"
                    >
                      <p className="inline-flex gap-2 items-center justify-center w-full mb-3">
                        <Dock size={18} /> Tarjeta numero: {str.number}
                      </p>
                      {str.street.map((street) => (
                        <div key={street.id}>
                          <p className="inline-flex items-center gap-2">
                            {" "}
                            <span className="text-neutral-500">
                              {street.type !== undefined
                                ? addressIcons[street.type]
                                : null}
                            </span>
                            {street.street}, {street.number}
                          </p>
                        </div>
                      ))}
                      <p className="mt-2 text-sm text-neutral-500">
                        Bairros: {getNeighborhoodSummary(str.street)}
                      </p>
                    </div>
                  ))}
                  {filteredCards.length > 0 &&
                    selectedCardUserId === usr.id && (
                      <div className="flex justify-center w-full mx-auto">
                        <button
                          className=" bg-neutral-800 text-neutral-300 hover:bg-neutral-600 p-3 rounded-3xl w-2/3 cursor-pointer"
                          onClick={handleSend}
                        >
                          Enviar Tarjeta
                        </button>
                      </div>
                    )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default DesignatedUsersCards;

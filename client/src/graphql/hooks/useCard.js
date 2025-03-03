import { useLazyQuery, useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCards, setMyCards } from "../../store/cardsSlice";
import { toast } from "react-toastify";
import { CREATE_CARD, RETURN_CARD } from "../mutation/cards.mutation";
import { useCallback, useMemo } from "react";
import { LIST_CARDS } from "../queries/cards.query";

export const useCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  // Callback para tratar erro globalmente
  const handleError = useCallback((error) => {
    toast.error(`Erro feioso: ${error.message}`);
  }, []);

  const [fetchCards, { loading: cardLoading }] = useLazyQuery(LIST_CARDS, {
    fetchPolicy: "network-only",
    onCompleted: async (data) => {
      const { cards } = data?.getCard ?? {};
      const myCards = await cards.filter(
        (card) => card.usersAssigned[0]?.userId === user.userData.id
      );

      dispatch(setMyCards({ myCards }));
      dispatch(setCards({ cards }));
    },
    onError: handleError,
  });

  // Criar um novo cartão
  const [newCard, { loading: newCardLoading, error: errorCards }] = useMutation(
    CREATE_CARD,
    {
      onCompleted: (data) => {
        toast.success(data?.cardMutation?.message);
        navigate("/cards?tab=asignar");
      },
      onError: handleError,
    }
  );

  // Retornar cartão
  const [returnedCardInput] = useMutation(RETURN_CARD, {
    onCompleted: (data) => {
      console.log("Devolvido: ", data);
      toast.success(data?.returnCard?.message);
    },
    onError: handleError,
  });

  return useMemo(
    () => ({
      fetchCards,
      cardLoading,
      errorCards,
      newCard,
      newCardLoading,
      returnedCardInput,
    }),
    [
      fetchCards,
      cardLoading,
      errorCards,
      newCard,
      newCardLoading,
      returnedCardInput,
    ]
  );
};

import { useLazyQuery, useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCards, setMyCards } from "../../store/cardsSlice";
import { toast } from "react-toastify";
import { CREATE_CARD, RETURN_CARD } from "../mutation/cards.mutation";
import { setUser } from "../../store/userSlice";
import { useCallback, useMemo } from "react";
import { LIST_CARDS, MY_CARDS } from "../queries/cards.query";
// import { MY_CARDS_SUBSCRIPTION } from "../queries/user.query";

export const useCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  // Callback para tratar erro globalmente
  const handleError = useCallback((error) => {
    toast.error(`Erro: ${error.message}`);
  }, []);

  // Buscar cartões
  const [fetchMyCards, { loading: myCardLoading }] = useLazyQuery(MY_CARDS, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      dispatch(setMyCards({ myCards: data?.myCards.cards }));
    },
    onError: handleError,
  });
  const [fetchCards, { loading: cardLoading }] = useLazyQuery(LIST_CARDS, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      dispatch(setCards({ cards: data.listCards.cards }));
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
      toast.success(data?.cardMutation?.message);
      const myCards = user?.userData?.myCards || [];
      const returnedCards = data?.cardMutation?.returnedCards || [];

      if (returnedCards.length > 0) {
        const updatedCards = myCards.filter(
          (card) => !returnedCards.some((returned) => returned.id === card.id)
        );

        dispatch(
          setUser({
            user: {
              ...user,
              userData: {
                ...user.userData,
                myCards: updatedCards,
              },
            },
          })
        );

        dispatch(
          setCards({
            cards: updatedCards,
            sessionExpiry: updatedCards.length > 0 ? undefined : null,
          })
        );
      }
    },
    onError: handleError,
  });

  return useMemo(
    () => ({
      fetchMyCards,
      myCardLoading,
      fetchCards,
      cardLoading,
      errorCards,
      // loading,
      // error,
      newCard,
      newCardLoading,
      returnedCardInput,
    }),
    [
      fetchMyCards,
      fetchCards,
      cardLoading,
      errorCards,
      // loading,
      // error,
      newCard,
      newCardLoading,
      returnedCardInput,
      // myCards,
      myCardLoading,
    ]
  );
};

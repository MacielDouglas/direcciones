import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_CARDS, MY_CARDS } from "../queries/cards.query";
import { useDispatch } from "react-redux";
import { setMyCards } from "../../store/myCardsSlice";
import { NEW_CARD, RETURN_CARD } from "../mutations/cards.mutation";
import { setCards } from "../../store/cardsSlice";
import { useToastMessage } from "../../hooks/useToastMessage";

export function useFetchCards() {
  const dispatch = useDispatch();
  const { showToast } = useToastMessage();

  const [fetchCards] = useLazyQuery(GET_CARDS, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      console.log("Chamado");
      console.log(data);
      dispatch(setCards({ cards: data.card }));
    },
    onError: (err) => {
      showToast({
        message: `Error al cargar tarjetas:: ${err.message}`,
        type: "error",
      });
    },
  });
  return { fetchCards };
}

export function useFetchMyCards() {
  const dispatch = useDispatch();

  const [fetchMyCards, { loading }] = useLazyQuery(MY_CARDS, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      dispatch(setMyCards({ myCard: data?.myCards }));
    },
    onError: (err) => console.error("Erro ao carregar cartões:", err),
  });

  return { fetchMyCards, loading };
}

export function useReturnCard(userId: string) {
  const { fetchMyCards } = useFetchMyCards();
  const { showToast } = useToastMessage();

  const [returnCardMutation] = useMutation(RETURN_CARD, {
    onCompleted: (data) => {
      showToast({ message: data.returnCard.message, type: "success" });

      fetchMyCards({ variables: { myCardsId: userId } });
    },
    onError: (error) => {
      showToast({
        message: `Error al devolver las tarjetas:  ${error}`,
        type: "error",
      });
    },
  });

  return { returnCardMutation };
}

export function useNewCard() {
  const { showToast } = useToastMessage();

  const [newCard] = useMutation(NEW_CARD, {
    onCompleted: (data) => {
      showToast({ message: data.createCard.message, type: "success" });
    },
    onError: (error) => {
      setTimeout(() => {
        showToast({
          message: `Error al crear una nueva tarjeta:  ${error}`,
          type: "error",
        });
      });
    },
  });
  return { newCard };
}

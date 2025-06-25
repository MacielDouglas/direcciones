import { useLazyQuery, useMutation } from "@apollo/client";
import { MY_CARDS } from "../queries/cards.query";
import { useDispatch } from "react-redux";
import { setMyCards } from "../../store/myCardsSlice";
import { RETURN_CARD } from "../mutations/cards.mutation";
import toast from "react-hot-toast";

export function useFetchMyCards() {
  const dispatch = useDispatch();

  const [fetchMyCards, { loading }] = useLazyQuery(MY_CARDS, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      console.log(data);
      dispatch(setMyCards({ myCard: data?.myCards }));
    },
    onError: (err) => console.error("Erro ao carregar cartões:", err),
  });

  return { fetchMyCards, loading };
}

export function useReturnCard(userId: string) {
  const { fetchMyCards } = useFetchMyCards();

  const [returnCardMutation] = useMutation(RETURN_CARD, {
    onCompleted: (data) => {
      toast.success(data.returnCard.message);
      fetchMyCards({ variables: { myCardsId: userId } });
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  return { returnCardMutation };
}

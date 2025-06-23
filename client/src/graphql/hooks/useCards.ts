import { useLazyQuery } from "@apollo/client";
import { MY_CARDS } from "../queries/cards.query";
import { useDispatch } from "react-redux";
import { setMyCards } from "../../store/myCardsSlice";

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

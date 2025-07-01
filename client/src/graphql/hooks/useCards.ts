// import { useLazyQuery, useMutation } from "@apollo/client";
// import { GET_CARDS, MY_CARDS } from "../queries/cards.query";
// import {
//   NEW_CARD,
//   RETURN_CARD,
//   SENDING_CARD,
//   UPDATE_CARD,
// } from "../mutations/cards.mutation";
// import { useDispatch } from "react-redux";
// import { setCards } from "../../store/cardsSlice";
// import { setMyCards } from "../../store/myCardsSlice";
// import { useToastMessage } from "../../hooks/useToastMessage";
// import { useFetchAddresses } from "./useAddress";
// // import type {
//   // GetCardsResponse,
//   // MyCardsResponse,
//   // ReturnCardResponse,
//   // NewCardResponse,
//   // SendCardResponse,
//   // UpdateCardResponse,
// // } from "../types/cards.types"; // Assuma que você tem tipos adequados aqui.

// export function useFetchCards() {
//   const dispatch = useDispatch();
//   const { showToast } = useToastMessage();

//   const [fetchCards, { loading }] = useLazyQuery<GetCardsResponse>(GET_CARDS, {
//     fetchPolicy: "network-only",
//     onCompleted: (data) => {
//       dispatch(setCards({ cards: data.card }));
//     },
//     onError: (error) => {
//       showToast({
//         message: `Erro ao carregar cartões: ${error.message || "Erro desconhecido"}`,
//         type: "error",
//       });
//     },
//   });

//   return { fetchCards, loading };
// }

// export function useFetchMyCards() {
//   const dispatch = useDispatch();
//   const { showToast } = useToastMessage();

//   const [fetchMyCards, { loading }] = useLazyQuery<MyCardsResponse>(MY_CARDS, {
//     fetchPolicy: "network-only",
//     onCompleted: (data) => {
//       dispatch(setMyCards({ myCard: data?.myCards }));
//     },
//     onError: (error) => {
//       showToast({
//         message: `Erro ao carregar meus cartões: ${error.message || "Erro desconhecido"}`,
//         type: "error",
//       });
//     },
//   });

//   return { fetchMyCards, loading };
// }

// export function useReturnCard() {
//   const { showToast } = useToastMessage();

//   const [returnCard, { loading }] = useMutation<ReturnCardResponse>(RETURN_CARD, {
//     onCompleted: (data) => {
//       showToast({ message: data.returnCard.message, type: "success" });
//     },
//     onError: (error) => {
//       showToast({
//         message: `Erro ao devolver cartão: ${error.message || "Erro desconhecido"}`,
//         type: "error",
//       });
//     },
//   });

//   return { returnCard, loading };
// }

// export function useNewCard() {
//   const { showToast } = useToastMessage();

//   const [createCard, { loading }] = useMutation<NewCardResponse>(NEW_CARD, {
//     onCompleted: (data) => {
//       showToast({ message: data.createCard.message, type: "success" });
//     },
//     onError: (error) => {
//       showToast({
//         message: `Erro ao criar cartão: ${error.message || "Erro desconhecido"}`,
//         type: "error",
//       });
//     },
//   });

//   return { createCard, loading };
// }

// export function useDesignateCard() {
//   const { showToast } = useToastMessage();
//   const { fetchAddresses } = useFetchAddresses();

//   const [designateCard, { loading }] = useMutation<SendCardResponse>(SENDING_CARD, {
//     onCompleted: (data) => {
//       showToast({ message: data.assignCard.message, type: "success" });
//       fetchAddresses();
//     },
//     onError: (error) => {
//       showToast({
//         message: `Erro ao designar cartão: ${error.message || "Erro desconhecido"}`,
//         type: "error",
//       });
//     },
//   });

//   return { designateCard, loading };
// }

// export function useUpdateCard() {
//   const { showToast } = useToastMessage();

//   const [updateCard, { loading }] = useMutation<UpdateCardResponse>(UPDATE_CARD, {
//     onCompleted: (data) => {
//       showToast({ message: data.updateCard.message, type: "success" });
//     },
//     onError: (error) => {
//       showToast({
//         message: `Erro ao atualizar cartão: ${error.message || "Erro desconhecido"}`,
//         type: "error",
//       });
//     },
//   });

//   return { updateCard, loading };
// }

import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_CARDS, MY_CARDS } from "../queries/cards.query";
import { useDispatch } from "react-redux";
import { setMyCards } from "../../store/myCardsSlice";
import {
  NEW_CARD,
  RETURN_CARD,
  SENDING_CARD,
  UPDATE_CARD,
} from "../mutations/cards.mutation";
import { setCards } from "../../store/cardsSlice";
import { useToastMessage } from "../../hooks/useToastMessage";
import { useFetchAddresses } from "./useAddress";

export function useFetchCards() {
  const dispatch = useDispatch();
  const { showToast } = useToastMessage();

  const [fetchCards] = useLazyQuery(GET_CARDS, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
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
export function useReturnCard() {
  const { showToast } = useToastMessage();

  const [returnCardMutation] = useMutation(RETURN_CARD, {
    onCompleted: async (data) => {
      if (data) {
        showToast({ message: data.returnCard.message, type: "success" });
      }
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

export function useDesignateCard() {
  const { showToast } = useToastMessage();
  const { fetchCards } = useFetchCards();
  const { fetchAddresses } = useFetchAddresses();

  const [designateCardInput] = useMutation(SENDING_CARD, {
    onCompleted: async (data) => {
      showToast({ message: data.assignCard.message, type: "success" });
      fetchCards();
      fetchAddresses();
    },
    onError: (error) =>
      showToast({
        message: `Error al enviar tarjeta:  ${error}`,
        type: "error",
      }),
  });

  return { designateCardInput };
}

export function useUpdateCard() {
  const { showToast } = useToastMessage();

  const [updateCardInput] = useMutation(UPDATE_CARD, {
    onCompleted: async (data) => {
      showToast({ message: data.updateCard.message, type: "success" });
    },
    onError: (error) =>
      showToast({
        message: `Erro al modificar tarjeta: ${error.message}`,
        type: "error",
      }),
  });

  return { updateCardInput };
}

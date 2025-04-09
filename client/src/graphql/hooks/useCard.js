import { useLazyQuery, useMutation } from "@apollo/client";
import {
  DELETE_CARD,
  NEW_CARD,
  RETURN_CARD,
  SENDING_CARD,
  UPDATE_CARD,
} from "../mutation/cards.mutation";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import { GET_CARDS } from "../queries/cards.query";
import { setCards } from "../../store/cardsSlice";

export function useFetchCards() {
  const [fetchCards] = useLazyQuery(GET_CARDS, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setCards(data.card);
    },
    onError: (err) => {
      toast.error(`Error al cargar tarjetas: ${err.message}`);
    },
  });
  return { fetchCards };
}

export function useNewCard() {
  const navigate = useNavigate();

  const [newCard] = useMutation(NEW_CARD, {
    onCompleted: (data) => {
      setTimeout(() => {
        toast.success(data.createCard.message);
        navigate("/cards?tab=asignar");
      }, 2000);
    },
    onError: (error) => {
      setTimeout(() => {
        toast.error(`Error al crear una nueva tarjeta: ${error.message}`);
      }, 2000);
    },
  });

  return { newCard };
}

export function useCardReturn() {
  const [returnedCardInput] = useMutation(RETURN_CARD, {
    onCompleted: async (data) => {
      toast.success(data.returnCard.message);
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  return { returnedCardInput };
}

export function useDesignateCard() {
  const [designateCardInput] = useMutation(SENDING_CARD, {
    onCompleted: async (data) => {
      toast.success(data.assignCard.message);
    },
    onError: (error) => toast.error(`Erro: ${error.message}`),
  });

  return { designateCardInput };
}

export function useDeleteCard() {
  const [deleteCardInput, { error: deleteCardError }] = useMutation(
    DELETE_CARD,
    {
      onCompleted: async (data) => {
        toast.success(data.deleteCard.message);
      },
      onError: (error) =>
        toast.error(`Erro al deletar tarjeta: ${error.message}`),
    }
  );

  return { deleteCardInput, deleteCardError };
}

export function useUpdateCard() {
  const [updateCardInput] = useMutation(UPDATE_CARD, {
    onCompleted: async (data) => {
      toast.success(data.updateCard.message);
    },
    onError: (error) =>
      toast.error(`Erro al modificar tarjeta: ${error.message}`),
  });

  return { updateCardInput };
}

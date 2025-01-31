import { useLazyQuery } from "@apollo/client";
import { toast } from "react-toastify";
import { GET_ADDRESS } from "../graphql/queries/address.query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAddresses } from "../store/addressesSlice";
import { useCallback } from "react";

// Função para buscar endereços
export const useFetchAddresses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [fetchAddresses, { refetch }] = useLazyQuery(GET_ADDRESS, {
    variables: { action: "get", input: { street: "" } },
    onCompleted: (data) => {
      handleAddressResponse(data), console.log("Fetched endereços...");
    },
    onError: (error) =>
      toast.error(`Erro ao buscar endereços: ${error.message}`),
  });

  // Função para refazer a busca de endereços
  const refetchAllAddresses = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error("Erro ao refazer a busca de endereços:", error);
    }
  };

  const handleAddressResponse = useCallback(
    (data) => {
      const addresses = data?.address?.address;

      if (addresses && addresses.length > 0) {
        dispatch(setAddresses({ addresses }));
      } else {
        toast.warn("No se encontró ninguna dirección.");
      }
      navigate("/"); // Redireciona após o processamento
    },
    [dispatch, navigate]
  );
  //   const handleAddressResponse = (data) => {
  //     const addresses = data?.address?.address;

  //     if (addresses && addresses.length > 0) {
  //       return addresses;
  //     } else {
  //       toast.warn("No se encontró ninguna dirección.");
  //       return [];
  //     }
  //   };

  return {
    fetchAddresses,
    refetchAllAddresses,
  };
};

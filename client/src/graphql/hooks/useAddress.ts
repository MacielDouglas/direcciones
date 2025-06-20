import { useLazyQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { ADDRESSES } from "../queries/address.query";
import { setAddresses } from "../../store/addressSlice";

export function useFetchAddresses() {
  const dispatch = useDispatch();

  const [fetchAddresses] = useLazyQuery(ADDRESSES, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data?.addresses?.addresses) {
        dispatch(setAddresses({ addresses: data.addresses.addresses }));
      }
    },
    onError: (err) => {
      console.error(`Erro ao carregar endereços: ${err.message}`);
    },
  });

  return { fetchAddresses };
}

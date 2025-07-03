import { useLazyQuery, useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { ADDRESSES } from "../queries/address.query";
import { setAddresses } from "../../store/addressSlice";
import { NEW_ADDRESS } from "../mutations/address.mutations";
import { useNavigate } from "react-router-dom";
import { selectAllAddresses } from "../../store/selectors/addressSelectors";
import { useToastMessage } from "../../hooks/useToastMessage";

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

export function useNewAddress() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addresses = useSelector(selectAllAddresses);
  const { showToast } = useToastMessage();

  const [newAddress] = useMutation(NEW_ADDRESS, {
    onCompleted: async (data) => {
      if (!data.createAddress.success) {
        return console.error(
          `Erro ao cadastrar novo endereço: ${data.createAddress.message}`
        );
      }

      showToast({
        message: "¡Nueva dirección creada exitosamente!",
        type: "success",
      });
      dispatch(
        setAddresses({
          addresses: [...addresses, data.createAddress.address],
        })
      );
      navigate(`/addresses?tab=/address/${data.createAddress.address.id}`);
    },
    onError: (error) =>
      console.error(`Erro ao cadastrar endereço novo ${error.message}`),
  });

  return { newAddress };
}

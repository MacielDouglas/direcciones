import { useLazyQuery, useMutation } from "@apollo/client";
// import { GET_ADDRESS } from "../queries/address.query";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setAddresses } from "../../store/addressesSlice";
import { useNavigate } from "react-router-dom";
import { NEW_ADDRESS } from "../mutation/address.mutation";
import { useCallback, useMemo } from "react";
import { GET_ADDRESS } from "./../queries/address.query";

export const useAddress = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addresses = useSelector((state) => state.addresses);

  const addressesData = addresses?.addressesData || [];

  // Callback para manipulação de erros
  const handleError = useCallback((error) => {
    toast.error(`Erro: ${error.message}`);
  }, []);

  // Buscar endereços
  const [fetchAddresses] = useLazyQuery(GET_ADDRESS, {
    onCompleted: (data) => {
      console.log("Endereços", data);
      const addresses = data?.address?.address || [];

      if (addresses.length > 0) {
        dispatch(setAddresses({ addresses }));
      } else {
        toast.warn("Nenhum endereço encontrado.");
      }
    },
    onError: handleError,
  });

  // Criar novo endereço
  const [newAddress] = useMutation(NEW_ADDRESS, {
    onCompleted: (data) => {
      const newAddr = data?.addressMutation?.address;

      if (newAddr) {
        toast.success("Endereço cadastrado com sucesso!");
        dispatch(setAddresses({ addresses: [...addressesData, newAddr] }));
        navigate(`/address/${newAddr.id}`);
      }
    },
    onError: handleError,
  });

  return useMemo(
    () => ({
      fetchAddresses,
      newAddress,
    }),
    [fetchAddresses, newAddress]
  );
};

// import { useLazyQuery, useMutation } from "@apollo/client";
// import { GET_ADDRESS } from "../queries/address.query";
// import { toast } from "react-toastify";
// import { useDispatch, useSelector } from "react-redux";
// import { setAddresses } from "../../store/addressesSlice";
// import { useNavigate } from "react-router-dom";
// import { NEW_ADDRESS, UPDATE_ADDRESS } from "../mutation/address.mutation";

// export const useAddress = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [fetchAddresses] = useLazyQuery(GET_ADDRESS, {
//     variables: { action: "get", input: { street: "" } },
//     fetchPolicy: "network-only",
//     onCompleted: (data) => {
//       const addresses = data?.address?.address;

//       if (addresses && addresses.length > 0) {
//         dispatch(setAddresses({ addresses }));
//       } else {
//         toast.warn("No se encontró ninguna dirección.");
//       }
//       navigate("/"); // Redireciona após o processamento
//     },
//     onError: (error) =>
//       toast.error(`Erro ao buscar endereços: ${error.message}`),
//   });

//   const addresses = useSelector((state) => state.addresses);
//   const direccion = useSelector((state) => state.addresses);

//   const [newAddress] = useMutation(NEW_ADDRESS, {
//     onCompleted: async (data) => {
//       const addresses = direccion.addressesData || [];
//       toast.success("Endereço cadastrado com sucesso!");
//       dispatch(
//         setAddresses({
//           addresses: [...addresses, data.addressMutation.address],
//         })
//       );
//       console.log("endereço cadastrado: ", data.addressMutation.address);
//       console.log(data.addressMutation.address.id);
//       navigate(`/address?tab=/address/${data.addressMutation.address.id}`);
//     },
//     onError: (error) =>
//       toast.error(`Erro ao cadastrar endereço: ${error.message}`),
//   });

//   //   const addresses
//   // const addresses = useSelector((state) => state.addresses);

//   //   const [updateAddress, { loading }] = useMutation(UPDATE_ADDRESS, {
//   //     onCompleted: (data) => {
//   //       setIsButtonDisabled(true);
//   //       toast.success("Endereço atualizado com sucesso!");

//   //       const updatedAddress = data.addressMutation.address;

//   //       dispatch(
//   //         setAddresses({
//   //           addresses: addresses.addressesData.map((addr) =>
//   //             addr.id === updatedAddress.id ? updatedAddress : addr
//   //           ),
//   //         })
//   //       );

//   //       navigate(`/address?tab=/address/${data.addressMutation.address.id}`);
//   //       // navigate("/address?tab=search-address");
//   //     },
//   //     onError: (error) => {
//   //       setIsButtonDisabled(false);
//   //       toast.error(`Erro ao atualizar endereço: ${error.message}`);
//   //     },
//   //   });

//   return { fetchAddresses, newAddress };
// };

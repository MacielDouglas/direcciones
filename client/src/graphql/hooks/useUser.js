import { useDispatch } from "react-redux";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { LOGOUT, USERS } from "../queries/user.query.js";
import { LOGIN, UPDATE_USER } from "../mutation/user.mutation";
import { clearUser, setUser } from "../../store/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAddress } from "./useAddress";
import { clearCards, clearMyCards } from "../../store/cardsSlice";
import { clearAddresses } from "../../store/addressesSlice";
import { useMemo } from "react";
import { useCard } from "./useCard.js";

export const useUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fetchAddresses } = useAddress();
  const { fetchCards } = useCard();

  // Login com Google
  const [loginWithGoogle, { loading: loginLoading }] = useMutation(LOGIN, {
    fetchPolicy: "network-only",
    onCompleted: async (data) => {
      const userData = data?.loginWithGoogle?.user;

      if (data?.loginWithGoogle?.success && userData) {
        dispatch(setUser({ user: userData }));
        toast.success("¡Inicio de sesión exitoso!");

        if (userData.group !== "0") {
          await fetchCards();
          await fetchAddresses();
          navigate("/");
        } else {
          navigate("/");
        }
      }
    },
    onError: (error) => {
      toast.error(`Erro no login: ${error.message || "Erro desconhecido"}`);
    },
  });

  // Logout do usuário
  const [logoutUser, { loading: isLoggingOut }] = useLazyQuery(LOGOUT, {
    onCompleted: () => {
      dispatch(clearUser());
      dispatch(clearCards());
      dispatch(clearMyCards());
      dispatch(clearAddresses());
      toast.success("¡Cierre de sesión exitoso!");
    },
    onError: (error) => {
      toast.error(
        `Error en la solicitud de cierre de sesión: ${error.message}`
      );
    },
  });

  // Obter usuários
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
    refetch: usersRefetching,
  } = useQuery(USERS);

  // Atualizar usuário
  const [updateUserInput] = useMutation(UPDATE_USER, {
    onCompleted: (data) => {
      usersRefetching();
      toast.success(data?.userMutation?.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Buscar usuários com Lazy Query
  const [fetchUsers, { data: fetchUsersData }] = useLazyQuery(USERS, {
    fetchPolicy: "network-only",
  });

  // Memoiza os valores retornados para evitar re-renderizações desnecessárias
  return useMemo(
    () => ({
      loginWithGoogle,
      loginLoading,
      logoutUser,
      isLoggingOut,
      updateUserInput,
      usersData,
      usersLoading,
      usersError,
      fetchUsers,
      fetchUsersData,
    }),
    [
      loginWithGoogle,
      loginLoading,
      logoutUser,
      isLoggingOut,
      updateUserInput,
      usersData,
      usersLoading,
      usersError,
      fetchUsers,
      fetchUsersData,
    ]
  );
};

// import { useDispatch, useSelector } from "react-redux";
// import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
// import { GET_USERS, LOGOUT } from "./../queries/user.query";
// import { LOGIN_GOOGLE, UPDATE_USER } from "../mutation/user.mutation";
// import { clearUser, setUser } from "../../store/userSlice";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { useAddress } from "./useAddress";
// import { clearCards } from "../../store/cardsSlice";
// import { clearAddresses } from "../../store/addressesSlice";

// export const useUser = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { fetchAddresses } = useAddress();

//   const [loginGoogle, { loading: loginLoading }] = useMutation(LOGIN_GOOGLE, {
//     onCompleted: (data) => {
//       const userData = data.loginGoogle?.user;

//       if (data?.loginGoogle?.success && userData) {
//         dispatch(setUser({ user: userData }));
//         toast.success("¡Inicio de sesión exitoso!");

//         if (userData.group !== "0") {
//           fetchAddresses(); // Busca endereços se o grupo não for "0"
//         } else {
//           navigate("/"); // Redireciona para a página inicial
//         }
//       }
//     },
//     onError: (error) =>
//       toast.error(`Erro no login: ${error.message || "Erro desconhecido"}`),
//   });

//   const [logoutUser, { loading: isLoggingOut }] = useLazyQuery(LOGOUT, {
//     onCompleted: (data) => {
//       if (data.user.success) {
//         dispatch(clearUser());
//         dispatch(clearUser());
//         dispatch(clearCards());
//         dispatch(clearAddresses());
//         toast.success("¡Cierre de sesión exitoso!");
//       } else {
//         toast.error(`Error al cerrar sesión: ${data.user.message}`);
//       }
//     },
//     onError: (error) => {
//       toast.error(
//         `Error en la solicitud de cierre de sesión: ${error.message}`
//       );
//     },
//   });

//   const {
//     data: usersData,
//     loading: usersLoading,
//     error: usersError,
//     refetch: usersRefetching,
//   } = useQuery(GET_USERS);

//   const [updateUserInput] = useMutation(UPDATE_USER, {
//     onCompleted: (data) => {
//       usersRefetching();
//       toast.success(data.userMutation.message);
//     },
//     onError: (error) => {
//       toast.error(error.message);
//     },
//   });

//   const user = useSelector((state) => state.user.userData);

//   const [fetchUsers, { data: fetchUsersData }] = useLazyQuery(GET_USERS, {
//     variables: { group: user.group },
//     fetchPolicy: "network-only",
//   });

//   return {
//     loginGoogle,
//     loginLoading,
//     logoutUser,
//     isLoggingOut,
//     updateUserInput,
//     usersData,
//     usersLoading,
//     usersError,
//     fetchUsers,
//     fetchUsersData,
//   };
// };

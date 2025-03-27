import { useLazyQuery, useMutation } from "@apollo/client";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { GET_USERS, LOGOUT } from "../queries/user.query";
import { clearAddresses } from "../../store/addressesSlice";
import { clearCards } from "../../store/cardsSlice";
import { clearUser } from "../../store/userSlice";
import { UPDATE_USER } from "../mutation/user.mutation";
import { useState } from "react";

export function useGetUsers() {
  const [users, setUsers] = useState([]);
  const [fetchUsers] = useLazyQuery(GET_USERS, {
    fetchPolicy: "network-only",
    onCompleted: (data) => setUsers(data.getUsers),
    onError: (err) => console.error("Erro ao buscar usuários: ", err),
  });

  return { fetchUsers, users };
}

export function useLogout() {
  const dispatch = useDispatch();

  const [logoutUser, { loading }] = useLazyQuery(LOGOUT, {
    onCompleted: (data) => {
      if (data?.logout?.success) {
        dispatch(clearAddresses());
        dispatch(clearCards());
        dispatch(clearUser());
        toast.success("Sessão encerrada com sucesso!");
      } else {
        toast.error("Erro ao encerrar a sessão.");
      }
    },
    onError: () => toast.error("Erro na solicitação de logout."),
  });

  return { logoutUser, isLoggingOut: loading };
}

export function useUpdateUser() {
  const [updateUserInput] = useMutation(UPDATE_USER, {
    onCompleted: (data) => {
      toast.success(data.updateUser.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { updateUserInput };
}

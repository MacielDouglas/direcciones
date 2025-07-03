import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_USERS, LOGOUT } from "../queries/user.query";

import { useDispatch } from "react-redux";
import { clearUsers, setUsers } from "../../store/otherUsersSlice";
import { UPDATE_USER } from "../mutations/user.mutations";
import { useToastMessage } from "../../hooks/useToastMessage";
import { clearMyUser } from "../../store/userSlice";
import { clearCards } from "../../store/cardsSlice";
import { clearMyCards } from "../../store/myCardsSlice";
import { clearAddresses } from "../../store/addressSlice";

export function useGetUsers() {
  const dispatch = useDispatch();

  const [fetchUsers] = useLazyQuery(GET_USERS, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      dispatch(setUsers({ users: data.getUsers }));
    },
    onError: (err) => console.error("Erro ao buscar usuários: ", err),
  });

  return { fetchUsers };
}

export function useUpdateUser() {
  const { showToast } = useToastMessage();

  const [updateUserInput] = useMutation(UPDATE_USER, {
    onCompleted: (data) => {
      showToast({ message: data.updateUser.message, type: "success" });
    },
    onError: (error) => {
      showToast({
        message: error.message,
        type: "error",
      });
    },
  });

  return { updateUserInput };
}

export function useLogout() {
  const dispatch = useDispatch();
  const { showToast } = useToastMessage();

  const [logoutUser, { loading }] = useLazyQuery(LOGOUT, {
    onCompleted: (data) => {
      if (data?.logout?.success) {
        dispatch(clearMyUser());
        dispatch(clearCards());
        dispatch(clearMyCards());
        dispatch(clearAddresses());
        dispatch(clearUsers());
        showToast({
          message: "¡La sesión finalizó exitosamente!",
          type: "success",
        });
      } else {
        showToast({ message: `Error finalizar sesión`, type: "error" });
      }
    },
    onError: () => console.error("Erro na solicitação de logout."),
    fetchPolicy: "no-cache",
  });

  return { logoutUser, loading };
}

import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_USERS } from "../queries/user.query";

import { useDispatch } from "react-redux";
import { setUsers } from "../../store/otherUsersSlice";
import { UPDATE_USER } from "../mutations/user.mutations";
import { useToastMessage } from "../../hooks/useToastMessage";

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

import { useLazyQuery } from "@apollo/client";
import { GET_USERS } from "../queries/user.query";

import { useDispatch } from "react-redux";
import { setUsers } from "../../store/otherUsersSlice";

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

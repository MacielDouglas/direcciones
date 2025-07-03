import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectAllUsersOthers } from "../store/selectors/ohterUsersSelectors";
import { selectGroup, selectIsAdmin } from "../store/selectors/userSelectors";
import { useGetUsers, useUpdateUser } from "../graphql/hooks/useUser";
import { Ban, SendHorizontal } from "lucide-react";
import { useToastMessage } from "../hooks/useToastMessage";
import type { User } from "../types/user.types";

const AdminUsers = () => {
  const users = useSelector(selectAllUsersOthers) as User[];
  const isAdmin = useSelector(selectIsAdmin);
  const group = useSelector(selectGroup);
  const { fetchUsers } = useGetUsers();
  const { updateUserInput } = useUpdateUser();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newName, setNewName] = useState("");
  const [isNameDuplicate, setIsNameDuplicate] = useState(false);
  const [isSSMap, setIsSSMap] = useState<Record<string, boolean>>({});

  const groupedUsers = users.filter((u) => u.group === group);
  const ungroupedUsers = users.filter((u) => u.group !== group);
  const { showToast } = useToastMessage();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const checkDuplicateName = useCallback(
    (name: string) =>
      groupedUsers.some((u) => u.name.toLowerCase() === name.toLowerCase()),
    [groupedUsers]
  );

  const handleGroupChange = useCallback(
    async (userId: string, action: "add" | "remove") => {
      try {
        const user = users.find((u) => u.id === userId);
        if (!user) return;

        const newGroup = action === "add" ? group : "0";

        if (action === "add" && checkDuplicateName(user.name)) {
          setIsNameDuplicate(true);
          setSelectedUser(user);
          return;
        }

        await updateUserInput({
          variables: {
            updateUserId: user.id,
            user: {
              name: user.name,
              group: newGroup,
              isSS: isSSMap[user.id] || false,
            },
          },
        });
        fetchUsers();
      } catch (error: unknown) {
        if (error instanceof Error) {
          showToast({
            message: `Error al actualizar el grupo: ${error.message}`,
            type: "error",
          });
        } else {
          showToast({
            message: `Error en actualizar el grupo: ${error}`,
            type: "error",
          });
        }
      }
    },
    [
      users,
      group,
      checkDuplicateName,
      updateUserInput,
      isSSMap,
      fetchUsers,
      showToast,
    ]
  );

  const handleSiervoToggle = useCallback(
    async (userId: string) => {
      try {
        const user = users.find((u) => u.id === userId);
        if (!user) return;

        await updateUserInput({
          variables: {
            updateUserId: user.id,
            user: {
              name: user.name,
              isSCards: !user.isSCards,
            },
          },
        });
        fetchUsers();
      } catch (error: unknown) {
        if (error instanceof Error) {
          showToast({
            message: `Error ao permitir enviar tarjeta: ${error.message}`,
            type: "error",
          });
        } else {
          showToast({
            message: `Error en actualizar el grupo: ${error}`,
            type: "error",
          });
        }
      }
    },
    [users, updateUserInput, fetchUsers, showToast]
  );

  const confirmAddWithNewName = useCallback(async () => {
    if (!selectedUser || !newName.trim() || checkDuplicateName(newName)) return;

    try {
      await updateUserInput({
        variables: {
          updateUserId: selectedUser.id,
          user: {
            name: newName.trim(),
            group,
            isSS: isSSMap[selectedUser.id] || false,
          },
        },
      });
      fetchUsers();
      setSelectedUser(null);
      setIsNameDuplicate(false);
      setNewName("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast({
          message: `Erro ao alterar siervo: ${error.message}`,
          type: "error",
        });
      } else {
        showToast({
          message: `Erro ao alterar siervo: ${error}`,
          type: "error",
        });
      }
    }
  }, [
    selectedUser,
    newName,
    group,
    isSSMap,
    checkDuplicateName,
    updateUserInput,
    fetchUsers,
    showToast,
  ]);

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Introdução */}
      <section className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-6 shadow max-w-2xl mx-auto">
        <h1 className="text-4xl font-semibold">Administrar usuários</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-lg">
          En esta sección puedes agregar y eliminar usuarios.
        </p>
      </section>

      {/* Usuários não adicionados */}
      <div className="space-y-6 max-w-2xl mx-auto p-6">
        {ungroupedUsers.length > 0 ? (
          <>
            <h2 className="text-2xl">Usuarios no añadidos</h2>
            <ul className="space-y-4">
              {ungroupedUsers.map((user) => (
                <li key={user.id} className="flex gap-5 items-center">
                  <img
                    src={user.profilePicture}
                    alt={`Foto do usuário ${user.name}`}
                    className="w-16 h-16 object-cover rounded-full"
                  />
                  <div className="flex flex-col gap-1 w-3/5">
                    <p className="text-sm text-neutral-500">
                      Código: {user.codUser}
                    </p>
                    <p className="font-semibold truncate">{user.name}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => handleGroupChange(user.id, "add")}
                      className="bg-yellow-400 text-black px-3 py-1 rounded-lg"
                    >
                      Adicionar
                    </button>
                    {isAdmin && (
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">Admin</p>
                        <label
                          className={`relative block h-8 w-14 rounded-full bg-gray-300 dark:bg-gray-600 transition-colors ${
                            isSSMap[user.id] && "!bg-destaque-primary"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={isSSMap[user.id] || false}
                            onChange={() =>
                              setIsSSMap((prev) => ({
                                ...prev,
                                [user.id]: !prev[user.id],
                              }))
                            }
                          />
                          <span
                            className={`absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-gray-900 peer-checked:start-6 transition-all `}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>No hay usuarios disponibles para agregar.</p>
        )}
      </div>

      {/* Usuários do grupo */}
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl shadow p-4">
          <h2 className="text-xl font-semibold mb-5">
            Usuários do grupo: {groupedUsers.length}
          </h2>
          <ul className="space-y-4">
            {groupedUsers.map((user) => (
              <li
                key={user.id}
                className="grid grid-cols-4 gap-2 items-center bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
              >
                <img
                  src={user.profilePicture}
                  alt={`Foto do usuário ${user.name}`}
                  className="w-16 h-16 object-cover rounded-full"
                />
                <div className="col-span-2 flex flex-col gap-1">
                  <p className="text-sm text-neutral-500">
                    Código: {user.codUser}
                  </p>
                  <p className="font-semibold truncate">{user.name}</p>
                  {user.isSS && (
                    <p className="text-sm text-neutral-600 dark:text-yellow-400">
                      Admin
                    </p>
                  )}
                  {user.isSCards && (
                    <p className="text-sm text-neutral-600 dark:text-yellow-400">
                      puede enviar tarjetas
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-3  w-full h-full justify-center">
                  {!user.isSS && (
                    <button
                      className={`px-2 py-1 text-sm rounded-md flex items-center justify-center gap-1 ${
                        user.isSCards || user.isSS
                          ? "bg-blue-500 text-white"
                          : "bg-primary-drk text-white"
                      }`}
                      onClick={() => handleSiervoToggle(user.id)}
                    >
                      Tarjeta
                      {user.isSCards ? (
                        <SendHorizontal size={18} />
                      ) : (
                        <Ban size={18} />
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => handleGroupChange(user.id, "remove")}
                    className="bg-red-500 text-white px-3 py-1 rounded-md text-sm w-full"
                  >
                    Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal de nome duplicado */}
      {isNameDuplicate && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-medium mb-4">Nome duplicado</h3>
            <p className="mb-4">
              O nome <strong>{selectedUser.name}</strong> já existe no grupo.
              Insira um novo nome:
            </p>
            <input
              className="w-full p-2 border rounded-lg mb-4"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsNameDuplicate(false);
                  setNewName("");
                  setSelectedUser(null);
                }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={confirmAddWithNewName}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                disabled={!newName.trim() || checkDuplicateName(newName)}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

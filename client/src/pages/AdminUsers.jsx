import { useMutation, useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { GET_USERS } from "../graphql/queries/user.query";
import { useState } from "react";
import { UPDATE_USER } from "../graphql/mutation/user.mutation";
import { toast } from "react-toastify";

function AdminUsers() {
  const user = useSelector((state) => state.user.userData); // Usuário logado
  const { group } = user;
  const { data: usersData, loading, error, refetch } = useQuery(GET_USERS);
  const [updateUserInput] = useMutation(UPDATE_USER, {
    onCompleted: (data) => {
      refetch();
      toast.success(data.userMutation.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [selectedUser, setSelectedUser] = useState(null); // Usuário selecionado
  const [newName, setNewName] = useState(""); // Novo nome para o usuário em caso de duplicação
  const [seeNewName, setSeeNewName] = useState(""); // Novo nome para o usuário em caso de duplicação
  const [isNameDuplicate, setIsNameDuplicate] = useState(false); // Verifica se o nome está duplicado

  if (loading) return <p>Carregando usuários...</p>;
  if (error) return <p>Erro ao carregar usuários: {error.message}</p>;

  const users = usersData?.getUsers.users || [];
  const groupedUsers = users.filter((u) => u.group === group);
  const ungroupedUsers = users.filter((u) => u.group !== group);

  // Verifica se o nome do usuário já existe no grupo
  const checkDuplicateName = (name) =>
    groupedUsers.some((user) => user.name.toLowerCase() === name.toLowerCase());

  // Função para atualizar o grupo de um usuário
  const handleGroupChange = async (userId, action) => {
    try {
      const user = users.find((u) => u.id === userId);

      // Verifica duplicação de nome ao adicionar
      if (action === "add" && checkDuplicateName(user.name)) {
        if (newName == !user.name) {
          setIsNameDuplicate(true);
          setSeeNewName(user.name); // Define o nome atual no campo de edição
          return;
        }
      }

      await updateUserInput({
        variables: {
          action: "addGroup",
          updateUserInput: {
            userMutationId: userId,
            newName: newName,
          },
        },
      });

      setSelectedUser(null);
    } catch (error) {
      console.error("Erro ao atualizar o grupo:", error.message);
    }
  };

  // Confirmar a adição do usuário com um nome atualizado
  const confirmAddWithNewName = async () => {
    try {
      if (checkDuplicateName(newName) || !newName.trim()) {
        return;
      } // Impede se o nome ainda estiver duplicado

      setSelectedUser({
        ...selectedUser,
        name: newName,
      });
      setIsNameDuplicate(false);
    } catch (error) {
      console.error("Erro ao confirmar adição com novo nome:", error.message);
    }
  };

  return (
    <div className="text-start text-lg w-full">
      <div className="space-y-5 px-4 pt-3 mb-2">
        <h1 className="text-4xl font-medium">Administrar usuarios</h1>
        <p>En esta página, puede agregar o eliminar usuarios del grupo.</p>
      </div>
      <hr />
      <div className="px-4 mt-2">
        <h2 className="text-2xl font-semibold mb-4">
          Agregar usuario al grupo
        </h2>
        {ungroupedUsers.length > 0 ? (
          <ul className="space-y-4 mb-8">
            {ungroupedUsers.map((user) => (
              <li
                key={user.id}
                className="flex justify-between items-center bg-secondary p-4 rounded-lg shadow-md"
              >
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-yellow-300">
                    User code: {user.codUser}
                  </span>
                  <span className="font-medium text-gray-400">{user.name}</span>
                </div>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-lg"
                  onClick={() => setSelectedUser(user)}
                >
                  Selecionar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            No hay usuarios fuera del grupo para mostrar.
          </p>
        )}

        <h2 className="text-2xl font-semibold mb-4">
          Usuarios del grupo: {groupedUsers.length}
        </h2>
        {groupedUsers.length > 0 ? (
          <ul className="space-y-4">
            {groupedUsers.map((user) => (
              <li
                key={user.id}
                className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md"
              >
                <img
                  src={user.profilePicture}
                  className="w-12 h-12 object-cover rounded-full"
                  alt={user.name}
                />
                <div className="flex flex-col gap-2 w-full ml-4">
                  <span className="text-sm text-gray-600">
                    User code: {user.codUser}
                  </span>
                  <span className="font-medium text-secondary">
                    {user.name}
                  </span>
                </div>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-lg"
                  onClick={() => setSelectedUser(user)}
                >
                  Selecionar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            No hay usuarios en el grupo para mostrar.
          </p>
        )}
      </div>

      {/* Modal para adicionar/remover usuário do grupo */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            {isNameDuplicate ? (
              <>
                <h3 className="text-xl font-medium mb-4">Nombre duplicado</h3>
                <p className="mb-4">
                  Hay un usuario en el grupo con el nombre{" "}
                  <strong>{selectedUser.name}</strong>. Por favor, introduzca un
                  nuevo nombre o apellido.
                </p>
                <input
                  className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                  value={seeNewName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    setSeeNewName(e.target.value);
                  }}
                />
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                    onClick={() => {
                      setSelectedUser(null);
                      setIsNameDuplicate(false);
                      setNewName("");
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    className={`bg-secondary text-white px-4 py-2 rounded-lg ${
                      checkDuplicateName(newName) &&
                      "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={confirmAddWithNewName}
                    disabled={checkDuplicateName(newName) || !newName.trim()}
                  >
                    Confirmar
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-medium mb-4">
                  {selectedUser.group === group
                    ? "Remover do grupo"
                    : "Adicionar ao grupo"}
                </h3>
                <p className="mb-4">
                  Deseja{" "}
                  {selectedUser.group === group ? "remover" : "adicionar"}{" "}
                  <strong>{selectedUser.name}</strong> ao grupo?
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                    onClick={() => setSelectedUser(null)}
                  >
                    Cancelar
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg ${
                      selectedUser.group === group
                        ? "bg-red-500 text-white"
                        : "bg-secondary text-white"
                    }`}
                    onClick={() =>
                      handleGroupChange(
                        selectedUser.id,
                        selectedUser.group === group ? "remove" : "add"
                      )
                    }
                  >
                    {selectedUser.group === group ? "Remover" : "Adicionar"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;

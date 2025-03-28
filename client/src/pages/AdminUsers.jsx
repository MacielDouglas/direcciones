import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useGetUsers, useUpdateUser } from "../graphql/hooks/useUser";

function AdminUsers() {
  const user = useSelector((state) => state.user.userData);
  const { group, isAdmin } = user;

  const { fetchUsers, users } = useGetUsers();
  const { updateUserInput } = useUpdateUser();

  const [selectedUser, setSelectedUser] = useState(null);
  const [newName, setNewName] = useState("");
  const [isNameDuplicate, setIsNameDuplicate] = useState(false);
  const [isSSMap, setIsSSMap] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const groupedUsers = users.filter((u) => u.group === group);
  const ungroupedUsers = users.filter((u) => u.group !== group);

  const checkDuplicateName = (name) =>
    groupedUsers.some((u) => u.name.toLowerCase() === name.toLowerCase());

  const handleGroupChange = async (userId, action) => {
    try {
      const user = users.find((u) => u.id === userId);
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
      setSelectedUser(null);
    } catch (error) {
      console.error("Erro ao atualizar o grupo:", error.message);
    }
  };

  const confirmAddWithNewName = async () => {
    if (!newName.trim() || checkDuplicateName(newName)) return;
    try {
      await updateUserInput({
        variables: {
          updateUserId: selectedUser.id,
          user: {
            name: newName,
            group,
            isSS: isSSMap[selectedUser.id] || false,
          },
        },
      });
      fetchUsers();
      setSelectedUser(null);
      setIsNameDuplicate(false);
      setNewName("");
    } catch (error) {
      console.error("Erro ao confirmar adição com novo nome:", error.message);
    }
  };

  return (
    <div className="text-start text-lg w-full">
      <h1 className="text-4xl font-medium px-4 pt-3 mb-2">
        Administrar usuários
      </h1>
      <div className="px-4 mt-2 w-full">
        <hr />
        <h2 className="text-2xl  m-4">Agregar usuario al grupo</h2>
        {ungroupedUsers.length > 0 ? (
          <ul className="px-4 space-y-4">
            {ungroupedUsers.map((user) => (
              <li
                key={user.id}
                className="flex justify-between items-center bg-secondary p-4 rounded-lg shadow-md"
              >
                <img
                  src={user.profilePicture}
                  className="w-12 h-12 object-cover rounded-full"
                  alt={user.name}
                />
                <div className="flex flex-col gap-2 w-full ml-4">
                  <span className="text-sm text-yellow-300">
                    User code: {user.codUser}
                  </span>
                  <span className="font-medium text-gray-400">{user.name}</span>
                  {isAdmin && (
                    <div className="mt-2 text-gray-500">
                      <label className="text-sm font-medium">isSS</label>
                      <input
                        type="radio"
                        name={`isSS-${user.id}`}
                        checked={isSSMap[user.id] === true}
                        onChange={() =>
                          setIsSSMap({ ...isSSMap, [user.id]: true })
                        }
                        className="ml-2"
                      />{" "}
                      Sim
                      <input
                        type="radio"
                        name={`isSS-${user.id}`}
                        checked={isSSMap[user.id] === false}
                        onChange={() =>
                          setIsSSMap({ ...isSSMap, [user.id]: false })
                        }
                        className="ml-2"
                      />{" "}
                      Não
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleGroupChange(user.id, "add")}
                  className="bg-yellow-400 text-black px-3 py-1 rounded-lg"
                >
                  Adicionar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            Não há usuários disponíveis para adicionar.
          </p>
        )}
        <hr className="mt-5" />
        <h2 className="text-2xl  px-4 m-4">
          Usuarios del grupo: {groupedUsers.length}
        </h2>
        <ul className="px-4 space-y-4">
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
                <span className="font-medium text-secondary">{user.name}</span>
              </div>
              <button
                onClick={() => handleGroupChange(user.id, "remove")}
                className="bg-red-500 text-white px-3 py-1 rounded-lg"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      </div>

      {isNameDuplicate && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-medium mb-4">Nome duplicado</h3>
            <p className="mb-4">
              O nome "{selectedUser.name}" já existe no grupo. Insira um novo
              nome:
            </p>
            <input
              className="w-full p-2 border rounded-lg mb-4"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsNameDuplicate(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={confirmAddWithNewName}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
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
}

export default AdminUsers;

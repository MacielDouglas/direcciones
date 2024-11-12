import { useLazyQuery, useQuery } from "@apollo/client";
import { useState } from "react";
import { LOGIN_USER } from "./graphql/queries/user.query.js";
import { GET_ADDRESS } from "./graphql/mutation/address.mutation.js";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginUser, { data, loading }] = useLazyQuery(LOGIN_USER, {
    onCompleted: (data) => {
      console.log(data.user.user);
    },
    onError: (error) => {
      console.error(`Deu erro: ${error.message}`);
    },
  });

  const handleLogin = () => {
    loginUser({ variables: { action: "login", email, password } });
  };
  console.log(data);

  const { data: datadados, error } = useQuery(GET_ADDRESS, {
    // fetchPolicy: "network-only", // Garante que a consulta seja sempre feita no servidor
    variables: {
      action: "get",
      addressId: "",
      input: {
        street: "",
        active: false,
        city: "",
        confirmed: false,
        neighborhood: "",
      },
    },
    onCompleted: (response) => {
      console.log("Dados recebidos:", response);
    },
    onError: (err) => {
      console.error("Erro na consulta:", err);
    },
  });
  // console.log(datadados);
  console.log(error);

  const addresses = datadados?.address?.address || [];

  // Estado para armazenar o termo de busca e a página atual
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtra os endereços com base no termo de busca
  const filteredAddresses = addresses.filter((address) =>
    address.street.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Configuração da paginação
  const itemsPerPage = 20;
  const totalPages = Math.ceil(filteredAddresses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAddresses = filteredAddresses.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  console.log(addresses);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="my-2 w-full p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="my-2 w-full p-2 border rounded"
      />
      <button
        onClick={handleLogin}
        className="my-10 bg-red-700 w-full py-2 text-white rounded disabled:bg-red-300 hover:bg-red-500"
        disabled={loading}
      ></button>

      <div className="bg-white rounded-lg shadow-md p-4">
        {loading && <p>Loading...</p>}
        {error && <p>Error loading addresses</p>}
        <h2>Encontrado, {addresses.length} direcciones</h2>
        <ul className="space-y-4">
          {paginatedAddresses.length > 0 ? (
            paginatedAddresses.map((address, index) => (
              <li key={index} className="border-b border-gray-200 pb-3">
                <p className="text-gray-800 font-semibold">
                  {address.street}, {address.number}
                </p>
                <p className="text-gray-500 text-sm">
                  {address.city}, {address.neighborhood}
                </p>
              </li>
            ))
          ) : (
            <p>No se encontraron direcciones</p>
          )}
        </ul>
      </div>

      <div className="flex items-center justify-center mt-6 space-x-4 text-sky-800">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}

export default App;

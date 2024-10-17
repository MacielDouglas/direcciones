import { gql, useLazyQuery } from "@apollo/client";
import React, { useState } from "react";

// Definição da query GraphQL
const GET_USER = gql`
  query getUser($getUserId: ID!) {
    getUser(id: $getUserId) {
      name
      group
      isAdmin
      isSS
      profilePicture
      myCards
    }
  }
`;

function App() {
  // Estado para armazenar o valor do input
  const [inputValue, setInputValue] = useState("");

  // Utilizando useLazyQuery para buscar quando o usuário enviar o ID
  const [getUser, { loading, data, error }] = useLazyQuery(GET_USER);

  // Função para lidar com a submissão do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    // Faz a busca quando o formulário for enviado
    if (inputValue) {
      getUser({ variables: { getUserId: inputValue } });
    }
  };

  // Tratamento de erros e loading
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Buscar Usuário</h1>

      {/* Formulário para digitar o ID */}
      <form onSubmit={handleSubmit}>
        <label>
          Digite o ID do Usuário:
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)} // Atualiza o estado do input
          />
        </label>
        <button type="submit">Buscar</button>
      </form>

      {/* Renderizando os dados do usuário se a busca tiver sucesso */}
      {data && data.getUser && (
        <div>
          <h2>Informações do Usuário:</h2>
          <p>Nome: {data.getUser.name}</p>
          <p>Grupo: {data.getUser.group}</p>
          <p>Admin: {data.getUser.isAdmin ? "Sim" : "Não"}</p>
          <p>SS: {data.getUser.isSS ? "Sim" : "Não"}</p>
          <p>
            <img src={data.getUser.profilePicture} alt="Profile" width="100" />
          </p>
          <p>Meus Cartões: {data.getUser.myCards.join(", ")}</p>
        </div>
      )}
    </div>
  );
}

export default App;

import { useLazyQuery } from "@apollo/client";
import { useState } from "react";
import { LOGIN_USER } from "./graphql/queries/user.query.js";

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
    </div>
  );
}

export default App;

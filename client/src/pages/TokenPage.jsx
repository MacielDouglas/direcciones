import { useDispatch, useSelector } from "react-redux";
import { FaCopy } from "react-icons/fa";
import { toast } from "react-toastify";
import SessionProvider from "../context/SessionProvider";
import { useCallback } from "react";
import { useLazyQuery } from "@apollo/client";
import { LOGOUT } from "../graphql/queries/user.query";
import { clearUser } from "../store/userSlice";

function TokenPage() {
  const user = useSelector((state) => state.user);
  const { name } = user.userData;
  const token = name.slice(-5); // substitua por lógica real
  const dispatch = useDispatch();

  const [logoutUser] = useLazyQuery(LOGOUT, {
    onCompleted: (data) => {
      if (data.user.success) {
        dispatch(clearUser());
        toast.success("¡Cierre de sesión exitoso!");
      } else {
        toast.error(`Erro ao fazer logout: ${data.user.message}`);
      }
    },
    onError: (error) => {
      toast.error(`Erro na solicitação de logout: ${error.message}`);
    },
  });

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    toast.success("Token copiado!");
  };

  const handleLogout = useCallback(() => {
    logoutUser({ variables: { action: "logout" } });
  }, [logoutUser]);

  return (
    <div
      className="h-screen bg-cover bg-center flex flex-col justify-center items-center"
      style={{ backgroundImage: `url('./ciudad_2.svg')` }}
    >
      <div className="w-full h-full flex items-center justify-center bg-stone-950 bg-opacity-[40%]  ">
        <div className="min-h-[400px] min-w-72 bg-white p-8 rounded shadow-lg text-center text-gray-700 flex items-center flex-col justify-center">
          <h2 className="text-3xl font-semibold mb-4">
            {" "}
            Muchas gracias{" "}
            <span className="text-orange-600 font-bold">
              {name.slice(0, -5)}
            </span>
            , por registrarte.
          </h2>

          <p className="mb-4">
            Envie este número ao administrador para obter acesso.
          </p>
          <div className="flex items-center justify-center mb-6">
            <span className="text-4xl font-mono text-orange-600">{token}</span>
            <button onClick={copyToken} className="ml-2 text-orange-500">
              <FaCopy />
            </button>
          </div>
          <p>Saludos.</p>
          <p>Administración.</p>
          <div className="w-full justify-center flex text-2xl font-semibold gap-3">
            <p>Desconectar en:</p>
            <SessionProvider />
          </div>
          <button
            onClick={handleLogout}
            className="hover:underline text-orange-500 flex items-center gap-2"
          >
            Encerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default TokenPage;

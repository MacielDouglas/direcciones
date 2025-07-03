import { useSelector } from "react-redux";
import {
  selectCodUser,
  selectUserName,
} from "../store/selectors/userSelectors";
import { useCallback } from "react";
import { useToastMessage } from "../hooks/useToastMessage";
import { useLogout } from "../graphql/hooks/useUser";
import SessionProvider from "../components/private/SessionProvider";
import { Paperclip } from "lucide-react";

const TokenPage = () => {
  const name = useSelector(selectUserName);
  const codUser = useSelector(selectCodUser);
  const { showToast } = useToastMessage();

  const { logoutUser, loading } = useLogout();

  const copyToken = () => {
    navigator.clipboard.writeText(String(codUser));
    showToast({
      message: "¡Token copiado!",
      type: "success",
    });
  };

  const handleLogout = useCallback(() => {
    console.log(loading);
    if (!loading) logoutUser();
  }, [logoutUser, loading]);

  return (
    <div
      className="h-screen bg-cover bg-center flex flex-col justify-center items-center"
      style={{ backgroundImage: `url('./ciudad_2.svg')` }}
    >
      <div className="w-full h-full flex items-center justify-center bg-stone-950/40  ">
        <div className="min-h-[400px] min-w-72 bg-white p-8 rounded shadow-lg text-center text-gray-700 flex items-center flex-col justify-center">
          <h2 className="text-3xl font-semibold mb-4">
            {" "}
            Muchas gracias{" "}
            <span className="text-orange-600 font-bold">{name}</span>, por
            registrarte.
          </h2>

          <p className="mb-4">
            Envíe este número al administrador para obtener acceso.
          </p>
          <div className="flex items-center justify-center mb-6">
            <span className="text-4xl font-mono text-orange-600">
              {codUser}
            </span>
            <button
              onClick={copyToken}
              className="ml-2 text-2xl text-orange-500 flex gap-1"
            >
              <Paperclip />
              <p className="text-sm">Copiar</p>
            </button>
          </div>
          <p>Saludos.</p>
          <p>Administración.</p>
          <div className="w-full justify-center flex text-2xl font-semibold gap-3">
            <p>Desconectar en:</p>
            <SessionProvider size={"20px"} />
          </div>
          <button
            onClick={handleLogout}
            className="hover:underline text-orange-500 flex items-center gap-2"
          >
            Encerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};
export default TokenPage;

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
  const { name, codUser } = user.userData;

  const dispatch = useDispatch();

  const [logoutUser] = useLazyQuery(LOGOUT, {
    onCompleted: (data) => {
      if (data.user.success) {
        dispatch(clearUser());
        toast.success("¡Cierre de sesión exitoso!");
      } else {
        toast.error(`Error al cerrar sesión: ${data.user.message}`);
      }
    },
    onError: (error) => {
      toast.error(
        `Error en la solicitud de cierre de sesión: ${error.message}`
      );
    },
  });

  const copyToken = () => {
    navigator.clipboard.writeText(codUser);
    toast.success("¡Token copiado!");
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
              <FaCopy />
              <p className="text-sm">Copiar</p>
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
            Encerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default TokenPage;

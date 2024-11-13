// pages/TokenPage.jsx
import { useSelector } from "react-redux";
import { FaCopy } from "react-icons/fa";
import { toast } from "react-toastify";

function TokenPage() {
  const user = useSelector((state) => state.user);
  const { name } = user.userData;
  const token = name.slice(-5); // substitua por lógica real
  console.log(user.userData.group);

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    toast.success("Token copiado!");
  };

  return (
    <div
      className="h-screen bg-cover bg-center flex flex-col justify-center items-center"
      style={{ backgroundImage: `url('./ciudad_2.svg')` }}
    >
      <div className="w-full h-full flex items-center justify-center bg-stone-950 bg-opacity-[40%]  ">
        <div className="min-h-[400px] min-w-72 bg-white p-8 rounded shadow-lg text-center text-gray-700">
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
        </div>
      </div>
    </div>
  );
}

export default TokenPage;

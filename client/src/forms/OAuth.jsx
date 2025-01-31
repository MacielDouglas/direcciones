import { FaGoogle } from "react-icons/fa";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useMutation, useLazyQuery } from "@apollo/client";
import { LOGIN_GOOGLE } from "../graphql/mutation/user.mutation";
import { GET_ADDRESS } from "../graphql/queries/address.query";
import { useDispatch } from "react-redux";
import { useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { setUser } from "../store/userSlice";
import { setAddresses } from "../store/addressesSlice";

function OAuth() {
  const auth = useMemo(() => getAuth(app), []); // Memoização para evitar recriação
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Mutação para login via Google
  const [loginGoogle, { loading: loginLoading }] = useMutation(LOGIN_GOOGLE, {
    onCompleted: (data) => handleLoginResponse(data),
    onError: (error) => toast.error(`Erro no login: ${error.message}`),
  });

  // Query para buscar endereços
  const [fetchAddresses] = useLazyQuery(GET_ADDRESS, {
    variables: { action: "get", input: { street: "" } },
    fetchPolicy: "network-only",
    onCompleted: (data) => handleAddressResponse(data),
    onError: (error) =>
      toast.error(`Erro ao buscar endereços: ${error.message}`),
  });

  // Processa a resposta do login
  const handleLoginResponse = useCallback(
    (data) => {
      const userData = data.loginGoogle?.user;

      if (data?.loginGoogle?.success && userData) {
        dispatch(setUser({ user: userData }));
        toast.success("¡Inicio de sesión exitoso!");

        if (userData.group !== "0") {
          fetchAddresses(); // Busca endereços se o grupo não for "0"
        } else {
          navigate("/"); // Redireciona para a página inicial
        }
      } else {
        toast.error(
          `Erro no login: ${data?.loginGoogle?.message || "Erro desconhecido"}`
        );
      }
    },
    [dispatch, fetchAddresses, navigate]
  );

  // Processa a resposta da busca de endereços
  const handleAddressResponse = useCallback(
    (data) => {
      const addresses = data?.address?.address;

      if (addresses && addresses.length > 0) {
        dispatch(setAddresses({ addresses }));
      } else {
        toast.warn("No se encontró ninguna dirección.");
      }
      navigate("/"); // Redireciona após o processamento
    },
    [dispatch, navigate]
  );

  // Função para lidar com o login via Google
  const handleGoogleLogin = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const result = await signInWithPopup(auth, provider);
      const { displayName, email, photoURL, uid } = result.user;

      await loginGoogle({
        variables: {
          user: { displayName, email, photoUrl: photoURL, uid },
        },
      });
    } catch (error) {
      toast.error(`Error al iniciar sesión con Google: ${error.message}`);
    }
  }, [auth, loginGoogle]);

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={loginLoading}
      className={`flex items-center bg-gradient-to-b from-white to-gray-300 justify-center border border-gray-300 text-gray-600 py-2 rounded-md w-full transition ${
        loginLoading
          ? "cursor-not-allowed bg-gray-200"
          : "hover:from-gray-100 hover:to-gray-400"
      }`}
    >
      <FaGoogle className="mr-2" />
      {loginLoading ? "Iniciar sesión..." : "Iniciar sesión con Google"}
    </button>
  );
}

export default OAuth;

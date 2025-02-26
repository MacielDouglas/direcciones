import { FaGoogle } from "react-icons/fa";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useCallback, useMemo } from "react";
import { toast } from "react-toastify";

import { useUser } from "../graphql/hooks/useUser";

function OAuth() {
  const auth = useMemo(() => getAuth(app), []); // Memoização para evitar recriação
  const { loginWithGoogle, loginLoading } = useUser();

  // Função para lidar com o login via Google
  const handleGoogleLogin = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const result = await signInWithPopup(auth, provider);
      const { displayName, email, photoURL, uid } = result.user;

      await loginWithGoogle({
        variables: {
          user: { displayName, email, photoUrl: photoURL, uid },
        },
      });
    } catch (error) {
      toast.error(`Error al iniciar sesión con Google: ${error.message}`);
    }
  }, [auth, loginWithGoogle]);

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

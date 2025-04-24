import { FaGoogle, FaSpinner } from "react-icons/fa";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN_GOOGLE } from "../graphql/mutation/user.mutation";
import { useDispatch } from "react-redux";
import { useMemo, useCallback, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { setUser } from "../store/userSlice";
import { useFetchCards } from "../graphql/hooks/useCard";
import { useFetchAddresses } from "../graphql/hooks/useAddress";
import { setAddresses } from "../store/addressesSlice";
import { setCards } from "../store/cardsSlice";

function OAuth() {
  const auth = useMemo(() => getAuth(app), []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [loginGoogle] = useMutation(LOGIN_GOOGLE);
  const { fetchCards } = useFetchCards();
  const { fetchAddresses } = useFetchAddresses();

  const handleGoogleLogin = useCallback(async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const result = await signInWithPopup(auth, provider);
      const { displayName, email, photoURL, uid } = result.user;

      const { data } = await loginGoogle({
        variables: { user: { displayName, email, photoUrl: photoURL, uid } },
      });

      if (!data?.loginWithGoogle?.success) {
        throw new Error(data?.loginWithGoogle?.message || "Erro desconhecido");
      }

      const userData = data.loginWithGoogle.user;
      dispatch(setUser({ user: userData }));
      toast.success("Login bem-sucedido!");
      fetchCards();
      const promises = [fetchCards()];
      if (userData.group !== "0") {
        promises.push(fetchAddresses());
      }

      const [cardsData, addressesData] = await Promise.all(promises);

      if (cardsData?.data?.card) {
        dispatch(setCards({ cards: cardsData.data.card }));
      }
      if (addressesData?.data?.addresses?.addresses) {
        dispatch(
          setAddresses({ addresses: addressesData.data.addresses.addresses })
        );
      }

      navigate("/");
    } catch (error) {
      toast.error(`Erro ao fazer login: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [auth, loginGoogle, fetchAddresses, fetchCards, dispatch, navigate]);

  return (
    <motion.button
      type="button"
      onClick={handleGoogleLogin}
      disabled={loading}
      className={`flex items-center bg-gradient-to-b from-white to-gray-300 justify-center border border-gray-300 text-gray-600 py-2 rounded-md w-full transition ${
        loading
          ? "cursor-not-allowed bg-gray-200"
          : "hover:from-gray-100 hover:to-gray-400"
      }`}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      aria-label="Iniciar sesión con Google"
      aria-busy={loading}
    >
      {loading ? (
        <div className="flex items-center">
          <FaSpinner className="animate-spin mr-2" />
          Iniciando sesión...
        </div>
      ) : (
        <>
          <FaGoogle className="mr-2" />
          Iniciar sesión con Google
        </>
      )}
    </motion.button>
  );
}

export default OAuth;

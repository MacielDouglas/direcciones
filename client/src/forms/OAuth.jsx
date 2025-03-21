import { FaGoogle } from "react-icons/fa";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useMutation, useLazyQuery } from "@apollo/client";
import { LOGIN_GOOGLE } from "../graphql/mutation/user.mutation";
import { ADDRESSES } from "../graphql/queries/address.query";
import { GET_CARDS } from "../graphql/queries/cards.query";
import { useDispatch } from "react-redux";
import { useMemo, useCallback, useState } from "react";
import { toast } from "react-toastify";
import { setUser } from "../store/userSlice";
import { setAddresses } from "../store/addressesSlice";
import { setCards } from "../store/cardsSlice";
import { motion } from "framer-motion";

function OAuth() {
  const auth = useMemo(() => getAuth(app), []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [loginGoogle] = useMutation(LOGIN_GOOGLE);
  const [fetchAddresses] = useLazyQuery(ADDRESSES, {
    fetchPolicy: "network-only",
  });
  const [fetchCards] = useLazyQuery(GET_CARDS, {
    fetchPolicy: "network-only",
    onCompleted: (data) => dispatch(setCards({ cards: data.card })),
    onError: (err) => toast.error("Erro ao carregar cartões: ", err),
  });

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

      const userData = data?.loginWithGoogle?.user;
      if (!data?.loginWithGoogle?.success || !userData) {
        throw new Error(data?.loginWithGoogle?.message || "Erro desconhecido");
      }

      dispatch(setUser({ user: userData }));
      toast.success("Login bem-sucedido!");

      const [cardsData, addressesData] = await Promise.all([
        userData.group !== "0"
          ? (await fetchAddresses(), await fetchCards())
          : null,
      ]);

      if (cardsData?.data?.card) {
        console.log("CARDS: ", cardsData.data.card);
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
  }, [auth, loginGoogle, fetchAddresses, dispatch, navigate, fetchCards]);

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
    >
      <FaGoogle className="mr-2" />
      {loading ? "Iniciando sessão..." : "Iniciar sessão com Google"}
    </motion.button>
  );
}

export default OAuth;

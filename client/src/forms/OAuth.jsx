// import { FaGoogle } from "react-icons/fa";
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { auth } from "../firebase"; // Importe diretamente o `auth` do Firebase
// import { useNavigate } from "react-router-dom";
// import { useMutation, useLazyQuery } from "@apollo/client";
// import { LOGIN_GOOGLE } from "../graphql/mutation/user.mutation";
// import { ADDRESSES } from "../graphql/queries/address.query";
// import { GET_CARDS } from "../graphql/queries/cards.query";
// import { useDispatch } from "react-redux";
// import { useCallback, useState } from "react";
// import { toast } from "react-toastify";
// import { setUser } from "../store/userSlice";
// import { setAddresses } from "../store/addressesSlice";
// import { setCards } from "../store/cardsSlice";
// import { motion } from "framer-motion";

// function OAuth() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const [loginGoogle] = useMutation(LOGIN_GOOGLE);
//   const [fetchAddresses] = useLazyQuery(ADDRESSES, {
//     fetchPolicy: "network-only",
//   });
//   const [fetchCards] = useLazyQuery(GET_CARDS);

//   const handleGoogleLogin = useCallback(async () => {
//     setLoading(true);
//     const provider = new GoogleAuthProvider();
//     provider.setCustomParameters({ prompt: "select_account" });

//     try {
//       const result = await signInWithPopup(auth, provider);
//       const { displayName, email, photoURL, uid } = result.user;

//       const { data } = await loginGoogle({
//         variables: { user: { displayName, email, photoUrl: photoURL, uid } },
//       });

//       const userData = data?.loginWithGoogle?.user;
//       if (!data?.loginWithGoogle?.success || !userData) {
//         throw new Error(data?.loginWithGoogle?.message || "Erro desconhecido");
//       }

//       dispatch(setUser({ user: userData }));
//       toast.success("Login bem-sucedido!");

//       const [cardsData, addressesData] = await Promise.all([
//         fetchCards(),
//         userData.group !== "0" ? fetchAddresses() : null,
//       ]);

//       if (cardsData?.data?.card) {
//         dispatch(setCards({ cards: cardsData.data.card }));
//       }
//       if (addressesData?.data?.addresses?.addresses) {
//         dispatch(
//           setAddresses({ addresses: addressesData.data.addresses.addresses })
//         );
//       }

//       navigate("/");
//     } catch (error) {
//       toast.error(`Erro ao fazer login: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }, [loginGoogle, fetchAddresses, dispatch, navigate, fetchCards]);

//   return (
//     <motion.button
//       type="button"
//       onClick={handleGoogleLogin}
//       disabled={loading}
//       className={`flex items-center bg-gradient-to-b from-white to-gray-300 justify-center border border-gray-300 text-gray-600 py-2 rounded-md w-full transition ${
//         loading
//           ? "cursor-not-allowed bg-gray-200"
//           : "hover:from-gray-100 hover:to-gray-400"
//       }`}
//       whileTap={{ scale: 0.95 }}
//       initial={{ opacity: 0, y: -10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//     >
//       <FaGoogle className="mr-2" />
//       {loading ? "Iniciando sessão..." : "Iniciar sessão com Google"}
//     </motion.button>
//   );
// }

// export default OAuth;

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
  const [fetchCards] = useLazyQuery(GET_CARDS);

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
        fetchCards(),
        userData.group !== "0" ? fetchAddresses() : null,
      ]);

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

// import { FaGoogle } from "react-icons/fa";
// import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { app } from "../firebase";
// import { useNavigate } from "react-router-dom";
// import { useMutation, useLazyQuery } from "@apollo/client";
// import { LOGIN_GOOGLE } from "../graphql/mutation/user.mutation";
// import { ADDRESSES } from "../graphql/queries/address.query";
// import { useDispatch } from "react-redux";
// import { useCallback, useMemo } from "react";
// import { toast } from "react-toastify";
// import { setUser } from "../store/userSlice";
// import { setAddresses } from "../store/addressesSlice";
// import { GET_CARDS } from "../graphql/queries/cards.query";
// import { setCards } from "../store/cardsSlice";

// function OAuth() {
//   const auth = useMemo(() => getAuth(app), []); // Memoização para evitar recriação
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Mutação para login via Google
//   const [loginGoogle, { loading: loginLoading }] = useMutation(LOGIN_GOOGLE, {
//     onCompleted: (data) => {
//       handleLoginResponse(data);
//       fetchCards();
//     },
//     onError: (error) => toast.error(`Erro no login: ${error.message}`),
//   });

//   const [fetchCards, { loading, error }] = useLazyQuery(GET_CARDS, {
//     onCompleted: (data) => {
//       if (data && data.card) {
//         dispatch(setCards({ cards: data.card }));
//       }
//     },
//     onError: (error) => {
//       toast.error(`Erro: ${error.message}`);
//     },
//   });

//   // Query para buscar endereços
//   const [fetchAddresses] = useLazyQuery(ADDRESSES, {
//     fetchPolicy: "network-only",
//     onCompleted: (data) => handleAddressResponse(data),
//     onError: (error) =>
//       toast.error(`Erro ao buscar endereços: ${error.message}`),
//   });

//   // Processa a resposta do login
//   const handleLoginResponse = useCallback(
//     (data) => {
//       const userData = data.loginWithGoogle?.user;

//       if (data?.loginWithGoogle?.success && userData) {
//         dispatch(setUser({ user: userData }));
//         toast.success("¡Inicio de sesión exitoso!");

//         if (userData.group !== "0") {
//           fetchAddresses(); // Busca endereços se o grupo não for "0"
//         } else {
//           navigate("/"); // Redireciona para a página inicial
//         }
//       } else {
//         toast.error(
//           `Erro no login: ${
//             data?.loginWithGoogle?.message || "Erro desconhecido"
//           }`
//         );
//       }
//     },
//     [dispatch, fetchAddresses, navigate]
//   );

//   // Processa a resposta da busca de endereços
//   const handleAddressResponse = useCallback(
//     (data) => {
//       const addresses = data?.addresses?.addresses;

//       if (addresses && addresses.length > 0) {
//         dispatch(setAddresses({ addresses }));
//       } else {
//         toast.warn("No se encontró ninguna dirección.");
//       }
//       navigate("/"); // Redireciona após o processamento
//     },
//     [dispatch, navigate]
//   );

//   // Função para lidar com o login via Google
//   const handleGoogleLogin = useCallback(async () => {
//     const provider = new GoogleAuthProvider();
//     provider.setCustomParameters({ prompt: "select_account" });

//     try {
//       const result = await signInWithPopup(auth, provider);
//       const { displayName, email, photoURL, uid } = result.user;

//       await loginGoogle({
//         variables: {
//           user: { displayName, email, photoUrl: photoURL, uid },
//         },
//       });
//     } catch (error) {
//       toast.error(`Error al iniciar sesión con Google: ${error.message}`);
//     }
//   }, [auth, loginGoogle]);

//   return (
//     <button
//       type="button"
//       onClick={handleGoogleLogin}
//       disabled={loginLoading}
//       className={`flex items-center bg-gradient-to-b from-white to-gray-300 justify-center border border-gray-300 text-gray-600 py-2 rounded-md w-full transition ${
//         loginLoading
//           ? "cursor-not-allowed bg-gray-200"
//           : "hover:from-gray-100 hover:to-gray-400"
//       }`}
//     >
//       <FaGoogle className="mr-2" />
//       {loginLoading ? "Iniciar sesión..." : "Iniciar sesión con Google"}
//     </button>
//   );
// }

// export default OAuth;

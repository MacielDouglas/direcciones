import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LOGIN_USER } from "./../graphql/queries/user.query";
import { toast } from "react-toastify";
import { FaGoogle, FaUserAlt, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import { setUser } from "../store/userSlice";

function Login() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onCompleted: (data) => {
      if (data?.user?.success) {
        dispatch(setUser({ user: data.user.user }));
        toast.success("¡Inicio de sesión exitoso!");
      } else {
        toast.error(`Error de inicio de sesión: ${data.user.message}`);
      }
    },
    onError: (error) => {
      toast.error(`Error en la solicitud de ingreso: ${error.message}`);
    },
  });

  useEffect(() => {
    if (user.isAuthenticated) {
      navigate("/");
    }
  }, [user.isAuthenticated, navigate]);

  const handleLogin = () => {
    loginUser({ variables: { action: "login", email, password } });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center"
      style={{ backgroundImage: `url('./ciudad_2.svg')` }}
    >
      {/* <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col justify-center items-center"> */}
      <motion.div
        className="bg-white shadow-lg rounded-lg p-10 max-w-md w-full"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="text-2xl font-bold mb-6 text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Bienvenido a{" "}
          <span className="text-bold text-orange-600 text-4xl">
            Direcciones
          </span>
        </motion.h1>
        <motion.p
          className="text-gray-600 mb-6 "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Para comenzar, debe iniciar sesión con una cuenta de{" "}
          <span className="text-red-500 font-semibold">Google</span>.
        </motion.p>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Email</label>
          <motion.div
            className="flex items-center border border-gray-300 rounded-md p-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <FaUserAlt className="text-gray-500 mr-2" />
            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow outline-none text-gray-700 bg-transparent"
            />
          </motion.div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm mb-2">Senha</label>
          <motion.div
            className="flex items-center border border-gray-300 rounded-md p-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <FaLock className="text-gray-500 mr-2" />
            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-grow outline-none text-gray-700 bg-transparent"
            />
          </motion.div>
        </div>

        <motion.button
          onClick={handleLogin}
          disabled={loading}
          className="bg-blue-500 text-white font-semibold py-2 rounded-md w-full mb-4 hover:bg-blue-600 transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </motion.button>

        <motion.button
          // onClick={handleGoogleLogin}
          className="flex items-center justify-center border border-gray-300 text-gray-600 py-2 rounded-md w-full hover:bg-gray-100 transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
        >
          <FaGoogle className="mr-2" />
          Entrar com Google
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Login;

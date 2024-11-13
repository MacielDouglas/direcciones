import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { clearUser } from "../../store/userSlice";
import { FaClock } from "react-icons/fa6";
import { clearUser } from "../store/userSlice";

const SessionProvider = ({ text }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const sessionExpiry = useSelector((state) => state.user.sessionExpiry);
  const [timeRemaining, setTimeRemaining] = useState(
    sessionExpiry ? sessionExpiry - Date.now() : 0
  );

  useEffect(() => {
    // Se o usuário não estiver autenticado, não inicia o contador
    if (!isAuthenticated || !sessionExpiry) return;

    const interval = setInterval(() => {
      const timeLeft = sessionExpiry - Date.now();
      setTimeRemaining(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(interval);
        dispatch(clearUser()); // Desloga o usuário
        window.location.reload(); // Atualiza a página
      }
    }, 1000);

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, [dispatch, isAuthenticated, sessionExpiry]);

  // Formata o tempo em mm:ss
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  // Caso o usuário não esteja autenticado, não mostra o contador
  if (!isAuthenticated || !sessionExpiry) return null;

  return (
    <div>
      {timeRemaining > 0 ? (
        <p className={`flex gap-2 items-center ${text}`}>
          <span className={`${timeRemaining < 600000 && "text-orange-500"}`}>
            {formatTime(timeRemaining)}
          </span>
          <FaClock />{" "}
        </p>
      ) : (
        <p>Sessão expirada</p>
      )}
    </div>
  );
};

export default SessionProvider;

// // context/SessionProvider.jsx
// import { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// const SessionContext = createContext();

// // Hook personalizado para usar o contexto
// export const useSession = () => useContext(SessionContext);

// const SessionProvider = ({ children }) => {
//   const [sessionTimeLeft, setSessionTimeLeft] = useState(600); // Exemplo: 10 minutos
//   const navigate = useNavigate();

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setSessionTimeLeft((prev) => prev - 1);
//     }, 1000);

//     if (sessionTimeLeft <= 0) {
//       clearInterval(interval);
//       toast.info("Sessão expirada. Redirecionando para login.");
//       navigate("/login");
//     }

//     return () => clearInterval(interval);
//   }, [sessionTimeLeft, navigate]);

//   const resetSession = () => {
//     setSessionTimeLeft(600); // Renova o tempo para 10 minutos
//   };

//   return (
//     <SessionContext.Provider value={{ sessionTimeLeft, resetSession }}>
//       {children}
//     </SessionContext.Provider>
//   );
// };

// export default SessionProvider;

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
        </p>
      ) : (
        <p>Sessão expirada</p>
      )}
    </div>
  );
};

export default SessionProvider;

import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  userIsAuthenticated,
  userSessionExpiry,
} from "../../store/selectors/userSelectors";

import { clearCards } from "../../store/cardsSlice";
import { clearAddresses } from "../../store/addressSlice";
import { useNavigate } from "react-router-dom";
import { clearMyCards } from "../../store/myCardsSlice";
import { useToastMessage } from "../../hooks/useToastMessage";
import { clearMyUser } from "../../store/userSlice";

interface SessionProviderProps {
  size: string;
}

const SessionProvider = ({ size }: SessionProviderProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToastMessage();
  const isAuthenticated = useSelector(userIsAuthenticated);
  const expiryTimestamp = useSelector(userSessionExpiry); // em ms

  const [timeRemaining, setTimeRemaining] = useState(() =>
    expiryTimestamp ? Math.max(0, expiryTimestamp - Date.now()) : 0
  );

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleSessionExpiry = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    dispatch(clearMyUser());
    dispatch(clearCards());
    dispatch(clearMyCards());
    dispatch(clearAddresses());
    showToast({ message: "¡La sesión expiró!", type: "error" });

    navigate("/login", { replace: true });
  }, [dispatch, navigate, showToast]);

  useEffect(() => {
    if (!isAuthenticated || !expiryTimestamp) return;

    // Verificação imediata ao montar o componente
    if (expiryTimestamp <= Date.now()) {
      handleSessionExpiry();
      return;
    }

    intervalRef.current = setInterval(() => {
      const remaining = expiryTimestamp - Date.now();
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        handleSessionExpiry();
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAuthenticated, expiryTimestamp, handleSessionExpiry]);

  if (!isAuthenticated || !expiryTimestamp) return null;

  const formatTime = (ms: number) => {
    const seconds = Math.max(0, Math.floor(ms / 1000));
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <div>
      {timeRemaining > 0 ? (
        <p className={`flex items-center gap-2 ${size}`}>
          <span className={timeRemaining < 600000 ? "text-orange-500" : ""}>
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

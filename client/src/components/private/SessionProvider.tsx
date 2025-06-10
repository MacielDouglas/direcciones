import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userSessionExpiry } from "../../store/selectors/userSelectors";
import { clearUser } from "../../store/userSlice";

const EXPIRATION_SECONDS = 3600; // 1 hora
const WARNING_THRESHOLD = 600; // 10 minutos

interface SessionProviderProps {
  size: string;
}

const SessionProvider = ({ size }: SessionProviderProps) => {
  const dispatch = useDispatch();
  const timeExpiry = useSelector(userSessionExpiry); // timestamp do login (ms)
  const [secondsLeft, setSecondsLeft] = useState(EXPIRATION_SECONDS);

  useEffect(() => {
    if (!timeExpiry) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - timeExpiry) / 1000);
      const remaining = EXPIRATION_SECONDS - elapsedSeconds;

      if (remaining <= 0) {
        dispatch(clearUser());
        clearInterval(interval);
        console.log("Sessão expirada automaticamente.");
      } else {
        setSecondsLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch, timeExpiry]);

  const formatTime = (seconds: number) => {
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const isWarning = secondsLeft <= WARNING_THRESHOLD;

  return (
    <div>
      <p
        className={`flex items-center gap-2 font-semibold ${size} ${
          isWarning && "text-red-600 "
        } `}
      >
        {formatTime(secondsLeft)}
      </p>
    </div>
  );
};

export default SessionProvider;

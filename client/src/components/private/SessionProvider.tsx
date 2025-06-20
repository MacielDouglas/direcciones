import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  userIsAuthenticated,
  userSessionExpiry,
} from "../../store/selectors/userSelectors";
import { clearUser } from "../../store/userSlice";
import toast from "react-hot-toast";

interface SessionProviderProps {
  size: string;
}

const SessionProvider = ({ size }: SessionProviderProps) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(userIsAuthenticated);
  const expiryTimestamp = useSelector(userSessionExpiry); // em ms

  const [timeRemaining, setTimeRemaining] = useState(() =>
    expiryTimestamp ? expiryTimestamp - Date.now() : 0
  );

  useEffect(() => {
    if (!isAuthenticated || !expiryTimestamp) return;

    const intervalId = setInterval(() => {
      const remaining = expiryTimestamp - Date.now();
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(intervalId);
        dispatch(clearUser());
        toast.error("Logout!!!", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        window.location.reload(); // força logout
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isAuthenticated, expiryTimestamp, dispatch]);

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
        <p>La sesión expiró</p>
      )}
    </div>
  );
};

export default SessionProvider;

// components/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSession } from "./SessionProvider";
// import { useSession } from "../context/SessionProvider";

function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.user);
  const { sessionTimeLeft } = useSession();

  if (!user.isAuthenticated || sessionTimeLeft <= 0) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;

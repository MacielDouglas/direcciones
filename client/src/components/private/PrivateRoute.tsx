import {
  selectAuthUser,
  selectIsAuthenticated,
} from "@/store/slices/authSlice";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { group = "0" } = useSelector(selectAuthUser) || {};

  console.log("Goupe: ", group);

  return !isAuthenticated ? (
    <Navigate to="/login" />
  ) : group === "0" ? (
    <Navigate to="/token" />
  ) : (
    <Outlet />
  );
}

export default PrivateRoute;

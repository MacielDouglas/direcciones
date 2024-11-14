import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function OnlyGroupPrivateRoute() {
  const user = useSelector((state) => state.user);

  return user && user.userData.group !== "0" ? (
    <Outlet />
  ) : (
    <Navigate to="/token" />
  );
}

export default OnlyGroupPrivateRoute;

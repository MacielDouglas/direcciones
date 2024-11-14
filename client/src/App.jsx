import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import OnlyGroupPrivateRoute from "./components/private route/OnlyGroupPrivateRoute";
import Home from "./pages/Home";
import TokenPage from "./pages/TokenPage";
import PrivateRoute from "./components/private route/PrivateRoute";
import { useSelector } from "react-redux";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";

function App() {
  const user = useSelector((state) => state.user);
  return (
    <BrowserRouter>
      <ToastContainer position="top-center" theme="dark" />
      {user.userData && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/token" element={<TokenPage />} />
          <Route element={<OnlyGroupPrivateRoute />}>
            <Route path="/" element={<Home />} />
          </Route>
        </Route>
      </Routes>
      {user.userData && user.userData.group !== "0" && <Footer />}
    </BrowserRouter>
  );
}

export default App;

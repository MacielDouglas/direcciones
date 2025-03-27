import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

import Login from "./pages/Login";
import Home from "./pages/Home";
import TokenPage from "./pages/TokenPage";
import Direcciones from "./pages/Direcciones";
import Cards from "./pages/Cards";
import AdminUsers from "./pages/AdminUsers";
import UserPage from "./pages/UserPage";

import PrivateRoute from "./components/private route/PrivateRoute";
import OnlyGroupPrivateRoute from "./components/private route/OnlyGroupPrivateRoute";
import Header from "./components/Header";
import ScrollToTop from "./context/ScrollTotop";
import NavButtons from "./components/NavButtons";
import { useEffect } from "react";
import { setCards } from "./store/cardsSlice";

function App() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = new WebSocket(import.meta.env.VITE_API_URL_SOCKET);
    socket.onmessage = (event) => {
      const cardsReceived = JSON.parse(event.data);
      if (cardsReceived) {
        dispatch(setCards({ cards: cardsReceived }));
      }
    };
  }, []);

  return (
    <Router
      future={{
        v7_startTransition: true, // Ativa a flag para startTransition
        v7_relativeSplatPath: true, // Ativa a flag para relativeSplatPath
      }}
    >
      <ToastContainer position="top-center" theme="dark" />
      <ScrollToTop />

      {user.userData && user.userData.group !== "0" && <Header />}

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<PrivateRoute />}>
          <Route path="/token" element={<TokenPage />} />

          <Route element={<OnlyGroupPrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/address" element={<Direcciones />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/adminUsers" element={<AdminUsers />} />
          </Route>
        </Route>

        {/* Página 404 */}
        <Route path="*" element={<Login />} />
      </Routes>

      {user.userData && user.userData.group !== "0" && <NavButtons />}
    </Router>
  );
}

export default App;

import { ThemeProvider } from "./components/theme-provider";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Login from "./pages/Login";
import Home from "./pages/Home";
import MenuBottom from "./components/layout/MenuBottom";
import TokenPage from "./pages/TokenPage";
import PrivateRoute from "./components/private/PrivateRoute";
import { useSelector } from "react-redux";

import PublicOnlyRoute from "./components/private/PublicOnlyRoute";
import UserPage from "./pages/UserPage";
import { Toaster } from "./components/ui/sonner";
import { selectGroup } from "./store/selectors/userSelectors";
import Direcciones from "./pages/Direcciones";

function App() {
  const group = useSelector(selectGroup);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster
        position="top-center"
        toastOptions={{
          className: "text-lg",
        }}
      />
      <Router>
        {group && group !== "0" && <Header />}

        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/address" element={<Direcciones />} />
            <Route path="/token" element={<TokenPage />} />
            <Route path="/user" element={<UserPage />} />
          </Route>
        </Routes>

        {group && group !== "0" && (
          <>
            <MenuBottom />
            <Footer />
          </>
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;

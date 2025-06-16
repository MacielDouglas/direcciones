import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/layout/Header";
import { useSelector } from "react-redux";
import { selectGroup } from "./store/selectors/userSelectors";
import PublicOnlyRoute from "./components/private/PublicOnlyRoute";
import PrivateRoute from "./components/private/PrivateRoute";
import Footer from "./components/layout/Footer";
import UserPage from "./pages/UserPage";
import Addresses from "./pages/Addresses";

const App = () => {
  const group = useSelector(selectGroup);

  return (
    <ThemeProvider>
      <Router>
        {group && group !== "0" && <Header />}
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/addresses" element={<Addresses />} />
            {/* <Route path="/token" element={<TokenPage />} /> */}
            <Route path="/user" element={<UserPage />} />
          </Route>
        </Routes>
        {group && group !== "0" && <Footer />}
      </Router>
    </ThemeProvider>
  );
};

export default App;

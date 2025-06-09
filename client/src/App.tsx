import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PublicOnlyRoute from "./components/private/PublicOnlyRoute";
import PrivateRoute from "./components/private/PrivateRoute";
import Header from "./components/layout/Header";
import { useSelector } from "react-redux";
import { selectGroup } from "./store/selectors/userSelectors";
import Footer from "./components/layout/Footer";

const App = () => {
  const group = useSelector(selectGroup);
  return (
    <Router>
      {group && group !== "0" && <Header />}
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
      {group && group !== "0" && (
        <>
          <Footer />
        </>
      )}
    </Router>
  );
};

export default App;

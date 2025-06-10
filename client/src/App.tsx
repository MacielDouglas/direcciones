import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
<<<<<<< HEAD
import { ThemeProvider } from "./context/ThemeContext";
=======
import PublicOnlyRoute from "./components/private/PublicOnlyRoute";
import PrivateRoute from "./components/private/PrivateRoute";
import Header from "./components/layout/Header";
import { useSelector } from "react-redux";
import { selectGroup } from "./store/selectors/userSelectors";
import Footer from "./components/layout/Footer";
>>>>>>> 9e791c53fd2f35d01515d84226868c7d2d04ecaa

const App = () => {
  const group = useSelector(selectGroup);
  return (
<<<<<<< HEAD
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </ThemeProvider>
=======
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
>>>>>>> 9e791c53fd2f35d01515d84226868c7d2d04ecaa
  );
};

export default App;

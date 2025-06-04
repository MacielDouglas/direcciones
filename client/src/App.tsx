import { ThemeProvider } from "./components/theme-provider";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Login from "./pages/Login";
import Home from "./pages/Home";
import MenuBottom from "./components/layout/MenuBottom";
import TokenPage from "./pages/TokenPage";
import PrivateRoute from "./components/private/PrivateRoute";
// import MenuBottom from "./components/layout/MenuBottom";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <Header />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/token" element={<TokenPage />} />
            <Route path="/" element={<Home />} />
          </Route>
        </Routes>
        <MenuBottom />
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;

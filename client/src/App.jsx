import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import OnlyGroupPrivateRoute from "./components/private route/OnlyGroupPrivateRoute";
import Home from "./pages/Home";
import TokenPage from "./pages/TokenPage";
import PrivateRoute from "./components/private route/PrivateRoute";
import { useSelector } from "react-redux";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const user = useSelector((state) => state.user);
  return (
    <BrowserRouter>
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

// import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import Login from "./pages/Login";
// import Home from "./pages/Home";
// import TokenPage from "./pages/TokenPage";

// // import TokenPage from "./pages/TokenPage";

// function App() {
//   const user = useSelector((state) => state.user);

//   const isAuthenticated = user?.isAuthenticated;
//   const hasGroup = user?.userData?.group;

//   // Rota protegida: verifica se o usuário está autenticado
//   const ProtectedRoute = ({ children }) => {
//     return isAuthenticated ? children : <Navigate to="/login" />;
//   };

//   // Verificação de grupo: redireciona para TokenPage se não houver grupo
//   const GroupCheckRoute = ({ children }) => {
//     return hasGroup !== 0 ? children : <Navigate to="/token" />;
//   };

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/login" element={<Login />} />

//         {/* Página de token, acessada caso o usuário não tenha grupo */}
//         <Route
//           path="/token"
//           element={
//             <ProtectedRoute>
//               <TokenPage />
//             </ProtectedRoute>
//           }
//         />

//         {/* Página Home, acessada caso o usuário tenha um grupo */}
//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <GroupCheckRoute>
//                 <Home />
//               </GroupCheckRoute>
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { useSelector } from "react-redux";
// import Login from "./pages/Login";
// import Home from "./pages/Home";

// function App() {
//   const user = useSelector((state) => state.user);

//   console.log(user);

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/" element={<Home />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

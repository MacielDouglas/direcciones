import { motion } from "framer-motion";
import React, { lazy, Suspense } from "react";

const OAuth = lazy(() => import("../forms/OAuth"));

function Login() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  return (
    <div
      role="main"
      aria-label="Página de login"
      className="h-screen bg-cover bg-center flex flex-col justify-center items-center "
      style={{ backgroundImage: `url('./ciudad_2.svg')` }}
    >
      <div className="w-full h-full flex items-center justify-center bg-stone-950 bg-opacity-[40%]">
        <motion.div
          className="bg-white shadow-lg rounded-lg p-10 max-w-md h-[600px] w-full m-4 sm:m-0 flex flex-col justify-evenly"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 50 }}
          animate={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion ? {} : { duration: 0.8, ease: "easeOut" }
          }
        >
          <motion.h1
            className="text-3xl font-bold mb-6 text-gray-800"
            initial={prefersReducedMotion ? false : { opacity: 0, y: -20 }}
            animate={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
            transition={
              prefersReducedMotion ? {} : { delay: 0.2, duration: 0.6 }
            }
          >
            Bienvenido a{" "}
            <span className="text-bold text-orange-600 text-5xl">
              Direcciones
            </span>
          </motion.h1>
          <div className="flex justify-center mb-6">
            <img
              src="./direccioes_map.svg"
              className="w-40"
              alt="imagen de direcciones"
              onError={(e) => {
                e.target.src = "fallback-image.svg";
              }}
            />
          </div>

          <motion.p
            className="text-gray-600 mb-6 text-lg"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={prefersReducedMotion ? false : { opacity: 1 }}
            transition={
              prefersReducedMotion ? {} : { delay: 0.4, duration: 0.6 }
            }
          >
            Para comenzar, inicie sesión con su cuenta{" "}
            <span className="text-red-500 font-semibold">Google</span>.
          </motion.p>

          <Suspense fallback={<div>Carregando...</div>}>
            <OAuth />
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
}

export default React.memo(Login);

// import { motion } from "framer-motion";
// import OAuth from "../forms/OAuth";

// function Login() {
//   return (
//     <div
//       className="h-screen bg-cover bg-center flex flex-col justify-center items-center"
//       style={{ backgroundImage: `url('./ciudad_2.svg')` }}
//     >
//       <div className="w-full h-full flex items-center justify-center bg-stone-950 bg-opacity-[40%]  ">
//         <motion.div
//           className="bg-white shadow-lg rounded-lg p-10 max-w-md h-[600px]  w-full m-4 sm:m-0 flex flex-col justify-evenly "
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//         >
//           <motion.h1
//             className="text-3xl font-bold mb-6 text-gray-800"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2, duration: 0.6 }}
//           >
//             Bienvenido a{" "}
//             <span className="text-bold text-orange-600 text-5xl">
//               Direcciones
//             </span>
//           </motion.h1>
//           <div className="flex justify-center mb-6">
//             <img
//               src="./direccioes_map.svg"
//               className="w-40"
//               alt="imagen de direcciones"
//             />
//           </div>

//           <motion.p
//             className="text-gray-600 mb-6 text-lg"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.4, duration: 0.6 }}
//           >
//             Para comenzar, inicie sesión con su cuenta{" "}
//             <span className="text-red-500 font-semibold">Google</span>.
//           </motion.p>

//           <OAuth />
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// export default Login;

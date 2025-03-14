import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaRegUser,
  FaRegRectangleList,
  FaRegMap,
  FaUsers,
} from "react-icons/fa6";
import menuOptions from "../constants/menu";
import { useEffect } from "react";
import { setCards } from "../store/cardsSlice";

export default function Home() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const card = useSelector((state) => state.cards);
  const { name, isSS } = user?.userData || {};

  useEffect(() => {
    if (!card?.cardsData || !Array.isArray(card.cardsData)) return;

    const filtro = card.cardsData.filter(
      (ed) =>
        Array.isArray(ed?.usersAssigned) &&
        ed.usersAssigned.some((item) => item.userId === user?.userData?.id)
    );

    dispatch(setCards({ myCards: filtro })); // Alterado de myCardsData para myCards
  }, [dispatch, card?.cardsData, user?.userData?.id]);

  const iconsMap = {
    Tarjetas: FaRegRectangleList,
    Dirección: FaRegMap,
    Admin: FaUsers,
    Perfil: FaRegUser,
  };

  return (
    <motion.div
      className="w-full relative h-screen text-black pb-16 px-4 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="w-full max-w-3xl text-center mt-10"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-light tracking-wide mb-6">
          Bem-vindo, <span className="font-medium">{name || "Usuário"}</span>.
        </h1>
        <p className="text-lg text-gray-600">Escolha uma opção para começar:</p>
      </motion.div>

      <div className="flex flex-col w-full max-w-2xl mt-6 space-y-4">
        {Object.entries(menuOptions).map(([key, item], index) => {
          const IconComponent = iconsMap[item.label];

          return (
            <motion.div
              key={key}
              className="p-4 border border-gray-300 rounded-lg shadow-md bg-white"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{ scale: 1.02, opacity: 0.95 }}
            >
              <Link to={item.path} className="flex gap-4 items-center">
                {IconComponent && (
                  <IconComponent size={32} className="text-black" />
                )}
                <p className="font-medium text-xl tracking-widest">
                  {item.label}
                </p>
              </Link>
            </motion.div>
          );
        })}
        {isSS && (
          <motion.div
            className="p-4 border border-gray-300 rounded-lg shadow-md bg-white"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            whileHover={{ scale: 1.02, opacity: 0.95 }}
          >
            <Link to="/adminUsers" className="flex gap-4 items-center">
              <FaUsers size={32} className="text-black" />
              <p className="font-medium text-xl tracking-wide">Admin</p>
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// import { useSelector, useDispatch } from "react-redux";
// import { Link } from "react-router-dom";
// import { useLazyQuery } from "@apollo/client";
// import { motion } from "framer-motion";
// import {
//   FaRegUser,
//   FaRegRectangleList,
//   FaRegMap,
//   FaUsers,
// } from "react-icons/fa6";
// import menuOptions from "../constants/menu";
// import { ADDRESSES } from "../graphql/queries/address.query";
// import { setAddresses } from "../store/addressesSlice";

// export default function Home() {
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.user);
//   const cards = useSelector((state) => state.cards);
//   const addresses = useSelector((state) => state.addresses);

//   const { name, isSS, group } = user.userData;

//   // Mapeamento de ícones
//   const iconsMap = {
//     Tarjetas: FaRegRectangleList,
//     Dirección: FaRegMap,
//     Admin: FaUsers,
//     Perfil: FaRegUser,
//   };

//   // Lazy Query para obter endereços
//   const [fetchAddresses, { data, loading, error }] = useLazyQuery(ADDRESSES, {
//     onCompleted: (data) => {
//       if (data) {
//         dispatch(setAddresses({ addresses: data.address.address }));
//       }
//     },
//   });

//   return (
//     <div className="w-full min-h-screen text-black pb-32 px-6 flex flex-col items-center">
//       {/* Título de boas-vindas */}
//       <motion.div
//         className="w-full max-w-3xl text-center mt-10"
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.7, ease: "easeOut" }}
//       >
//         <h1 className="text-5xl font-light tracking-wide mb-8">
//           Bienvenido, <span className="font-medium">{name}</span>.
//         </h1>
//         <p className="text-lg text-gray-600">
//           Para comenzar, elija una de las siguientes opciones:
//         </p>
//       </motion.div>

//       {/* Botão para atualizar os dados manualmente */}
//       {/* {group !== 0 && (
//         <button
//           onClick={fetchAddresses}
//           className="mt-4 py-2 px-6 bg-blue-500 text-white font-medium rounded hover:bg-blue-600"
//         >
//           {loading ? "Atualizando..." : "Atualizar Endereços"}
//         </button>
//       )} */}

//       {/* Opções de Menu */}
//       <div className="flex flex-col w-full max-w-2xl mt-4">
//         {Object.entries(menuOptions).map(([key, item]) => {
//           const IconComponent = iconsMap[item.label];

//           return (
//             <motion.div
//               key={key}
//               className="p-6"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{
//                 duration: 0.4,
//                 delay: 0.1 * key,
//                 ease: "easeOut",
//               }}
//               whileHover={{ scale: 1.02, opacity: 0.95 }}
//             >
//               <Link
//                 to={item.path}
//                 className="flex gap-7 pt-10  h-full border-t border-details"
//               >
//                 {IconComponent && (
//                   <IconComponent
//                     size={38}
//                     color="black"
//                     className="flex-shrink-0"
//                   />
//                 )}
//                 <p className="font-medium text-4xl tracking-widest ">
//                   {item.label}
//                 </p>
//               </Link>
//             </motion.div>
//           );
//         })}
//         {isSS && (
//           <Link
//             to="/adminUsers"
//             className="flex gap-7 pt-10  h-full border-t border-details p-6"
//           >
//             <FaUsers size={38} color="black" className="flex-shrink-0" />
//             <p className="font-medium text-4xl tracking-widest ">Admin</p>
//           </Link>
//         )}
//       </div>

//       {/* Exibe erros se houver */}
//       {error && (
//         <p className="text-red-500 mt-4">
//           Ocorreu um erro ao atualizar os endereços.
//         </p>
//       )}
//     </div>
//   );
// }

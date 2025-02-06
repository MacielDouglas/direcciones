import { useQuery } from "@apollo/client";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_USERS } from "../../graphql/queries/user.query";
import SelectCardComponent from "../hooks/SelectCardComponent";
import { Dialog } from "@headlessui/react";

function AssignCard() {
  const dispatch = useDispatch();
  const cards = useSelector((state) => state.cards.cardsData.card || []);
  const addresses = useSelector((state) => state.addresses.addressesData || []);
  const user = useSelector((state) => state.user.userData);

  const [usersNotAssigned, setUsersNotAssigned] = useState([]);
  const [usersAssigned, setUsersAssigned] = useState([]);
  const [cardAssigned, setCardAssigned] = useState([]);
  const [cardNotAssigned, setCardNotAssigned] = useState([]);
  const [selectedCard, setSelectedCard] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { data: usersData } = useQuery(GET_USERS, {
    variables: { group: user?.group },
  });
  const users = useMemo(() => usersData?.getUsers?.users || [], [usersData]);

  useEffect(() => {
    setUsersNotAssigned(users.filter((user) => user.myCards.length === 0));
    setUsersAssigned(users.filter((user) => user.myCards.length > 0));
    setCardAssigned(cards.filter((card) => card.startDate !== null));
    setCardNotAssigned(cards.filter((card) => card.startDate === null));
  }, [users, cards]);

  const assignCardsToUser = () => {
    if (!selectedUser) return;

    console.log("Cartões atribuídos:", selectedCard);
    console.log("Usuário selecionado:", selectedUser);

    // Aqui você pode disparar uma ação Redux ou uma mutação GraphQL para salvar a atribuição

    setIsModalOpen(false);
    setSelectedCard([]);
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-details md:p-10 flex justify-center">
      <motion.div
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-medium text-gray-700 mb-6">
          Asignar Tarjetas
        </h1>

        <div>
          <p>
            Total de tarjetas:{" "}
            <span className="font-semibold">{cards.length}</span>.
          </p>
          <p>
            Tarjetas no asignadas:{" "}
            <span className="font-semibold">{cardNotAssigned.length}</span>.
          </p>
          <p>
            Total de usuários:{" "}
            <span className="font-semibold">{users.length}</span>.
          </p>
          <p>
            Usuários con tarjetas:{" "}
            <span className="font-semibold">{usersAssigned.length}</span>.
          </p>
        </div>

        <div className="flex flex-col md:flex-row my-3 w-full">
          <div className="border-t border-stone-50 flex flex-col gap-4 md:w-2/3 border-r md:overflow-y-auto max-h-full">
            <h3 className="text-xl font-semibold">
              Seleccione las tarjetas disponibles
            </h3>
            <p>Tarjetas selecionadas: {selectedCard.length}</p>
            <SelectCardComponent
              cardItem={cardNotAssigned}
              setSelectedCard={setSelectedCard}
              addresses={addresses}
              users={users}
            />
          </div>
          <div className="border-t border-t-stone-800 flex flex-col gap-4 md:w-2/3 md:overflow-y-auto max-h-full mt-5">
            <h3 className="text-xl font-semibold mt-3">
              Estas tarjetas están en uso
            </h3>
            <p>Tarjetas selecionadas: {selectedCard.length}</p>
            <SelectCardComponent
              cardItem={cardAssigned}
              setSelectedCard={setSelectedCard}
              addresses={addresses}
              users={users}
            />
          </div>
        </div>

        {/* Botão para abrir modal - ativado apenas se houver cartões selecionados */}
        <button
          className={`mt-4 px-4 py-2 rounded-lg text-white font-semibold transition ${
            selectedCard.length > 0
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={() => setIsModalOpen(true)}
          disabled={selectedCard.length === 0}
        >
          Abrir Modal de Atribuição
        </button>
      </motion.div>

      {/* MODAL */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <motion.div
          className="bg-white p-6 rounded-lg w-full max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <Dialog.Title className="text-xl font-semibold mb-4">
            Atribuir Tarjetas
          </Dialog.Title>

          <div className="mb-4">
            <p className="font-semibold">Usuários sem tarjetas:</p>
            <ul className="space-y-2">
              {usersNotAssigned.map((user) => (
                <li key={user.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="assignUser"
                    value={user.id}
                    checked={selectedUser === user.id}
                    onChange={() => setSelectedUser(user.id)}
                  />
                  {user.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <p className="font-semibold">Usuários com tarjetas:</p>
            <ul className="space-y-2">
              {usersAssigned.map((user) => (
                <li key={user.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="assignUser"
                    value={user.id}
                    checked={selectedUser === user.id}
                    onChange={() => setSelectedUser(user.id)}
                  />
                  {user.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between">
            <button
              className="px-4 py-2 bg-gray-400 text-white rounded-lg"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
                selectedUser
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={assignCardsToUser}
              disabled={!selectedUser}
            >
              Atribuir
            </button>
          </div>
        </motion.div>
      </Dialog>
    </div>
  );
}

export default AssignCard;

// import { useQuery } from "@apollo/client";
// import { motion } from "framer-motion";
// import { useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { GET_USERS } from "./../../graphql/queries/user.query";
// import SelectCardComponent from "../hooks/SelectCardComponent";

// function AssignCard() {
//   const dispatch = useDispatch();
//   const cards = useSelector((state) => state.cards.cardsData.card || []);
//   const addresses = useSelector((state) => state.addresses.addressesData || []);
//   const user = useSelector((state) => state.user.userData);
//   const [usersNotAssigned, setUsersNotAssigned] = useState([]);
//   const [usersAssigned, setUserAssigned] = useState([]);
//   const [cardAssigned, setCardAssigned] = useState([]);
//   const [cardNotAssigned, setCardNotAssigned] = useState([]);
//   const [selectedCard, setSelectedCard] = useState([]);

//   const { data: usersData } = useQuery(GET_USERS, {
//     variables: { group: user?.group },
//   });
//   const users = useMemo(() => usersData?.getUsers?.users || [], [usersData]);

//   useEffect(() => {
//     const notAssigned = users.filter((user) => user.myCards.length === 0);
//     setUsersNotAssigned(notAssigned);
//     const assigned = users.filter((user) => user.myCards.length > 0);
//     setUserAssigned(assigned);
//     const assignedCard = cards.filter((card) => card.startDate !== null);
//     setCardAssigned(assignedCard);
//     const notCardAssigned = cards.filter((card) => card.startDate === null);
//     setCardNotAssigned(notCardAssigned);
//   }, [users, cards]);

//   return (
//     <div className="min-h-screen bg-details md:p-10 flex justify-center">
//       <motion.div
//         className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl"
//         initial={{ opacity: 0, x: -50 }}
//         animate={{ opacity: 1, x: 0 }}
//         exit={{ opacity: 0, x: 50 }}
//         transition={{ duration: 0.3 }}
//       >
//         <h1 className="text-3xl font-medium text-gray-700 mb-6">
//           Asignar Tarjetas
//         </h1>

//         <div>
//           <p>
//             Total de tarjetas:{" "}
//             <span className="font-semibold">{cards.length}</span>.
//           </p>
//           <p>
//             Tarjetas no asignadas:{" "}
//             <span className="font-semibold">{cardNotAssigned.length}</span>.
//           </p>
//           <p>
//             Total de usuários:{" "}
//             <span className="font-semibold">{users.length}</span>.
//           </p>
//           <p>
//             Usuários con tarjetas:
//             <span className="font-semibold"> {usersAssigned.length}</span>.
//           </p>
//         </div>

//         <div className="flex flex-col md:flex-row my-3 w-full">
//           <div className="border-t border-stone-50 flex flex-col gap-4 md:w-2/3 border-r md:overflow-y-auto max-h-full">
//             <h3 className="text-xl font-semibold">
//               Seleccione las tarjetas disponibles
//             </h3>

//             <p>Tarjetas selecionadas: {selectedCard.length}</p>
//             <SelectCardComponent
//               cardItem={cardNotAssigned}
//               setSelectedCard={setSelectedCard}
//               addresses={addresses}
//               users={users}
//             />
//           </div>
//           <div className="border-t border-t-stone-800 flex flex-col gap-4 md:w-2/3 md:overflow-y-auto max-h-full mt-5">
//             <h3 className="text-xl font-semibold mt-3">
//               Estas tarjetas estan en uso
//             </h3>
//             <p>Tarjetas selecionadas: {selectedCard.length}</p>

//             <SelectCardComponent
//               cardItem={cardAssigned}
//               setSelectedCard={setSelectedCard}
//               addresses={addresses}
//               users={users}
//             />
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// export default AssignCard;

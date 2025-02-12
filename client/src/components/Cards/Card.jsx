import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../context/Loading";

function Card() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);

  const user = useSelector((state) => state.user);
  const myCards = user.userData.myCards;
  const cardsData = useSelector((state) => state.cards);
  const addressesData = useSelector((state) => state.addresses);

  console.log("usuario: ", user);
  console.log("cardsData: ", cardsData);
  console.log("Meus CArtões: ", myCards);
  console.log("addressesData: ", addressesData);

  if (!cardsData.length) return <Loading text="No hay tarjetas disponible." />;
  if (!myCards.length) return <Loading text="No hay tarjetas asignadas." />;

  return (
    <div>
      <h1>CARD</h1>
    </div>
  );
}

export default Card;

// import { useState, useMemo, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Address from "../Address";
// import Modal from "react-modal";
// import { RETURN_CARD } from "../../graphql/mutation/cards.mutation";
// import { toast } from "react-toastify";
// import { useMutation } from "@apollo/client";
// import { setUser } from "../../store/userSlice";
// import Loading from "../../context/Loading";

// Modal.setAppElement("#root");

// function Card() {
//   const dispatch = useDispatch();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedCardId, setSelectedCardId] = useState(null);

//   const user = useSelector((state) => state.user);
//   const cardsData = useSelector((state) => state.cards?.cardsData?.card || []);
//   const addressesData = useSelector(
//     (state) => state.addresses?.addressesData || []
//   );

//   console.log(!cardsData.length);

//   const myCards = useMemo(() => user?.userData?.myCards || [], [user]);

//   if (cardsData.length === 0) {
//     return <Loading text="No hay tarjetas disponible." />;
//   }

//   if (myCards.length === 0) {
//     return <Loading text="No hay tarjetas asignadas." />;
//   }

//   const cardDetails = useMemo(
//     () =>
//       cardsData.filter((card) =>
//         myCards.some((myCard) => myCard.cardId === card.id)
//       ),
//     [cardsData, myCards]
//   );

//   const getMatchedAddresses = useCallback(
//     (cardStreetIds) =>
//       addressesData.filter((address) => cardStreetIds.includes(address.id)),
//     [addressesData]
//   );

//   const [returnedCard] = useMutation(RETURN_CARD, {
//     onCompleted: () => {
//       toast.success("Tarjeta devuelta con éxito!");
//     },
//   });

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return `${String(date.getDate()).padStart(2, "0")}/${String(
//       date.getMonth() + 1
//     ).padStart(2, "0")}/${date.getFullYear()}`;
//   };

//   const handleOpenModal = useCallback((cardId) => {
//     setSelectedCardId(cardId);
//     setIsModalOpen(true);
//   }, []);

//   const handleCloseModal = useCallback(() => {
//     setIsModalOpen(false);
//     setSelectedCardId(null);
//   }, []);

//   const handleConcludeCard = useCallback(async () => {
//     try {
//       await returnedCard({
//         variables: {
//           action: "returnCard",
//           designateCardInput: {
//             cardId: selectedCardId,
//             userId: user.userData.id,
//           },
//         },
//       });

//       const updatedMyCards = myCards.filter(
//         (myCard) => myCard.cardId !== selectedCardId
//       );
//       dispatch(
//         setUser({ user: { ...user.userData, myCards: updatedMyCards } })
//       );
//       setIsModalOpen(false);
//     } catch (error) {
//       toast.error(error.message);
//     }
//   }, [returnedCard, selectedCardId, myCards, dispatch, user]);

//   return (
//     <div className="text-start text-lg w-full text-secondary h-full">
//       <div className="space-y-5 px-4 pt-3">
//         <h1 className="text-4xl font-medium">Tarjetas</h1>
//         <p>
//           Usted tiene <strong>{myCards.length}</strong> tarjetas asignadas.
//         </p>
//       </div>

//       <div className="h-full bg-details md:p-10 flex flex-col items-center justify-center mb-10">
//         {cardDetails.map((card) => {
//           const matchedAddresses = getMatchedAddresses(card.street);
//           return (
//             <div key={card.id} className="bg-white p-8 w-full max-w-3xl mb-6">
//               <h2 className="text-3xl font-medium text-gray-700">
//                 Tarjeta número: {card.number}
//               </h2>
//               <p>
//                 Esta tarjeta tiene <strong>{matchedAddresses.length}</strong>{" "}
//                 {matchedAddresses.length > 1 ? "direcciones" : "dirección"}
//               </p>
//               <p className="mb-4">
//                 Usted la recibió en:{" "}
//                 <strong>{formatDate(card.startDate)}</strong>
//               </p>
//               <button
//                 className="bg-gradient-to-b from-stone-800 to-secondary text-white px-4 py-2 rounded hover:from-black hover:to-secondary w-full"
//                 onClick={() => handleOpenModal(card.id)}
//               >
//                 Concluir esta tarjeta
//               </button>
//               {matchedAddresses.length > 0 ? (
//                 matchedAddresses.map((address) => (
//                   <Address key={address.id} id={address.id} />
//                 ))
//               ) : (
//                 <p>No hay direcciones asociadas a esta tarjeta.</p>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       <Modal
//         isOpen={isModalOpen}
//         onRequestClose={handleCloseModal}
//         className="bg-white rounded-lg shadow-lg max-w-md mx-auto p-6 text-center"
//         overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
//       >
//         <h2 className="text-xl font-medium mb-4">Confirmar acción</h2>
//         <p>¿Está seguro de que desea concluir esta tarjeta?</p>
//         <div className="mt-6 flex justify-between gap-4">
//           <button
//             className="bg-gray-300 px-4 py-2 rounded shadow hover:bg-gray-400 w-full"
//             onClick={handleCloseModal}
//           >
//             Cancelar
//           </button>
//           <button
//             className="bg-secondary text-white px-4 py-2 rounded shadow hover:bg-primary-dark w-full"
//             onClick={handleConcludeCard}
//           >
//             Concluir
//           </button>
//         </div>
//       </Modal>
//     </div>
//   );
// }

// export default Card;

// import { useState, useMemo, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Address from "../Address";
// import Modal from "react-modal";
// import { RETURN_CARD } from "../../graphql/mutation/cards.mutation";
// import { toast } from "react-toastify";
// import { useMutation } from "@apollo/client";
// import { setUser } from "../../store/userSlice";
// import Loading from "../../context/Loading";

// Modal.setAppElement("#root");

// function Card() {
//   const dispatch = useDispatch();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedCardId, setSelectedCardId] = useState(null);

//   const user = useSelector((state) => state.user);
//   const myCards = useMemo(() => user?.userData?.myCards || [], [user]);
//   const cardsData = useSelector((state) => state.cards?.cardsData?.card || []);
//   const addressesData = useSelector(
//     (state) => state.addresses?.addressesData || []
//   );

//   console.log(cardsData);
//   console.log(myCards);

//   // Memoizar a filtragem de cartões
//   const cardDetails = useMemo(
//     () =>
//       cardsData.filter((card) =>
//         myCards.some((myCard) => myCard.cardId === card.id)
//       ),
//     [cardsData, myCards]
//   );

//   // Função otimizada para obter endereços associados a cada cartão
//   const getMatchedAddresses = useCallback(
//     (cardStreetIds) =>
//       addressesData.filter((address) => cardStreetIds.includes(address.id)),
//     [addressesData]
//   );

//   const [returnedCard] = useMutation(RETURN_CARD, {
//     onCompleted: () => {
//       toast.success("Tarjeta devuelta con éxito!");
//     },
//   });

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return `${String(date.getDate()).padStart(2, "0")}/${String(
//       date.getMonth() + 1
//     ).padStart(2, "0")}/${date.getFullYear()}`;
//   };

//   const handleOpenModal = useCallback((cardId) => {
//     setSelectedCardId(cardId);
//     setIsModalOpen(true);
//   }, []);

//   const handleCloseModal = useCallback(() => {
//     setIsModalOpen(false);
//     setSelectedCardId(null);
//   }, []);

//   const handleConcludeCard = useCallback(async () => {
//     try {
//       await returnedCard({
//         variables: {
//           action: "returnCard",
//           designateCardInput: {
//             cardId: selectedCardId,
//             userId: user.userData.id,
//           },
//         },
//       });

//       const updatedMyCards = myCards.filter(
//         (myCard) => myCard.cardId !== selectedCardId
//       );
//       dispatch(
//         setUser({ user: { ...user.userData, myCards: updatedMyCards } })
//       );
//       setIsModalOpen(false);
//     } catch (error) {
//       toast.error(error.message);
//     }
//   }, [returnedCard, selectedCardId, myCards, dispatch, user]);

//   return (
//     <div
//       className={`text-start text-lg w-full text-secondary h-full ${
//         myCards.length === 0 ? "p-5" : ""
//       }`}
//     >
//       <div className="space-y-5 px-4 pt-3">
//         <h1 className="text-4xl font-medium">Tarjetas</h1>
//         {myCards.length === 0 ? (
//           <p>Actualmente no tienes tartejas asignadas.</p>
//         ) : (
//           <p>
//             Usted tiene <strong>{myCards.length}</strong> tarjetas asignadas.
//           </p>
//         )}
//       </div>

//       <div className="h-full bg-details md:p-10 flex flex-col items-center justify-center mb-10">
//         {cardDetails.map((card) => {
//           const matchedAddresses = getMatchedAddresses(card.street);
//           return (
//             <div key={card.id} className="bg-white p-8 w-full max-w-3xl mb-6">
//               <h2 className="text-3xl font-medium text-gray-700">
//                 Tarjeta número: {card.number}
//               </h2>
//               <p>
//                 Esta tarjeta tiene <strong>{matchedAddresses.length}</strong>{" "}
//                 {matchedAddresses.length > 1 ? "direcciones" : "dirección"}
//               </p>
//               <p className="mb-4">
//                 Usted la recibió en:{" "}
//                 <strong>{formatDate(card.startDate)}</strong>
//               </p>
//               <button
//                 className="bg-gradient-to-b from-stone-800 to-secondary text-white px-4 py-2 rounded hover:from-black hover:to-secondary w-full"
//                 onClick={() => handleOpenModal(card.id)}
//               >
//                 Concluir esta tarjeta
//               </button>
//               {matchedAddresses.length > 0 ? (
//                 matchedAddresses.map((address) => (
//                   <Address key={address.id} id={address.id} />
//                 ))
//               ) : (
//                 <p>No hay direcciones asociadas a esta tarjeta.</p>
//               )}
//             </div>
//           );
//         })}
//         {cardDetails.length === 0 && (
//           <Loading text="No hay tarjetas asignadas." />
//         )}
//       </div>

//       <Modal
//         isOpen={isModalOpen}
//         onRequestClose={handleCloseModal}
//         className="bg-white rounded-lg shadow-lg max-w-md mx-auto p-6 text-center"
//         overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
//       >
//         <h2 className="text-xl font-medium mb-4">Confirmar acción</h2>
//         <p>¿Está seguro de que desea concluir esta tarjeta?</p>
//         <div className="mt-6 flex justify-between gap-4">
//           <button
//             className="bg-gray-300 px-4 py-2 rounded shadow hover:bg-gray-400 w-full"
//             onClick={handleCloseModal}
//           >
//             Cancelar
//           </button>
//           <button
//             className="bg-secondary text-white px-4 py-2 rounded shadow hover:bg-primary-dark w-full"
//             onClick={handleConcludeCard}
//           >
//             Concluir
//           </button>
//         </div>
//       </Modal>
//     </div>
//   );
// }

// export default Card;

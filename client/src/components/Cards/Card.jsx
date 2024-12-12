import { useSelector } from "react-redux";
import Address from "../Address";

function Card() {
  const user = useSelector((state) => state.user);
  const myCards = user?.userData?.myCards || [];
  const cardsData = useSelector((state) => state.cards?.cardsData?.card || []);
  const addressesData =
    useSelector((state) => state.addresses?.addressesData) || [];

  const formatDate = (dateString) => {
    const date = new Date(dateString); // Converte a string para um objeto Date

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Os meses começam do zero
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const cardDetails = cardsData.filter((card) =>
    myCards.some((myCard) => myCard.cardId === card.id)
  );

  const getMatchedAddresses = (cardStreetIds) => {
    return addressesData.filter((address) =>
      cardStreetIds.includes(address.id)
    );
  };

  return (
    <div className="text-start text-lg w-full text-secondary">
      <div className="space-y-5 px-4 pt-3">
        <h1 className="text-4xl font-medium">Tarjetas</h1>
        {myCards.length === 0 ? (
          <p>Actualmente no tienes tartejas asignadas.</p>
        ) : (
          <p>Usted tiene {myCards.length} tarjetas asignadas.</p>
        )}
      </div>

      <div className="h-full bg-details p-4 md:p-10 flex flex-col items-center justify-center mb-10">
        {cardDetails.map((card) => {
          const matchedAddresses = getMatchedAddresses(card.street);

          return (
            <div
              key={card.id}
              className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl mb-6"
            >
              <h2 className="text-3xl font-medium text-gray-700 mb-3">
                Tarjeta número: {card.number}
              </h2>
              <p className="">
                Usted la recibió en:{" "}
                <strong>{formatDate(card.startDate)}</strong>
              </p>
              {/* <div className=""> */}
              {matchedAddresses.length > 0 ? (
                matchedAddresses.map((address) => (
                  <div key={address.id} className="bg-details -mx-6 m-3">
                    <Address id={address.id} />
                    {/* <div>
                        <p>{address.type}</p>
                        <p>
                          <strong>Calle:</strong> {address.street},{" "}
                          {address.number}
                        </p>

                        <p>
                          <strong>Ciudad:</strong> {address.city}
                        </p>
                        <p>
                          <strong>Informaciones:</strong> {address.complement}
                        </p>
                      </div>
                      <div className="text-center">
                        <p>ver dirección</p>
                      </div> */}
                  </div>
                ))
              ) : (
                <p>No hay direcciones asociadas a esta tarjeta.</p>
              )}
            </div>
            // </div>
          );
        })}
      </div>
    </div>
  );
}

export default Card;

// import { useSelector } from "react-redux";

// function Card() {
//   const user = useSelector((state) => state.user);
//   const myCards = user?.userData?.myCards || [];
//   const cardsData = useSelector((state) => state.cards?.cardsData?.card || {});
//   const addressesData =
//     useSelector((state) => state.addresses?.addressesData) || {};

//   console.log("Usuário: ", user);
//   console.log("My Cards: ", myCards.carId);
//   console.log("CARDS DATA:: ", cardsData);
//   console.log("ADresses Data: ", addressesData);

//   const cardDetails = cardsData.filter((card) =>
//     myCards.some((myCard) => myCard.cardId === card.id)
//   );

//   console.log(cardDetails);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = String(date.getUTCDate()).padStart(2, "0"); // Dia com dois dígitos
//     const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Mês com dois dígitos (0-based)
//     const year = date.getUTCFullYear(); // Ano completo
//     return `${day}/${month}/${year}`;
//   };

//   return (
//     <div className="text-start text-lg w-full text-secondary">
//       <div className="space-y-5 px-4 pt-3">
//         <h1 className="text-4xl font-medium">Tarjetas</h1>
//         {!myCards && <p>Actualmente no tienes tartejas asignadas.</p>}
//         {myCards && <p>Usted tiene {myCards.length} tarjetas asignadas.</p>}
//       </div>

//       <div className="h-full bg-details p-4 md:p-10 flex flex-col items-center justify-center mb-10">
//         {cardDetails.map((card) => (
//           <div
//             key={card.id}
//             className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl"
//           >
//             <h2 className="text-3xl font-medium text-gray-700 mb-6">
//               Tarjeta numero: {card.number}
//             </h2>
//             <p>Usted la recibio en {formatDate(card.startDate)}</p>
//             {addressesData
//               .filter((address) =>
//                 card.street.some((item) => item.id === address.street)
//               )
//               .map((item) => (
//                 <p>{item.street}</p>
//               ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Card;

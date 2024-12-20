import { useSelector } from "react-redux";
import Address from "../Address";

function Card() {
  const user = useSelector((state) => state.user);
  const myCards = user?.userData?.myCards || [];
  const cardsData = useSelector((state) => state.cards?.cardsData?.card || []);

  const addressesData =
    useSelector((state) => state.addresses?.addressesData) || [];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Filtrar detalhes das cartas que pertencem ao usuário
  const cardDetails = cardsData.filter((card) =>
    myCards.some((myCard) => myCard.cardId === card.id)
  );

  // Obter endereços associados às cartas
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
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-3xl font-medium text-gray-700">
                  Tarjeta número: {card.number}
                </h2>
                {/* <p>{matchedAddresses.length}</p> */}
                {/* <button
                  className="bg-secondary text-white px-4 py-2 rounded shadow-md hover:bg-primary-dark"
                  onClick={() => console.log(`Concluir tarjeta ${card.id}`)}
                >
                  Concluir Tarjeta
                </button> */}
              </div>
              <p className="text-">
                Esta tarjeta tiene <strong>{matchedAddresses.length}</strong>{" "}
                {matchedAddresses.length > 1 ? "direcciones" : "dirección"}
              </p>
              <p className="mb-4">
                Usted la recibió en:{" "}
                <strong>{formatDate(card.startDate)}</strong>
              </p>

              {matchedAddresses.length > 0 ? (
                matchedAddresses.map((address) => (
                  <div key={address.id} className="bg-details -mx-6 m-3">
                    <Address id={address.id} />
                  </div>
                ))
              ) : (
                <p>No hay direcciones asociadas a esta tarjeta.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Card;

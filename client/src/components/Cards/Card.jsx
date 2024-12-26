import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Address from "../Address";
import Modal from "react-modal";
import { RETURN_CARD } from "../../graphql/mutation/cards.mutation";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client";
import { setUser } from "../../store/userSlice";
import Loading from "../../context/Loading";

Modal.setAppElement("#root"); // Garante acessibilidade para leitores de tela

function Card() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);

  const user = useSelector((state) => state.user);
  const myCards = user?.userData?.myCards || [];
  const cardsData = useSelector((state) => state.cards?.cardsData?.card || []);
  const addressesData =
    useSelector((state) => state.addresses?.addressesData) || [];

  const [returnedCard] = useMutation(RETURN_CARD, {
    onCompleted: () => {
      toast.success("Tarjeta devuelta con éxito!");
    },
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
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

  const handleOpenModal = (cardId) => {
    setSelectedCardId(cardId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCardId(null);
  };

  const handleConcludeCard = async () => {
    try {
      await returnedCard({
        variables: {
          action: "returnCard",
          designateCardInput: {
            cardId: selectedCardId,
            userId: user.userData.id,
          },
        },
      });

      // Atualizar os cartões do usuário removendo o cartão concluído
      const updatedMyCards = myCards.filter(
        (myCard) => myCard.cardId !== selectedCardId
      );

      dispatch(
        setUser({ user: { ...user.userData, myCards: updatedMyCards } })
      );
      console.log(`Tarjeta ${selectedCardId} concluida`);
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message);
      throw new Error(`No fue posible concluir esta tarteja: ${error.message}`);
    }
  };

  return (
    <div className="text-start text-lg w-full text-secondary h-full bg-details">
      <div className="space-y-5 px-4 pt-3">
        <h1 className="text-4xl font-medium ">Tarjetas</h1>
        {myCards.length === 0 ? (
          <p>Actualmente no tienes tartejas asignadas.</p>
        ) : (
          <p>
            Usted tiene <strong>{myCards.length}</strong> tarjetas asignadas.
          </p>
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
              </div>
              <p className="text-">
                Esta tarjeta tiene <strong>{matchedAddresses.length}</strong>{" "}
                {matchedAddresses.length > 1 ? "direcciones" : "dirección"}
              </p>
              <p className="mb-4">
                Usted la recibió en:{" "}
                <strong>{formatDate(card.startDate)}</strong>
              </p>
              <button
                className="bg-secondary text-white px-4 py-2 rounded shadow-md hover:bg-primary-dark w-full"
                onClick={() => handleOpenModal(card.id)}
              >
                Concluir esta tarjeta
              </button>

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
        {cardDetails.length === 0 && (
          <div className="h-full">
            <Loading text="No hay tarjetas para mostrar." />
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Concluir Tarjeta"
        className="bg-white rounded-lg shadow-lg max-w-md mx-auto p-6 text-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-medium mb-4">Confirmar acción</h2>
        <p>¿Está seguro de que desea concluir esta tarjeta?</p>
        <div className="mt-6 flex justify-between gap-4 ">
          <button
            className="bg-gray-300 px-4 py-2 rounded shadow hover:bg-gray-400 w-full"
            onClick={handleCloseModal}
          >
            Cancelar
          </button>
          <button
            className="bg-secondary text-white px-4 py-2 rounded shadow hover:bg-primary-dark w-full"
            onClick={handleConcludeCard}
          >
            Concluir
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Card;

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  FaCalendarDays,
  FaTableList,
  FaLocationDot,
  FaRoute,
} from "react-icons/fa6";
import {
  MdHouse,
  MdRestaurant,
  MdHotel,
  MdOutlineStorefront,
  MdOutlineApartment,
} from "react-icons/md";
import Loading from "../../context/Loading";
import { calculateDistance, formatDate } from "../../constants/direccion";
import Address from "../Address";
import { RiCloseLargeFill } from "react-icons/ri";
import ScrollToTop from "../../context/ScrollTotop";
import { useCardReturn } from "../../graphql/hooks/useCard";

function Card() {
  const user = useSelector((state) => state.user);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const cardsData = useSelector((state) => state.cards) || [];
  const myCards = cardsData?.myCardsData || [];
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectCard, setSelectCard] = useState({
    cardId: null,
    cardNumber: null,
  });

  const { returnedCardInput } = useCardReturn();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Erro ao obter a localização do usuário:", error);
        }
      );
    }
  }, []);

  if (!cardsData.cardsData)
    return <Loading text="No hay tarjetas disponible." />;
  if (myCards.length <= 0) return <Loading text="No hay tarjetas asignadas." />;

  const filteredCards = myCards;

  const handleReturnCard = async (cardIdReturn) => {
    await returnedCardInput({
      variables: {
        returnCardInput: {
          cardId: cardIdReturn,
          userId: user.userData.id,
        },
      },
    });
    setModalOpen(false);
  };

  return (
    <div className="text-start text-lg w-full text-secondary h-full mb-24">
      <ScrollToTop />
      <div className="space-y-5 px-4 pt-3">
        <h1 className="text-4xl font-medium">Tarjetas</h1>
        <p>
          Usted tiene <strong>{filteredCards.length}</strong>{" "}
          {filteredCards.length > 1 ? "tarjetas asignadas" : "tarjeta asignada"}
          .
        </p>
      </div>
      {filteredCards.map((card) => (
        <div
          key={card.id}
          className="bg-gradient-to-b from-details to-stone-400 rounded-md mx-2 mb-4 border border-stone-400"
        >
          <div className="flex flex-col gap-4 p-6 w-full">
            <div className="flex items-center justify-between flex-wrap">
              <h2 className="text-lg font-semibold flex items-center gap-3">
                <FaTableList /> Tarjeta: {card.number}
              </h2>
              <p className="text-sm text-stone-500 flex items-center gap-1">
                <FaCalendarDays /> asignada en: {formatDate(card.startDate)}
              </p>
            </div>
            <div className="flex items-center justify-between w-full flex-wrap">
              <button
                className="px-2 py-1 bg-secondary text-white rounded text-sm"
                onClick={() => {
                  setModalOpen(true),
                    setSelectCard({ cardId: card.id, cardNumber: card.number });
                }}
                // onClick={() => handleReturnCard(card.id)}
              >
                concluir tarjeta
              </button>
              <h3 className="text-lg flex items-center gap-3 justify-end  text-stone-700">
                <FaLocationDot /> Direcciones: {card.street.length}
              </h3>
            </div>
          </div>
          {card.street.length > 0 ? (
            <ul className="space-y-4 p-2">
              {card.street.map((address, index) => {
                const [latitude, longitude] = address.gps
                  .split(",")
                  .map(parseFloat);
                const distance =
                  userLocation && latitude && longitude
                    ? calculateDistance(
                        userLocation.latitude,
                        userLocation.longitude,
                        latitude,
                        longitude
                      ).toFixed(0)
                    : "N/A";

                return (
                  <li
                    key={address.id}
                    className={`border p-5 border-gray-300 flex justify-center flex-col bg-gradient-to-b rounded-lg shadow-md ${
                      !address.confirmed
                        ? "from-red-100 to-red-200"
                        : "from-white to-gray-200"
                    }`}
                  >
                    <button
                      onClick={() => setSelectedAddress(address.id)}
                      className="flex flex-col w-full text-left"
                    >
                      <div className="flex items-center justify-between w-full ">
                        <p className="text-4xl">
                          {(address.type === "house" && <MdHouse />) ||
                            (address.type === "department" && (
                              <MdOutlineApartment />
                            )) ||
                            (address.type === "store" && (
                              <MdOutlineStorefront />
                            )) ||
                            (address.type === "restaurant" && (
                              <MdRestaurant />
                            )) ||
                            (address.type === "hotel" && <MdHotel />)}
                        </p>
                        <p className="text-sm text-stone-500 flex items-center gap-1">
                          <FaLocationDot /> direccion: {index + 1}
                        </p>
                      </div>
                      <div className="mt-5 w-full">
                        <div className="w-full justify-between flex gap-5  ">
                          <div>
                            <p className="text-gray-800 font-semibold text-lg ">
                              {address.street}, {address.number}.
                            </p>
                            <p className="text-gray-500 text-sm">
                              {address.city}, {address.neighborhood},
                            </p>
                            {address.complement && (
                              <p className="text-sm -mx-2 rounded-md bg-primary p-2 mt-2">
                                {address.complement}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col justify-center gap-3 items-center text-3xl">
                            <FaRoute />
                            <p className="col-span-1 justify-self-end text-sm w-full">
                              {distance >= 1000
                                ? `${(distance / 1000).toFixed(2)}km`
                                : `${distance}m`}
                            </p>
                          </div>
                        </div>
                        {!address.confirmed && (
                          <p className="text-center font-bold text-orange-600 text-sm mt-2">
                            necesita confirmar
                          </p>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No hay direcciones asociadas.</p>
          )}
        </div>
      ))}

      {selectedAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center w-full h-full p-4 sm:p-6">
          <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full p-2 sm:p-8">
            {/* Botão de fechar centralizado no topo */}
            <button
              onClick={() => setSelectedAddress(null)}
              className="absolute top-3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-secondary text-2xl text-slate-300 p-2 rounded-full border border-red-800"
            >
              <RiCloseLargeFill />
            </button>
            <div className="max-h-[80vh] overflow-auto">
              <Address id={selectedAddress} />
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg min-w-80">
            <h2 className="text-xl font-bold mb-4">
              ¿Estás seguro de que deseas devolver la tarjeta:{" "}
              {selectCard.cardNumber}?
            </h2>

            <div className="mt-6 flex justify-end gap-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => handleReturnCard(selectCard.cardId)}
              >
                Devolver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;

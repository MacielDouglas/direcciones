import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  Bed,
  CalendarDays,
  Dock,
  Home,
  Hotel,
  Store,
  Utensils,
  X,
} from "lucide-react";
import { selectUserId } from "../store/selectors/userSelectors";
import { selectAllMyCard } from "../store/selectors/myCardSelectos";
import { useFetchMyCards, useReturnCard } from "../graphql/hooks/useCards";
import { formatDate } from "../constants/address";
import MapSection from "./Address/components/MapSection";
import PhotoAddress from "./Address/components/PhotoAddress";
import ButtonEditAddress from "./Address/components/buttons/ButtonEditAddress";
import DisableAddressButton from "./Address/components/buttons/DisableAddressButton";
import { removeMyCard } from "../store/myCardsSlice";
import type { AddressData } from "../types/address.types";
import ModalAddress from "./Address/ui/ModalAddress";

const addressIcons = {
  house: <Home size={24} />,
  department: <Hotel size={24} />,
  store: <Store size={24} />,
  hotel: <Bed size={24} />,
  restaurant: <Utensils size={24} />,
} as const;

type Location = {
  lat: number;
  lng: number;
};

const MyCards = () => {
  const userId = useSelector(selectUserId);
  const myCards = useSelector(selectAllMyCard);
  const { fetchMyCards, loading } = useFetchMyCards();
  const { returnCardMutation } = useReturnCard();

  const [selectedAddress, setSelectedAddress] = useState<AddressData | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectCard, setSelectCard] = useState<{
    cardId: string | null;
    cardNumber: number;
  }>({ cardId: userId, cardNumber: 0 });
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isReturnCard, setIsReturnCard] = useState(false);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      (err) => console.error("Erro ao obter localização do usuário:", err)
    );
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    if (userId) fetchMyCards({ variables: { myCardsId: userId } });
  }, [userId, fetchMyCards]);

  const handleReturnCard = async () => {
    await returnCardMutation({
      variables: {
        returnCardInput: { cardId: selectCard.cardId, userId: userId },
      },
    });
    if (selectCard.cardId) {
      dispatch(removeMyCard(selectCard.cardId));
    }
    // await fetchMyCards({ variables: { myCardsId: userId } });
    setIsModalOpen(false);
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <section className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-6 shadow max-w-2xl mx-auto">
        <h1 className="text-4xl font-semibold">Tarjetas</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-lg">
          En esta página puedes ver tus tarjetas asignadas.
        </p>
      </section>

      {loading ? (
        <p className="text-center text-zinc-500 text-lg">Cargando...</p>
      ) : myCards.length === 0 ? (
        <section className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-2xl shadow text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold">Sem cartões atribuídos</h2>
          <DotLottieReact
            src="https://lottie.host/0d984c5c-1e60-4e76-ac35-809c50de63bc/K7IH6AzhPu.lottie"
            loop
            autoplay
          />
        </section>
      ) : (
        <>
          <MapSection showUserCards={true} />

          <div className="space-y-6 max-w-2xl mx-auto">
            {myCards.map((card) => (
              <div
                key={card.id}
                className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl shadow p-4"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Dock /> Tarjeta: {card.number}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                    <CalendarDays /> Asignada en:{" "}
                    <strong>{formatDate(card.startDate ?? "")}</strong>
                  </p>
                  <button
                    className="bg-zinc-800 dark:bg-zinc-900 rounded-xl p-2 text-zinc-100 w-3/5 sm:w-auto hover:bg-zinc-800 transition"
                    onClick={() => {
                      setIsModalOpen(true);
                      setSelectCard({
                        cardId: card.id,
                        cardNumber: card.number,
                      });
                      setIsReturnCard(true);
                    }}
                  >
                    concluir tarjeta
                  </button>
                </div>

                <div className="space-y-4">
                  {card.street.map((address, i) => (
                    <button
                      key={address.id}
                      className={`w-full text-left bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 p-4 rounded-xl transition ${
                        !address.active && "!bg-orange-950 text-primary-lgt"
                      }`}
                      onClick={() =>
                        setSelectedAddress({
                          ...address,
                          photo: address.photo ?? "",
                        })
                      }
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span>{addressIcons[address.type]}</span>
                        <span className="text-sm font-medium">
                          Dirección {i + 1}
                        </span>
                      </div>
                      <p className="font-medium text-base">
                        {address.street}, {address.number}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {address.neighborhood} - {address.city}
                      </p>
                      {address.complement && (
                        <div className="mt-2 text-zinc-400 italic text-sm">
                          {address.complement}
                        </div>
                      )}
                      <p className="mt-2 text-center text-sm font-medium">
                        {address.confirmed ? (
                          <span className="text-blue-500">Confirmado</span>
                        ) : (
                          <span className="text-rose-500">
                            Necesita Confirmar
                          </span>
                        )}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedAddress && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div
            className={`bg-white dark:bg-zinc-900 rounded-2xl p-6 w-[90%] max-w-md shadow-xl relative ${
              !selectedAddress.active ? "!bg-orange-950 text-primary-lgt" : ""
            }`}
          >
            <button
              className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-800 dark:hover:text-white"
              onClick={() => setSelectedAddress(null)}
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              Detalle de la dirección
            </h2>
            {/* showUserCards={false} multipleAddressIds={mapIds} */}
            <div className="rounded-2xl overflow-hidden space-y-2">
              <MapSection
                showUserCards={false}
                singleAddressId={selectedAddress.id}
              />

              <div className="flex items-center justify-between mt-4">
                <PhotoAddress
                  hei="h-20"
                  wid="w-20"
                  photo={selectedAddress.photo}
                  street={selectedAddress.street}
                />
                <button
                  onClick={() => [setIsModalOpen(true), setIsReturnCard(false)]}
                  className="bg-blue-600 text-white py-3 rounded-md text-sm shadow-md mt-2 w-3/5"
                >
                  Ver en el mapa
                </button>
              </div>
            </div>

            {selectedAddress.customName && (
              <p className="text-lg font-medium">
                {selectedAddress.customName}
              </p>
            )}
            <p className="text-base font-medium">
              {selectedAddress.street}, {selectedAddress.number}
            </p>
            <p className="text-sm text-zinc-500 mb-2">
              {selectedAddress.neighborhood} - {selectedAddress.city}
            </p>
            {selectedAddress.complement && (
              <div className="text-sm italic text-zinc-500">
                {selectedAddress.complement}
              </div>
            )}
            <p className="mt-4 text-lg text-center font-medium">
              {selectedAddress.confirmed ? (
                <span className="text-blue-500">Confirmado</span>
              ) : (
                <span className="text-rose-500">Necesita Confirmar</span>
              )}
            </p>
            <div className="w-full flex justify-between gap-4 mt-5">
              <ButtonEditAddress id={selectedAddress.id} />
              <DisableAddressButton id={selectedAddress.id} myCard={true} />
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <ModalAddress
          setIsModalOpen={setIsModalOpen}
          address={selectedAddress!}
          isDeleteOpen={false}
          userLocation={userLocation}
          isReturnCard={isReturnCard}
          handleReturnCard={handleReturnCard}
          handleDelete={() => {}}
          setIsDeleteOpen={() => {}}
        />
      )}
    </div>
  );
};

export default MyCards;

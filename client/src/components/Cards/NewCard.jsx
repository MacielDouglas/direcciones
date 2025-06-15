import { useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import Loading from "../../context/Loading";
import {
  MdHouse,
  MdRestaurant,
  MdHotel,
  MdOutlineStorefront,
  MdOutlineApartment,
} from "react-icons/md";
import { useFetchCards, useNewCard } from "../../graphql/hooks/useCard";
import ComponentMaps from "../hooks/ComponentMaps";
import ImageWithModal from "../hooks/ImageWithModal";
import { setCards } from "../../store/cardsSlice";

function NewCard() {
  const addresses = useSelector((state) => state.addresses.addressesData);
  const cards = useSelector((state) => state.cards.cardsData || []);
  const [selectedAddresses, setSelectedAddresses] = useState([]);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { fetchCards } = useFetchCards();

  const { newCard } = useNewCard();

  const filteredAddresses = useMemo(
    () =>
      addresses.filter(
        (address) =>
          !cards.some((card) =>
            card.street.some((street) => street.id === address.id)
          )
      ),
    [addresses, cards]
  );

  const displayedAddresses = useMemo(
    () =>
      showSelectedOnly
        ? filteredAddresses.filter((address) =>
            selectedAddresses.includes(address.id)
          )
        : filteredAddresses,
    [showSelectedOnly, filteredAddresses, selectedAddresses]
  );

  const handleCreateCard = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        await newCard({
          variables: {
            action: "create",
            newCard: {
              street: selectedAddresses,
            },
          },
        });

        await fetchCards();
        const promises = [fetchCards()];

        const [cardsData] = await Promise.all(promises);
        dispatch(setCards({ cards: cardsData.data.card }));
      } catch (error) {
        console.error("Error al crear una nueva tarjeta: ", error.message);
        setTimeout(() => setLoading(false), 2000);
      }
    },
    [newCard, selectedAddresses]
  );

  const toggleSelectAddress = useCallback((addressId) => {
    setSelectedAddresses((prevSelected) =>
      prevSelected.includes(addressId)
        ? prevSelected.filter((id) => id !== addressId)
        : [...prevSelected, addressId]
    );
  }, []);

  const typeIcons = useMemo(
    () => ({
      house: <MdHouse />,
      department: <MdOutlineApartment />,
      store: <MdOutlineStorefront />,
      restaurant: <MdRestaurant />,
      hotel: <MdHotel />,
    }),
    []
  );

  if (!addresses) {
    return (
      <div className="p-8">
        <Loading text="No tenemos direcciones para crear una tarjetar..." />
      </div>
    );
  }

  if (loading) {
    return <Loading text="Creando una nueva tarjeta..." />;
  }

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
          Crear Tarjetas
        </h1>

        <div>
          <p>
            Actualmente hay{" "}
            <span className="font-semibold">{addresses.length}</span>{" "}
            direcciones en total.
          </p>
          <p>
            <span className="font-semibold">{filteredAddresses?.length}</span>{" "}
            direcciones disponibles.
          </p>
          <p>
            <span className="font-semibold">{cards.length}</span> tarjetas
            creadas.
          </p>
        </div>

        <div className="flex flex-col md:flex-row my-3 w-full bg-white">
          <div className="border-t border-stone-50 flex flex-col gap-4 md:w-2/3 border-r md:overflow-y-auto max-h-full">
            <h3 className="text-xl font-semibold">
              Seleccione las direcciones disponibles
            </h3>
            <p className="text-sm">
              Puedes seleccionar direcciones desde esta lista o directamente en
              el mapa.
            </p>
            <div className="overflow-y-auto border p-4 rounded max-h-[30vh] bg-primary">
              {filteredAddresses.length ? (
                filteredAddresses.map((address) => (
                  <div
                    key={address.id}
                    className="flex items-center text-sm lg:text-lg justify-between border-b py-2"
                  >
                    <div className="w-full flex items-center gap-3">
                      <ImageWithModal
                        photo={address.photo}
                        street={address.street}
                        wid="w-24"
                        hei="h-20"
                      />
                      <div>
                        <span className="text-lg">
                          {typeIcons[address.type]}
                        </span>
                        <p>
                          <strong>{address.street}</strong>, {address.number}
                        </p>
                        <p>
                          {address.neighborhood}, {address.city}
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedAddresses.includes(address.id)}
                      onChange={() => toggleSelectAddress(address.id)}
                      className="w-5 h-5"
                    />
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No hay direcciones disponibles.</p>
              )}
            </div>
            <button
              onClick={() => setShowSelectedOnly(!showSelectedOnly)}
              className="px-6 py-2 border border-secondary text-sm lg:text-lg hover:bg-secondary hover:text-primary transition-colors"
            >
              {showSelectedOnly ? "Mostrar todos" : "Mostrar seleccionados"}
            </button>
            <button
              onClick={handleCreateCard}
              className="mb-5 px-6 py-2 border border-secondary hover:bg-secondary hover:text-primary transition-colors text-sm lg:text-lg disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-primary"
              disabled={selectedAddresses.length === 0}
            >
              Crear tarjeta
            </button>
          </div>
          <ComponentMaps
            mode="addresses"
            addresses={displayedAddresses}
            selectedAddresses={selectedAddresses}
            setSelectedAddresses={setSelectedAddresses}
          />
        </div>
      </motion.div>
    </div>
  );
}

export default NewCard;

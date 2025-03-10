import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import PropTypes from "prop-types";
import { useCallback, useMemo } from "react";
import {
  FaAngleDown,
  FaAngleUp,
  FaUser,
  FaCalendarDays,
  FaTableList,
  FaLocationDot,
} from "react-icons/fa6";
import {
  MdHouse,
  MdRestaurant,
  MdHotel,
  MdOutlineStorefront,
  MdOutlineApartment,
} from "react-icons/md";

function SelectCardComponent({
  cardItem,
  handleSelectCard,
  users,
  selectedCard,
}) {
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

  const getLastAssignedUserName = useCallback(
    (usersAssigned) => {
      if (!usersAssigned?.length) return "Sem responsável";
      const lastAssigned = usersAssigned[usersAssigned.length - 1];
      return (
        users.find((user) => user.id === lastAssigned.userId)?.name ||
        "Usuário não encontrado"
      );
    },
    [users]
  );

  return (
    <div className="overflow-y-auto border rounded p-2 -mx-5 bg-primary">
      {cardItem.length ? (
        cardItem.map((card) => (
          <Disclosure key={card.id}>
            {({ open }) => (
              <div className="mb-2 border rounded overflow-hidden w-full ">
                <div className="p-2 flex justify-end border-t items-center bg-gray-200 hover:bg-gray-300">
                  <input
                    type="checkbox"
                    checked={selectedCard?.some((item) => item.id === card.id)}
                    onChange={() =>
                      handleSelectCard(
                        card.id,
                        card.number,
                        card.startDate,
                        card?.usersAssigned[0]?.userId
                      )
                    }
                    className="w-5 h-5 text-red-500"
                  />

                  <DisclosureButton className="flex flex-col justify-between w-full px-4 py-2 text-left">
                    <p className="font-semibold flex items-center gap-2">
                      <FaTableList /> Tarjeta: {card.number}
                    </p>
                    <div className="flex items-center justify-between w-full">
                      <div className="w-full px-3 py-2">
                        <p className="flex items-center gap-2">
                          <FaLocationDot /> {card.street.length}
                        </p>
                        {card.startDate && (
                          <>
                            <p className="flex items-center gap-2">
                              <FaCalendarDays />{" "}
                              {new Date(card.startDate).toLocaleDateString(
                                "pt-BR"
                              )}
                            </p>
                            <p className="flex items-center gap-2">
                              <FaUser />
                              <strong>
                                {getLastAssignedUserName(card.usersAssigned)}
                              </strong>
                            </p>
                          </>
                        )}
                        {card.startDate && card.endDate ? (
                          <p className="text-cyan-600">
                            Tarjeta devuelta el{" "}
                            {new Date(card.endDate).toLocaleDateString("pt-BR")}
                          </p>
                        ) : !card.startDate ? (
                          <p className="text-red-700">Nueva tarjeta</p>
                        ) : null}
                      </div>
                    </div>
                  </DisclosureButton>
                  {open ? <FaAngleUp /> : <FaAngleDown />}
                </div>
                <DisclosurePanel className="p-4 bg-white border-t">
                  {card.street.map((street, index) => (
                    <AddressItem
                      key={street.id}
                      address={street}
                      index={index}
                      typeIcons={typeIcons}
                    />
                  ))}
                </DisclosurePanel>
              </div>
            )}
          </Disclosure>
        ))
      ) : (
        <p className="text-gray-500">No hay tarjetas disponibles.</p>
      )}
    </div>
  );
}

const AddressItem = ({ address, index, typeIcons }) => (
  <div className="flex flex-col gap-2 py-2 border-b text-sm lg:text-lg">
    <p className="text-xs font-bold flex items-center gap-2">
      <FaLocationDot /> Dirección: {index + 1}
    </p>
    <div className="flex gap-2">
      <img
        src={address.photo}
        className="object-cover w-24"
        alt={`Foto de la calle: ${address.street}, ${address.number}`}
      />
      <div className="flex flex-col gap-2 justify-center">
        <p className="text-lg">{typeIcons[address.type]}</p>
        <p>
          Calle:{" "}
          <strong>
            {address.street}, {address.number}
          </strong>
        </p>
        <p>{address.neighborhood}</p>
        {address.complement && <p>{address.complement}</p>}
        <p
          className={
            address.confirmed ? "text-green-500" : "text-red-500 font-semibold"
          }
        >
          {address.confirmed ? "Confirmada" : "Necesita confirmar"}
        </p>
      </div>
    </div>
  </div>
);

SelectCardComponent.propTypes = {
  cardItem: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      number: PropTypes.number.isRequired,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      street: PropTypes.arrayOf(PropTypes.object).isRequired,
      usersAssigned: PropTypes.arrayOf(
        PropTypes.shape({ userId: PropTypes.string.isRequired })
      ).isRequired,
    })
  ).isRequired,
  handleSelectCard: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedCard: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      number: PropTypes.number.isRequired,
    })
  ).isRequired,
};

AddressItem.propTypes = {
  address: PropTypes.shape({
    id: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
    street: PropTypes.string.isRequired,
    number: PropTypes.string.isRequired,
    neighborhood: PropTypes.string.isRequired,
    complement: PropTypes.string,
    confirmed: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  typeIcons: PropTypes.object.isRequired,
};

export default SelectCardComponent;

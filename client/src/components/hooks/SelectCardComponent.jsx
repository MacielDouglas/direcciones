import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import {
  MdHouse,
  MdRestaurant,
  MdHotel,
  MdOutlineStorefront,
  MdOutlineApartment,
} from "react-icons/md";

function SelectCardComponent({ cardItem, setSelectedCard, addresses, users }) {
  const toggleSelectCard = (cardId) => {
    setSelectedCard((prevSelected) =>
      prevSelected.includes(cardId)
        ? prevSelected.filter((id) => id !== cardId)
        : [...prevSelected, cardId]
    );
  };

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

  const getLastAssignedUserName = (usersAssigned, users) => {
    if (!usersAssigned || usersAssigned.length === 0) return "Sem responsável";

    const lastAssigned = usersAssigned[usersAssigned.length - 1];
    const user = users.find((user) => user.id === lastAssigned.userId);

    return user ? user.name : "Usuário não encontrado";
  };

  return (
    <div className="overflow-y-auto border rounded p-2 bg-primary -mx-5">
      {cardItem.length ? (
        cardItem.map((card) => (
          <Disclosure key={card.id}>
            {({ open }) => (
              <div className="mb-2 border rounded overflow-hidden w-full">
                <DisclosureButton className="flex justify-between w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-left items-center">
                  <input
                    type="checkbox"
                    onChange={() => toggleSelectCard(card.id)}
                    className="w-5 h-5"
                  />
                  <div>
                    <p className="font-medium">Tarjeta: {card.number}</p>
                    {card.startDate && (
                      <>
                        <p>
                          Asignada:{" "}
                          {new Date(card.startDate).toLocaleDateString("pt-BR")}
                        </p>
                        <p>
                          Asignado:{" "}
                          <strong>
                            {getLastAssignedUserName(card.usersAssigned, users)}
                          </strong>
                        </p>
                      </>
                    )}
                    <p
                      className={
                        card.startDate === null || card.endDate === null
                          ? "text-red-700"
                          : "text-cyan-600"
                      }
                    >
                      {card.startDate === null || card.endDate === null
                        ? "tarjeta no trabajada"
                        : `tarjeta devuelta el ${new Date(
                            card.endDate
                          ).toLocaleDateString("pt-BR")}`}
                    </p>
                    <p>
                      Esta tarjeta tiene <strong>{card.street.length}</strong>{" "}
                      {card.street.length > 1 ? "direcciones" : "dirección"}
                    </p>
                  </div>
                  {open ? <FaAngleUp /> : <FaAngleDown />}
                </DisclosureButton>
                <DisclosurePanel className="p-4 bg-white border-t">
                  {card.street.map((streetId, index) => (
                    <div
                      key={streetId}
                      className="flex justify-between py-2 border-b text-sm lg:text-lg flex-col"
                    >
                      <p className="text-xs font-bold mb-2">
                        Dirección: {index + 1}
                      </p>
                      <ul>
                        {addresses
                          .filter((s) => s.id === streetId)
                          .map((a) => (
                            <li key={a.id} className="flex gap-2">
                              <img
                                src={a.photo}
                                className="object-cover w-24"
                                alt={`Foto de la calle: ${a.street}, ${a.number}`}
                              />
                              <div className="flex flex-col gap-2 justify-center">
                                <p className="text-lg">{typeIcons[a.type]}</p>
                                <p>
                                  Calle:{" "}
                                  <strong>
                                    {a.street}, {a.number}
                                  </strong>
                                </p>
                                <p>{a.neighborhood}</p>
                                {a.complement && <p>{a.complement}</p>}
                                {a.confirmed ? (
                                  <p>Confirmada</p>
                                ) : (
                                  <p className="text-red-500 font-semibold">
                                    Necesita confirmar
                                  </p>
                                )}
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
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

// Definição correta do PropTypes
SelectCardComponent.propTypes = {
  cardItem: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      number: PropTypes.number.isRequired,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      street: PropTypes.arrayOf(PropTypes.string).isRequired,
      usersAssigned: PropTypes.arrayOf(
        PropTypes.shape({
          userId: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  setSelectedCard: PropTypes.func.isRequired,
  addresses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      photo: PropTypes.string.isRequired,
      street: PropTypes.string.isRequired,
      number: PropTypes.string.isRequired,
      neighborhood: PropTypes.string.isRequired,
      complement: PropTypes.string,
      confirmed: PropTypes.bool.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default SelectCardComponent;

// import {
//   Disclosure,
//   DisclosureButton,
//   DisclosurePanel,
// } from "@headlessui/react";
// import PropTypes from "prop-types";
// import { useMemo } from "react";
// import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
// import {
//   MdHouse,
//   MdRestaurant,
//   MdHotel,
//   MdOutlineStorefront,
//   MdOutlineApartment,
// } from "react-icons/md";

// function SelectCardComponent({ cardItem, setSelectedCard, addresses, users }) {;

//   const toggleSelectCard = (cardId) => {
//     setSelectedCard((prevSelected) =>
//       prevSelected.includes(cardId)
//         ? prevSelected.filter((id) => id !== cardId)
//         : [...prevSelected, cardId]
//     );
//     users: PropTypes.arrayOf(
//       PropTypes.shape({
//         id: PropTypes.string.isRequired,
//         name: PropTypes.string.isRequired,
//       })
//     ).isRequired,
// }
//   const typeIcons = useMemo(
//     () => ({
//       house: <MdHouse />,
//       department: <MdOutlineApartment />,
//       store: <MdOutlineStorefront />,
//       restaurant: <MdRestaurant />,
//       hotel: <MdHotel />,
//     }),
//     []
//   );

//   const getLastAssignedUserName = (cardItem, users) => {
//     const lastAssigned = cardItem[cardItem.length - 1];

//     const user = users.find((user) => user.id === lastAssigned.userId);

//     return user ? user.name : "Usuário não encontrado";
//   };

//   return (
//     <div className="overflow-y-auto border rounded p-2  bg-primary -mx-5">
//       {cardItem.length ? (
//         cardItem.map((card) => (
//           <Disclosure key={card.id}>
//             {({ open }) => (
//               <div className="mb-2 border rounded overflow-hidden w-full">
//                 <DisclosureButton className="flex justify-between w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-left items-center">
//                   <input
//                     type="checkbox"
//                     onChange={() => toggleSelectCard(card.id)}
//                     className="w-5 h-5 "
//                   />
//                   <div>
//                     <p className="font-medium">Tarjeta: {card.number}</p>
//                     {card.startDate !== null && (
//                       <>
//                         <p>
//                           Asignada:{" "}
//                           {new Date(card.startDate).toLocaleDateString("pt-BR")}
//                         </p>
//                         <p>
//                           Asignado a:{" "}
//                           {getLastAssignedUserName(
//                             cardItem[0].usersAssigned,
//                             users
//                           )}
//                         </p>
//                       </>
//                     )}

//                     <p
//                       className={
//                         card.startDate === null || card.endDate === null
//                           ? "text-red-700"
//                           : "text-cyan-600"
//                       }
//                     >
//                       {card.startDate === null || card.endDate === null
//                         ? "tarjeta no trabajada"
//                         : `tarjeta devuelta el ${card.endDate} `}
//                     </p>
//                     <p>
//                       Esta tarjeta tiene <strong>{card.street.length} </strong>
//                       {card.street.length > 1 ? "direcciones" : "dirección"}
//                     </p>
//                   </div>
//                   {open ? <FaAngleUp /> : <FaAngleDown />}
//                 </DisclosureButton>
//                 <DisclosurePanel className="p-4 bg-white border-t">
//                   {card.street.map((card, index) => (
//                     <div
//                       key={card}
//                       className="flex justify-between py-2 border-b text-sm lg:text-lg flex-col"
//                     >
//                       <p className="text-xs font-bold mb-2">
//                         dirección: {index + 1}
//                       </p>
//                       <ul>
//                         {addresses
//                           .filter((s) => s.id === card)
//                           .map((a) => (
//                             <li key={a.id} className="flex gap-2">
//                               <img
//                                 src={a.photo}
//                                 className="object-cover w-24"
//                                 alt={`Foto de la calle: ${a.street}, ${a.number}`}
//                               />
//                               <div className="flex flex-col gap-2 justify-center">
//                                 <p className="text-lg">{typeIcons[a.type]}</p>
//                                 <p>
//                                   calle:{" "}
//                                   <strong>
//                                     {a.street}, {a.number}
//                                   </strong>
//                                 </p>
//                                 <p>{a.neighborhood}</p>
//                                 {a.complement && <p>{a.complement}</p>}

//                                 {a.confirmed ? (
//                                   <p>confirmada</p>
//                                 ) : (
//                                   <p className="text-red-500 font-semibold">
//                                     nesecita confirmar
//                                   </p>
//                                 )}
//                               </div>
//                             </li>
//                           ))}
//                       </ul>
//                     </div>
//                   ))}
//                 </DisclosurePanel>
//               </div>
//             )}
//           </Disclosure>
//         ))
//       ) : (
//         <p className="text-gray-500">No hay tarjetas disponibles.</p>
//       )}
//     </div>
//   );
// }
// export default SelectCardComponent;

// SelectCardComponent.propTypes = {
//   cardItem: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string.isRequired,
//       number: PropTypes.string.isRequired,
//       startDate: PropTypes.string,
//       endDate: PropTypes.string,
//       street: PropTypes.arrayOf(PropTypes.string).isRequired,
//       userId: PropTypes.string.isRequired,
//       usersAssigned: PropTypes.arrayOf(
//         PropTypes.shape({
//           userId: PropTypes.string.isRequired,
//         })
//       ).isRequired,
//     })
//   ).isRequired,
//   setSelectedCard: PropTypes.func.isRequired,
//   addresses: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string.isRequired,
//       photo: PropTypes.string.isRequired,
//       street: PropTypes.string.isRequired,
//       number: PropTypes.string.isRequired,
//       neighborhood: PropTypes.string.isRequired,
//       complement: PropTypes.string,
//       confirmed: PropTypes.bool.isRequired,
//       type: PropTypes.string.isRequired,
//     })
//   ).isRequired,
// };

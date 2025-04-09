import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BsPerson,
  BsPeople,
  BsMap,
  BsCardList,
  BsArrowLeftRight,
} from "react-icons/bs";

import { createSelector } from "@reduxjs/toolkit";

import menuOptions from "../constants/menu";
import { setCards } from "../store/cardsSlice";

// Seletores memoizados para otimizar re-renders
const selectUserData = createSelector(
  (state) => state.user,
  (user) => user?.userData
);

const selectCardsData = createSelector(
  (state) => state.cards,
  (cards) => cards?.cardsData
);

const iconsMap = {
  Tarjetas: BsCardList,
  Dirección: BsMap,
  Admin: BsPeople,
  Perfil: BsPerson,
  Assignar: BsArrowLeftRight,
};

import PropTypes from "prop-types";

const MenuItem = ({ to, label, IconComponent, index }) => (
  <motion.div
    className="p-4 border border-gray-300 rounded-lg shadow-md bg-white"
    initial={{ y: 10, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{
      duration: 0.4,
      delay: index * 0.1,
      ease: "easeOut",
    }}
    whileHover={{ scale: 1.02, opacity: 0.95 }}
  >
    <Link to={to} className="flex gap-4 items-center">
      {IconComponent && <IconComponent size={32} className="text-black" />}
      <p className="font-medium text-xl tracking-widest">{label}</p>
    </Link>
  </motion.div>
);
MenuItem.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  IconComponent: PropTypes.elementType,
  index: PropTypes.number.isRequired,
};

export default function Home() {
  const dispatch = useDispatch();
  const userData = useSelector(selectUserData);
  const cardsData = useSelector(selectCardsData);

  const { name = "Usuário", isSS, id: userId, isSCards } = userData || {};

  // Filtra os cartões pertencentes ao usuário logado
  const userCards = useMemo(() => {
    if (!cardsData || !Array.isArray(cardsData) || !userId) return [];
    return cardsData.filter(
      (ed) =>
        Array.isArray(ed?.usersAssigned) &&
        ed.usersAssigned.some((item) => item.userId === userId)
    );
  }, [cardsData, userId]);

  useEffect(() => {
    if (userCards.length > 0) {
      dispatch(setCards({ myCards: userCards }));
    }
  }, [dispatch, userCards]);

  return (
    <motion.div
      className="w-full relative h-screen text-black pb-16 px-4 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="w-full max-w-3xl text-center mt-10"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-light tracking-wide mb-6">
          Bienvenido, <span className="font-medium">{name}</span>.
        </h1>
        <p className="text-lg text-gray-600">Elija una opción para comenzar:</p>
      </motion.div>

      <motion.nav
        role="navigation"
        aria-label="Menu principal"
        className="flex flex-col w-full max-w-2xl mt-6 space-y-4"
      >
        {Object.entries(menuOptions).map(([key, item], index) => (
          <MenuItem
            key={key}
            to={item.path}
            label={item.label}
            IconComponent={iconsMap[item.label]}
            index={index}
          />
        ))}
        {isSS && (
          <MenuItem
            to="/adminUsers"
            label="Admin"
            IconComponent={BsPeople}
            index={Object.keys(menuOptions).length}
          />
        )}
        {isSCards && (
          <MenuItem
            to="/cards?tab=asignar"
            label="Assignar Tarjetas"
            IconComponent={BsArrowLeftRight}
            index={Object.keys(menuOptions).length}
          />
        )}
      </motion.nav>
    </motion.div>
  );
}

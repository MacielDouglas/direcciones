import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLazyQuery, useSubscription } from "@apollo/client";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import { GET_CARDS } from "../graphql/queries/cards.query";
import { setCards } from "../store/cardsSlice";

import CardsSidebar from "../components/Cards/CardsSidebar";
import Card from "../components/Cards/Card";
import UpdateCard from "../components/Cards/UpdateCard";
import NewCard from "../components/Cards/NewCard";
import AssignCard from "../components/Cards/AssignCard";
import Loading from "../context/Loading";
import ScrollToTop from "../context/ScrollTotop";
import { CARD_SUBSCRIPTION } from "../graphql/mutation/cards.mutation";

function Cards() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { userData } = useSelector((state) => state.user);
  const { isSS } = userData;

  const { data, loading, error } = useSubscription(CARD_SUBSCRIPTION);
  // console.log(user);
  // if (user.isAuthenticated) {
  console.log("DATA, CARD Subes: ", data);
  console.log("Error, subscribe: ", error);
  console.log("Carregandooooo: ", loading);
  // }

  if (data) {
    toast.info("DATA, CARD Subes: ", data.length);
  }

  const [tab, setTab] = useState("cards");

  const [fetchCards] = useLazyQuery(GET_CARDS, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data?.card) {
        dispatch(setCards({ cards: data.card }));
      }
    },
    onError: (error) => {
      toast.error(`Erro ao buscar cartões: ${error.message}`);
    },
  });

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  useEffect(() => {
    const tabFromUrl =
      new URLSearchParams(location.search).get("tab") || "cards";
    setTab(tabFromUrl);
  }, [location.search]);

  const handleTabChange = useCallback(
    (newTab) => {
      navigate(`?tab=${newTab}`, { replace: true });
    },
    [navigate]
  );

  // if (loading) {
  //   return <Loading text="Carregando cartões..." />;
  // }

  // if (error) {
  //   return (
  //     <p className="text-red-500">
  //       Erro ao carregar os cartões. Tente novamente.
  //     </p>
  //   );
  // }

  if (error) {
    toast.error(`Erro ao carregar cartões: ${error.message}`);
    return null;
  }

  return (
    <motion.div
      className="w-full  flex flex-col items-center bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ScrollToTop />

      {/* Sidebar para Admin */}
      {isSS && <CardsSidebar onTabChange={handleTabChange} activeTab={tab} />}

      {/* Conteúdo Dinâmico */}
      <motion.div
        className="w-full shadow-lg rounded-lg  mt-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {tab === "cards" && <Card />}
        {tab === "crear" && <NewCard />}
        {tab === "modificar" && <UpdateCard />}
        {isSS && tab === "asignar" && <AssignCard />}
      </motion.div>
    </motion.div>
  );
}

export default Cards;

// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { useLazyQuery } from "@apollo/client";
// import { GET_CARDS } from "../graphql/queries/cards.query";
// import { setCards } from "../store/cardsSlice";

// import CardsSidebar from "../components/Cards/CardsSidebar";
// import Card from "../components/Cards/Card";
// import UpdateCard from "../components/Cards/UpdateCard";
// import NewCard from "../components/Cards/NewCard";
// import AssignCard from "../components/Cards/AssignCard";
// import Loading from "../context/Loading";
// import ScrollToTop from "../context/ScrollTotop";
// import { toast } from "react-toastify";

// function Cards() {
//   const user = useSelector((state) => state.user);
//   const cards = useSelector((state) => state.cards);
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const navigate = useNavigate();

//   // const admin = user.userData.isAdmmin;
//   const isSS = user.userData.isSS;

//   const [tab, setTab] = useState(
//     () => new URLSearchParams(location.search).get("tab") || "new-address"
//   );

//   const [fetchCards, { loading, error }] = useLazyQuery(GET_CARDS, {
//     onCompleted: (data) => {
//       if (data && data.card) {
//         dispatch(setCards({ cards: data.card }));
//       }
//     },
//     onError: (error) => {
//       toast.error(`Erro: ${error.message}`);
//     },
//   });

//   useEffect(() => {
//     fetchCards();
//   }, [fetchCards]);

//   useEffect(() => {
//     const tabFromUrl = new URLSearchParams(location.search).get("tab");

//     if (!tabFromUrl) {
//       if (tab !== "cards") {
//         navigate("?tab=cards", { replace: true });
//       }
//     } else if (tabFromUrl !== tab) {
//       setTab(tabFromUrl);
//     }
//   }, [location.search, navigate, tab]);

//   if (loading) {
//     return <Loading text={"Cargando direcciones..."} w />;
//   }

//   if (error) {
//     console.error("Erro ao buscar os cards:", error);
//     return <p>Error al cargar las tarjetas. Tente novamente más tarde.</p>;
//   }

//   return (
//     <div>
//       <ScrollToTop />
//       {isSS && <div>{<CardsSidebar />}</div>}
//       {tab === "cards" && <Card />}
//       {tab === "crear" && <NewCard />}
//       {tab === "modificar" && <UpdateCard />}
//       {isSS && tab === "asignar" && <AssignCard />}
//     </div>
//   );
// }

// export default Cards;

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLazyQuery } from "@apollo/client";
import { GET_CARDS } from "../graphql/queries/cards.query";
import { setCards } from "../store/cardsSlice";

import CardsSidebar from "../components/Cards/CardsSidebar";
import Card from "../components/Cards/Card";
import UpdateCard from "../components/Cards/UpdateCard";
import NewCard from "../components/Cards/NewCard";
import AssignCard from "../components/Cards/AssignCard";
import Loading from "../context/Loading";
import ScrollToTop from "../context/ScrollTotop";

function Cards() {
  const user = useSelector((state) => state.user);
  const cards = useSelector((state) => state.cards);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const admin = user.userData.isAdmmin;
  const isSS = user.userData.isSS;
  console.log("isssss", isSS);

  const [tab, setTab] = useState(
    () => new URLSearchParams(location.search).get("tab") || "new-address"
  );

  const [fetchCards, { loading, error }] = useLazyQuery(GET_CARDS, {
    variables: { action: "get" },
    onCompleted: (data) => {
      if (data && data.card) {
        dispatch(setCards({ cards: data.card }));
      }
    },
  });

  useEffect(() => {
    if (!cards?.cards || cards.cards.length === 0) {
      fetchCards();
    }
  }, [fetchCards]);

  useEffect(() => {
    const tabFromUrl = new URLSearchParams(location.search).get("tab");

    if (!tabFromUrl) {
      // Redireciona somente se necessário
      if (tab !== "cards") {
        navigate("?tab=cards", { replace: true });
      }
    } else if (tabFromUrl !== tab) {
      setTab(tabFromUrl);
    }
  }, [location.search, navigate, tab]);

  if (loading) {
    return <Loading text={"Cargando direcciones..."} w />;
  }

  if (error) {
    console.error("Erro ao buscar os cards:", error);
    return <p>Error al cargar las tarjetas. Tente novamente más tarde.</p>;
  }

  return (
    // <div className="min-h-screen flex flex-col md:flex-row bg-primary">
    <div>
      <ScrollToTop />
      {isSS && <div>{<CardsSidebar />}</div>}
      {tab === "cards" && <Card />}
      {tab === "crear" && <NewCard />}
      {tab === "modificar" && <UpdateCard />}
      {isSS && tab === "asignar" && <AssignCard />}
    </div>
  );
}

export default Cards;

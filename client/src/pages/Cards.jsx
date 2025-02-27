import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CardsSidebar from "../components/Cards/CardsSidebar";
import Card from "../components/Cards/Card";
import UpdateCard from "../components/Cards/UpdateCard";
import NewCard from "../components/Cards/NewCard";
import AssignCard from "../components/Cards/AssignCard";
import Loading from "../context/Loading";
import ScrollToTop from "../context/ScrollTotop";

import { useCard } from "../graphql/hooks/useCard";
import { useSubscription } from "@apollo/client";
import { MY_CARDS_SUBSCRIPTION } from "../graphql/queries/user.query";

function Cards() {
  const user = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const myCardsData = useSelector((state) => state.cards);

  const { fetchMyCards, fetchCards, cardLoading, errorCards } = useCard();

  const { data, loading, error } = useSubscription(MY_CARDS_SUBSCRIPTION);

  console.log("SUBSCRiption DATA", data);
  console.log("SUBSCRiption LOADING", loading);
  console.log("SUBSCRiption ERROR", error);

  // const admin = user.userData.isAdmmin;
  const isSS = user.userData.isSS;

  const [tab, setTab] = useState(
    () => new URLSearchParams(location.search).get("tab") || "new-address"
  );

  useEffect(() => {
    fetchMyCards();
    isSS && fetchCards();
  }, [fetchMyCards, fetchCards, isSS]);

  useEffect(() => {
    const tabFromUrl = new URLSearchParams(location.search).get("tab");

    if (!tabFromUrl) {
      if (tab !== "cards") {
        navigate("?tab=cards", { replace: true });
      }
    } else if (tabFromUrl !== tab) {
      setTab(tabFromUrl);
    }
  }, [location.search, navigate, tab]);

  if (cardLoading) {
    return <Loading text={"Cargando direcciones..."} w />;
  }

  if (errorCards) {
    console.error("Erro ao buscar os cards:", errorCards);
    return <p>Error al cargar las tarjetas. Tente novamente más tarde.</p>;
  }

  return (
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

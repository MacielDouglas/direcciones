import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLazyQuery } from "@apollo/client";
import { GET_CARDS } from "../graphql/queries/cards.query";
import { setCards } from "../store/cardsSlice";
import { Player } from "@lottiefiles/react-lottie-player";

import CardsSidebar from "../components/Cards/CardsSidebar";
import Card from "../components/Cards/Card";
import UpdateCard from "../components/Cards/UpdateCard";
import NewCard from "../components/Cards/NewCard";
import AssignCard from "../components/Cards/AssignCard";

function Cards() {
  const cards = useSelector((state) => state.cards);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

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
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
        <Player
          autoplay
          loop
          // src="https://assets3.lottiefiles.com/packages/lf20_YNs7Ld.json"
          src="https://lottie.host/f4160263-ae92-43c0-8d0c-cfd14cf2896d/Q86AWuCDYM.json"
          style={{ height: "400px", width: "400px" }}
        />
        <p className="mt-4 text-2xl text-blue-500">Cargando direcciones...</p>
      </div>
    );
  }

  if (error) {
    console.error("Erro ao buscar os cards:", error);
    return <p>Error al cargar las tarjetas. Tente novamente más tarde.</p>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-primary">
      <div>{<CardsSidebar />}</div>
      {tab === "cards" && <Card />}
      {tab === "crear" && <NewCard />}
      {tab === "modificar" && <UpdateCard />}
      {tab === "asignar" && <AssignCard />}
    </div>
  );
}

export default Cards;

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
import { toast } from "react-toastify";

function Cards() {
  const user = useSelector((state) => state.user);
  const cards = useSelector((state) => state.cards) || [];
  const myCards = cards?.myCardsData || [];
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const isSS = user.userData.isSS;

  const [tab, setTab] = useState(
    () => new URLSearchParams(location.search).get("tab") || "new-address"
  );

  const socket = new WebSocket(import.meta.env.VITE_API_URL_SOCKET);
  socket.onmessage = (event) => {
    const cardsReceived = JSON.parse(event.data);
    if (cardsReceived) {
      dispatch(setCards({ cards: cardsReceived }));
    }
  };

  useEffect(() => {
    if (!cards?.cardsData || !Array.isArray(cards.cardsData)) return;

    const filtro = cards.cardsData.filter(
      (ed) =>
        Array.isArray(ed?.usersAssigned) &&
        ed.usersAssigned.some((item) => item.userId === user?.userData?.id)
    );
    if (myCards.length < filtro.length)
      toast.info("Você recebeu cartões novos.");
    if (myCards.length > filtro.length)
      toast.info("Foi devolvido alguns cartões.");

    dispatch(setCards({ myCards: filtro })); // Alterado de myCardsData para myCards
  }, [dispatch, cards?.cardsData, user?.userData?.id, myCards.length]);

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

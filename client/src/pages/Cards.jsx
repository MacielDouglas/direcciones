import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCards } from "../store/cardsSlice";

import CardsSidebar from "../components/Cards/CardsSidebar";
import Card from "../components/Cards/Card";
import UpdateCard from "../components/Cards/UpdateCard";
import NewCard from "../components/Cards/NewCard";
import AssignCard from "../components/Cards/AssignCard";
import ScrollToTop from "../context/ScrollTotop";
import { toast } from "react-toastify";
import { useFetchCards } from "../graphql/hooks/useCard";

function Cards() {
  const user = useSelector((state) => state.user);
  const cards = useSelector((state) => state.cards) || [];
  const myCards = cards?.myCardsData || [];
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { fetchCards } = useFetchCards();
  const { isSS, isSCards } = user?.userData || {};

  useEffect(() => {
    fetchCards();
  }, []);

  const [tab, setTab] = useState(
    () => new URLSearchParams(location.search).get("tab") || "new-address"
  );

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
      {isSS && tab === "crear" && <NewCard />}
      {isSS && tab === "modificar" && <UpdateCard />}
      {tab === "asignar" && <AssignCard />}
    </div>
  );
}

export default Cards;

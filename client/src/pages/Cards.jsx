import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CardsSidebar from "../components/Cards/CardsSidebar";
import Card from "../components/Cards/Card";
import UpdateCard from "../components/Cards/UpdateCard";
import NewCard from "../components/Cards/NewCard";
import AssignCard from "../components/Cards/AssignCard";
import Loading from "../context/Loading";
import ScrollToTop from "../context/ScrollTotop";

import { useCard } from "../graphql/hooks/useCard";
import { useSubscription } from "@apollo/client";
import { setCards, setMyCards } from "../store/cardsSlice";
import { CARD_SUBSCRIPTION } from "../graphql/queries/cards.query";
import { toast } from "react-toastify";

function Cards() {
  const user = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cardsData } = useSelector((state) => state.cards) || [];
  const [prevCardCount, setPrevCardCount] = useState(null);
  const { data } = useSubscription(CARD_SUBSCRIPTION);

  const myCards = useMemo(() => {
    return cardsData.filter((card) =>
      card?.usersAssigned.some(
        (assigned) => assigned.userId === user.userData.id
      )
    );
  }, [cardsData, user.userData.id]);

  useEffect(() => {
    if (prevCardCount !== null && myCards.length !== prevCardCount) {
      toast.info(
        `Ahora tienes ${
          myCards.length === 1
            ? myCards.length + " tarjeta"
            : myCards.length + " tarjetas"
        }`
      );
    }
    setPrevCardCount(myCards.length);
    dispatch(setMyCards({ myCards }));
  }, [myCards, dispatch, prevCardCount]);

  const { cardLoading, errorCards } = useCard();
  const isSS = user.userData.isSS;

  const [tab, setTab] = useState(
    () => new URLSearchParams(location.search).get("tab") || "cards"
  );

  useEffect(() => {
    if (data) {
      const cards = data?.fullCard?.cards || [];
      dispatch(setCards({ cards }));
    }
  }, [data, dispatch]);

  useEffect(() => {
    const tabFromUrl = new URLSearchParams(location.search).get("tab");
    if (tabFromUrl !== tab) {
      setTab(tabFromUrl || "cards");
      navigate(`?tab=${tabFromUrl || "cards"}`, { replace: true });
    }
  }, [location.search, navigate, tab]);

  if (cardLoading) {
    return <Loading text={"Carregando cartões..."} w />;
  }

  if (errorCards) {
    console.error("Erro ao buscar os cards:", errorCards);
    return <p>Erro ao carregar os cartões. Tente novamente mais tarde.</p>;
  }

  return (
    <div>
      <ScrollToTop />
      {isSS && <CardsSidebar />}
      {tab === "cards" && <Card />}
      {tab === "crear" && <NewCard />}
      {tab === "modificar" && <UpdateCard />}
      {isSS && tab === "asignar" && <AssignCard />}
    </div>
  );
}

export default Cards;

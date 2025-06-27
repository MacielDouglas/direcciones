import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { selectIsSS } from "../store/selectors/userSelectors";
import SidebarCard from "./Card/SidebarCard";
import CreateCard from "./Card/CreateCard";
import AsignateCard from "./Card/AsignateCard";
import UpadateCard from "./Card/UpadateCard";
import { useFetchCards } from "../graphql/hooks/useCards";

const Cards = () => {
  const { fetchCards } = useFetchCards();
  const isSS = useSelector(selectIsSS);
  const location = useLocation();
  const navigate = useNavigate();

  const [tab, setTab] = useState<string>(() => {
    return new URLSearchParams(location.search).get("tab") || "create-card";
  });

  const [cardId, setCardId] = useState<string | null>(null);

  useEffect(() => {
    if (isSS) fetchCards();
  }, [isSS, fetchCards]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabFromUrl = searchParams.get("tab");
    const idFromUrl = searchParams.get("id");

    if (!tabFromUrl) {
      navigate("?tab=new-card", { replace: true });
    } else {
      setTab(tabFromUrl);
      setCardId(idFromUrl);
    }
  }, [location.search, navigate]);

  const getDireccionIdFromTab = (): string | null => {
    const match = tab.match(/^\/cards\/(.+)/);
    return match ? match[1] : null;
  };

  const id = getDireccionIdFromTab();
  return (
    <>
      {isSS ? (
        <div className="w-full h-full mb-10">
          <SidebarCard />

          {tab === "new-card" && <CreateCard />}
          {tab === "send-card" && <AsignateCard />}
          {tab === "update-card" && <UpadateCard id={cardId} />}

          {/* {id && <Address id={id} />} */}
        </div>
      ) : (
        <div className="w-full h-full mb-10">
          <h1>Você não tem autorização para acessar essa página.</h1>
        </div>
      )}
    </>
  );
};

export default Cards;

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DireccionSidebar from "../components/Direccion/DireccionSidebar";
import NewAddress from "../components/Direccion/NewAddress";
import SearchAddress from "../components/Direccion/SearchAddress";
import { useSelector } from "react-redux";
import Address from "../components/Address.jsx";

function Direcciones() {
  const addresses = useSelector((state) => state.addresses.addressesData);
  const location = useLocation();
  const navigate = useNavigate();

  const [tab, setTab] = useState(
    () => new URLSearchParams(location.search).get("tab") || "new-address"
  );

  // Efeito para atualizar a aba com base nos parâmetros da URL
  useEffect(() => {
    const tabFromUrl = new URLSearchParams(location.search).get("tab");

    if (!tabFromUrl) {
      // Redireciona para "new-address" se o parâmetro "tab" não estiver presente
      navigate("?tab=new-address", { replace: true });
    } else {
      setTab(tabFromUrl);
    }
  }, [location.search, navigate]);

  const getDireccionIdFromTab = () => {
    const match = tab.match(/^\/address\/(.+)/);
    return match ? match[1] : null;
  };
  const id = getDireccionIdFromTab();

  return (
    <div>
      <div>{<DireccionSidebar />}</div>
      {tab === "new-address" && <NewAddress addresses={addresses} />}
      {tab === "search-address" && <SearchAddress addresses={addresses} />}
      {tab === "address/:id" && <Address />}
      {id && <Address id={id} />}
    </div>
  );
}

export default Direcciones;

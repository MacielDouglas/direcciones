import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DireccionSidebar from "../components/Direccion/DireccionSidebar";
import NewAddress from "../components/Direccion/NewAddress";
import SearchAddress from "../components/Direccion/SearchAddress";
import { useSelector } from "react-redux";
import Address from "../components/Address.jsx";
import UpdateAddress from "../components/Direccion/UpdateAddress.jsx";

function Direcciones() {
  const addresses = useSelector((state) => state.addresses.addressesData);
  const location = useLocation();
  const navigate = useNavigate();

  const [tab, setTab] = useState(
    () => new URLSearchParams(location.search).get("tab") || "new-address"
  );
  const [direccionId, setDireccionId] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabFromUrl = searchParams.get("tab");
    const idFromUrl = searchParams.get("id");

    if (!tabFromUrl) {
      navigate("?tab=new-address", { replace: true });
    } else {
      setTab(tabFromUrl);

      // Armazene o ID em uma variável de estado separada, se necessário
      setDireccionId(idFromUrl);
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
      {tab === "update-address" && (
        <UpdateAddress addresses={addresses} id={direccionId} />
      )}

      {id && (
        <div className="bg-details">
          <Address id={id} />
        </div>
      )}
    </div>
  );
}

export default Direcciones;

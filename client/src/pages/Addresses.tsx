import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SidebarAddress from "./Address/SidebarAddress";
import NewAddress from "./Address/NewAddress";
import SearchAddress from "./Address/SearchAddress";
import UpdateAddress from "./Address/UpdateAddress";
import Address from "./Address/Address";

const Addresses = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [tab, setTab] = useState<string>(() => {
    return new URLSearchParams(location.search).get("tab") || "search-address";
  });

  const [addressId, setAddressId] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabFromUrl = searchParams.get("tab");
    const idFromUrl = searchParams.get("id");

    if (!tabFromUrl) {
      navigate("?tab=search-address", { replace: true });
    } else {
      setTab(tabFromUrl);
      setAddressId(idFromUrl);
    }
  }, [location.search, navigate]);

  const getDireccionIdFromTab = () => {
    const match = tab.match(/^\/address\/(.+)/);
    return match ? match[1] : null;
  };

  const id = getDireccionIdFromTab();

  return (
    <div className="w-full h-full mb-10">
      <SidebarAddress />

      {tab === "new-address" && <NewAddress />}
      {tab === "search-address" && <SearchAddress />}
      {tab === "update-address" && <UpdateAddress id={addressId} />}

      {id && <Address id={id} />}
    </div>
  );
};

export default Addresses;

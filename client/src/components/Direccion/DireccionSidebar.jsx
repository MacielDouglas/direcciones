import { Link, useLocation } from "react-router-dom";

function DireccionSidebar() {
  const location = useLocation();

  // Obtém o valor do parâmetro "tab" da URL
  const currentTab =
    new URLSearchParams(location.search).get("tab") || "new-address";

  return (
    <div className="text-start text-lg w-full">
      <div className="space-y-5 px-4 pt-3">
        <h1 className="text-4xl font-medium">Dirección</h1>
        <p>En esta página, usted puede ver, editar y enviar direcciones.</p>
      </div>
      <div className="flex text-center">
        {/* Botão Nueva Dirección */}
        <Link
          to="/address?tab=new-address"
          className={`p-4 w-full ${
            currentTab === "new-address" ? "bg-tertiary" : "bg-details"
          }`}
        >
          Nueva Dirección
        </Link>

        {/* Botão Buscar Dirección */}
        <Link
          to="/address?tab=search-address"
          className={`p-4 w-full ${
            currentTab === "search-address" ? "bg-tertiary" : "bg-details"
          }`}
        >
          Buscar Dirección
        </Link>
      </div>
    </div>
  );
}

export default DireccionSidebar;

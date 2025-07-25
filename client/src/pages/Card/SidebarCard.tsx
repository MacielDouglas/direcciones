import { Dock, PencilLine, Send } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const TABS = [
  { id: "new", label: "Crear", icon: <Dock /> },
  { id: "send", label: "Asignar ", icon: <Send /> },
  { id: "update", label: "Editar", icon: <PencilLine /> },
];

const SidebarCard = () => {
  const location = useLocation();
  const currentTab =
    new URLSearchParams(location.search).get("tab") || "send-card";

  return (
    <div className="h-full p-4">
      <div className="bg-second-lgt dark:bg-tertiary-drk p-6 rounded-2xl shadow-md space-y-6 max-w-2xl mx-auto">
        <header>
          <h1 className="text-4xl font-semibold">Crear y Asignar</h1>
          <p className="mt-2 text-lg text-neutral-600 dark:text-neutral-400">
            En esta página, usted puede crear, asignar y enviar tarjetas.
          </p>
        </header>

        <div
          role="tablist"
          aria-label="Opções de endereço"
          className="flex  justify-between border border-neutral-500 rounded-full overflow-hidden"
        >
          {TABS.map((tab) => (
            <NavLink
              key={tab.id}
              to={`/cards?tab=${tab.id}-card`}
              className={`flex  gap-2 p-3 text-center text-sm font-medium transition-all duration-200 cursor-pointer rounded-full truncate ${
                currentTab === tab.id + "-card"
                  ? "bg-primary-drk  text-primary-lgt dark:bg-primary-lgt dark:text-primary-drk items-center justify-center  w-3/5"
                  : "items-center justify-center bg-transparent text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 w-1/5 "
              }`}
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarCard;

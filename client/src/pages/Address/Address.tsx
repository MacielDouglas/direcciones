type AddressProps = {
  id: string | null;
};

const Address = ({ id }: AddressProps) => {
  console.log(id);

  return <div className="bg-amber-300 w-full h-full">Address</div>;
};

export default Address;
// import { LocationEdit, MapPinPlus, Search } from "lucide-react";
// import { useState } from "react";
// import NewAddress from "./NewAddress";

// import UpdateAddress from "./UpdateAddress";
// import SearchAddress from "./SearchAddress";

// const TABS = [
//   { id: "new", label: "Nueva Dirección", icon: <MapPinPlus /> },
//   { id: "search", label: "Pesquisar", icon: <Search /> },
//   { id: "edit", label: "Editar Dirección", icon: <LocationEdit /> },
// ];

// const Address = () => {
//   const [activeTab, setActiveTab] = useState("search");
//   //   const [tab, setTab] = useState(
//   //   () => new URLSearchParams(location.search).get("tab") || "new-address"
//   // );

//   const tab = new URLSearchParams(location.search).get("address") || "adas";

//   const getDireccionIdFromTab = () => {
//     const match = tab.match(/^\/address\/(.+)/);
//     return match ? match[1] : null;
//   };
//   const id = getDireccionIdFromTab();

//   console.log(tab);
//   console.log(id);

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "new":
//         return <NewAddress />;
//       case "search":
//         return <SearchAddress />;
//       case "edit":
//         return <UpdateAddress />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="h-full p-4">
//       <div className="bg-second-lgt dark:bg-tertiary-drk p-6 rounded-2xl shadow-md space-y-6 max-w-2xl mx-auto">
//         <header>
//           <h1 className="text-4xl font-semibold">Dirección</h1>
//           <p className="mt-2 text-lg text-neutral-600 dark:text-neutral-400">
//             En esta página, usted puede ver, editar y enviar direcciones.
//           </p>
//         </header>

//         {/* Tab Navigation */}
//         <div
//           role="tablist"
//           aria-label="Opções de endereço"
//           className="flex  justify-between border border-neutral-500 rounded-full overflow-hidden"
//         >
//           {TABS.map((tab) => (
//             <button
//               key={tab.id}
//               role="tab"
//               aria-selected={activeTab === tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`flex  gap-2 p-2 text-center text-sm font-medium transition-all duration-200 cursor-pointer rounded-full ${
//                 activeTab === tab.id
//                   ? "bg-primary-drk  text-primary-lgt dark:bg-primary-lgt dark:text-primary-drk items-center justify-center  w-3/5"
//                   : "items-center justify-center bg-transparent text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 w-1/5 "
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* Tab Content */}
//       </div>
//       <section role="tabpanel" className=" mt-5">
//         {renderTabContent()}
//       </section>
//     </div>
//   );
// };

// export default Address;

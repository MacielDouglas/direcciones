import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DireccionSidebar from "../components/Direccion/DireccionSidebar";
import NewAddress from "../components/Direccion/NewAddress";
import SearchAddress from "../components/Direccion/SearchAddress";
import { useQuery } from "@apollo/client";
import { GET_ADDRESS } from "../graphql/queries/address.query.js";

function Direcciones() {
  const location = useLocation();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_ADDRESS, {
    fetchPolicy: "network-only", // Garante que a consulta seja sempre feita no servidor
    variables: {
      action: "get",
      addressId: "",
      input: {
        street: "",
        active: true,
        city: "",
        confirmed: true,
        neighborhood: "",
      },
    },
    onCompleted: (response) => {
      console.log("Dados recebidos:", response);
    },
    onError: (err) => {
      console.error("Erro na consulta:", err.message);
    },
  });

  // Armazena os endereços obtidos da query
  const addresses = data?.address?.address || [];

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

  return (
    <div>
      <div>{<DireccionSidebar />}</div>
      {tab === "new-address" && <NewAddress addresses={addresses} />}
      {tab === "search-address" && <SearchAddress addresses={addresses} />}
    </div>
  );
}

export default Direcciones;
// import { useQuery } from "@apollo/client";
// import { useNavigate } from "react-router-dom";
// import { GET_ADDRESS } from "./../graphql/mutation/address.mutation";
// import { useState } from "react";

// function Direcciones() {
//   const navigate = useNavigate();

//   const { data, loading, error } = useQuery(GET_ADDRESS, {
//     fetchPolicy: "network-only", // Garante que a consulta seja sempre feita no servidor
//     variables: {
//       action: "get",
//       addressId: "",
//       input: {
//         street: "",
//         active: false,
//         city: "",
//         confirmed: false,
//         neighborhood: "",
//       },
//     },
//     onCompleted: (response) => {
//       console.log("Dados recebidos:", response);
//     },
//     onError: (err) => {
//       console.error("Erro na consulta:", err);
//     },
//   });

//   // Armazena os endereços obtidos da query
//   const addresses = data?.address?.address || [];

//   console.log(addresses);
//   // Estado para armazenar o termo de busca e a página atual
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

//   // Filtra os endereços com base no termo de busca
//   const filteredAddresses = addresses.filter((address) =>
//     address.street.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Configuração da paginação
//   const itemsPerPage = 20;
//   const totalPages = Math.ceil(filteredAddresses.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedAddresses = filteredAddresses.slice(
//     startIndex,
//     startIndex + itemsPerPage
//   );

//   const handleAddNewAddress = () => {
//     navigate("/new-address");
//   };

//   // Funções de navegação de página
//   const handlePreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   return (
//     <div className="">
//       <div className="text-start text-lg  space-y-5 px-4 py-6 text-stone-600">
//         <h1 className="text-4xl font-medium  text-secondary">Dirección</h1>
//         <p>En esta página, puede ver, editar y enviar direcciones.</p>
//       </div>

//       <div className="flex items-center justify-center my-6">
//         <input
//           type="text"
//           placeholder="Buscar dirección"
//           value={searchTerm}
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             setCurrentPage(1); // Reinicia para a primeira página ao buscar
//           }}
//           className="w-full max-w-xs p-2 border border-stone-400 rounded-lg text-gray-800 shadow focus:outline-none focus:ring-2 focus:ring-sky-500"
//         />
//       </div>

//       <div className="flex items-center justify-center mb-6">
//         <button
//           onClick={handleAddNewAddress}
//           className="w-full max-w-xs bg-secondary text-white font-semibold py-2 rounded-lg shadow-md hover:bg-sky-700 transition-colors"
//         >
//           Nueva Dirección
//         </button>
//       </div>

//       <div className="bg-white rounded-lg shadow-md p-4 space-y-6 ">
//         {loading && <p>Loading...</p>}
//         {error && <p>Error loading addresses</p>}
//         <h2>
//           Encontrado,{" "}
//           {paginatedAddresses.length && paginatedAddresses.length !== 0
//             ? paginatedAddresses.length
//             : addresses.length}
//           {addresses.length >= 1 ? " dirección" : " direcciones"}
//         </h2>
//         <ul className="space-y-4">
//           {paginatedAddresses.length > 0 ? (
//             paginatedAddresses.map((address, index) => (
//               <li
//                 key={index}
//                 className={`border-b border-gray-200 pb-3 h-20 flex justify-center flex-col ${
//                   !address.confirmed ? "bg-primary" : ""
//                 }`}
//               >
//                 <p className="text-gray-800 font-semibold">
//                   {address.street}, {address.number}
//                 </p>
//                 <p className="text-gray-500 text-sm">
//                   {address.city}, {address.neighborhood},
//                 </p>
//                 <p
//                   className={`${
//                     address.confirmed ? "" : "font-semibold text-orange-500"
//                   }`}
//                 >
//                   {address.confirmed ? "Confirmado" : "necesita confirmar"}
//                 </p>
//               </li>
//             ))
//           ) : (
//             <p>No se encontraron direcciones</p>
//           )}
//         </ul>
//       </div>

//       {/* Controles de Paginação */}
//       <div className="flex items-center justify-center mt-6 space-x-4 text-sky-800 mb-20">
//         <button
//           onClick={handlePreviousPage}
//           disabled={currentPage === 1}
//           className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50"
//         >
//           Anterior
//         </button>
//         <span>
//           Página {currentPage} de {totalPages}
//         </span>
//         <button
//           onClick={handleNextPage}
//           disabled={currentPage === totalPages}
//           className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50"
//         >
//           Próxima
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Direcciones;

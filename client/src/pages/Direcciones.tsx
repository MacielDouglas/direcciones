import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import NewAdress from "./Address/NewAdress";

const Direcciones = () => {
  return (
    <div className="w-full min-w-screen h-full mb-20">
      <div className="max-w-7xl mx-auto bg-blue-700">
        <Tabs defaultValue="new address" className="bg-red-600 p-6">
          <TabsList className="bg-yellow-50 w-full flex justify-around">
            <TabsTrigger
              value="new address"
              className="cursor-pointer bg-blue-700 p-2 rounded-sm"
            >
              Nueva Dirección
            </TabsTrigger>
            <TabsTrigger value="search address">Buscar Dirección</TabsTrigger>
          </TabsList>
          <TabsContent value="new address">
            <div>
              <NewAdress />
            </div>
          </TabsContent>
          <TabsContent value="search address">
            <div>
              <h1>New adajfçaksjf çak js</h1>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Direcciones;

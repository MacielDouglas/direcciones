import DarkButton from "./DarkButton";
import { Equal } from "lucide-react";
import { Button } from "../ui/button";

const Header = () => {
  return (
    <header className="w-full shadow-xl">
      <div className="flex justify-between items-center  py-3 px-8 max-w-7xl mx-auto ">
        <div className="flex items-center gap-4 md:gap-6">
          <a href="/" className="cursor-pointer">
            <div className="flex items-center gap-3 uppercase text-lg font-bold tracking-widest">
              <p>Direcciones</p>
            </div>
          </a>
        </div>
        <div className="flex items-center gap-4 md:gap-6 ">
          <DarkButton />
          <Button variant="ghost">
            <Equal className="!w-8 !h-8" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

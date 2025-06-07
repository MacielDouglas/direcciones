import DarkButton from "./DarkButton";
import HeaderMenu from "../ui/header-menu";
import SessionProvider from "../private/SessionProvider";

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
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-5">
            <SessionProvider />
            <DarkButton />
          </div>
          <HeaderMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;

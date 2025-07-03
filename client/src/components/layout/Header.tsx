import { Link } from "react-router-dom";
import SessionProvider from "../private/SessionProvider";
import ButtonDarkMode from "../utils/ButtonDarkMode";
import HeaderMenu from "./HeaderMenu";

const Header = () => {
  return (
    <header>
      <div className="mx-auto flex justify-between h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="block uppercase text-2xl tracking-widest text-destaque-primary font-bold"
        >
          Direcciones
        </Link>

        <div className="flex gap-3 items-center">
          <SessionProvider size={"text-sm"} />
          <ButtonDarkMode />
          <div className="ml-6">
            <HeaderMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

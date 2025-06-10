import { Link } from "react-router-dom";
import SessionProvider from "../private/SessionProvider";
import ThemeToggle from "../ThemeToggle";
import HeaderDrawer from "./HeaderDrawer";

const Header = () => {
  return (
    <header className="shadow-sm w-full ">
      <div className="max-w-7xl mx-auto navbar">
        <div className="flex-1">
          <Link to="/">Direcciones</Link>
        </div>
        <div className="flex-none"></div>
        <div className="flex gap-6 items-center">
          <SessionProvider />
          <ThemeToggle />
          <HeaderDrawer />
        </div>
      </div>
    </header>
  );
};

export default Header;

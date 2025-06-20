import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLazyQuery } from "@apollo/client";
import { LOGOUT } from "../../graphql/queries/user.query";
import { clearUser } from "../../store/userSlice";
import { menuOptions, menuSs } from "../../constants/menu";
import SessionProvider from "../private/SessionProvider";
import {
  UserRound,
  MapPinned,
  UsersRound,
  Dock,
  SendHorizontal,
  LogOut,
  X,
  AlignRight,
  House,
} from "lucide-react";
import { selectIsSS } from "../../store/selectors/userSelectors";
import toast from "react-hot-toast";

const iconsMap: Record<string, React.ComponentType<Record<string, unknown>>> = {
  Tarjetas: Dock,
  Direcciones: MapPinned,
  Usuarios: UsersRound,
  Perfil: UserRound,
  Asignar: SendHorizontal,
};

type MenuItemProps = {
  to: string;
  label: string;
  IconComponent?: React.ComponentType<{ size?: number }>;
  handleMenuToggle: () => void;
};

const MenuItem: React.FC<MenuItemProps> = ({
  to,
  label,
  IconComponent,
  handleMenuToggle,
}) => (
  <li>
    <Link
      to={to}
      onClick={() => {
        window.scrollTo(0, 0);
        handleMenuToggle();
      }}
      className="flex items-center gap-4 py-4 text-3xl tracking-wide font-semibold"
    >
      {IconComponent && <IconComponent size={28} aria-hidden="true" />}
      <span>{label}</span>
    </Link>
  </li>
);

const HeaderMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const isSS = useSelector(selectIsSS);

  const [logoutUser, { loading }] = useLazyQuery(LOGOUT, {
    onCompleted: (data) => {
      if (data?.logout?.success) {
        dispatch(clearUser());
        toast.success("Sessão encerrada com sucesso!", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        toast.error("Erro ao encerrar a sessão");
        // toast.error("Erro ao encerrar a sessão.");
      }
    },
    onError: () => console.error("Erro na solicitação de logout."),
    fetchPolicy: "no-cache",
  });

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    logoutUser();
  }, [logoutUser]);

  const combinedMenu = useMemo(() => {
    const base = Object.entries(menuOptions);
    const extra = isSS ? Object.entries(menuSs) : [];
    return [...base, ...extra];
  }, [isSS]);

  return (
    <div className="top-5 right-5 z-40 relative text-primary-drk">
      <button
        type="button"
        aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
        onClick={handleMenuToggle}
        className="text-primary  absolute z-50 -top-8 -right-5 cursor-pointer"
      >
        {isMenuOpen ? <X /> : <AlignRight className="dark:text-primary-lgt" />}
      </button>

      {isMenuOpen && (
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
          className=" fixed inset-0 z-40 bg-destaque-primary  flex flex-col items-center justify-center  px-8 space-y-6"
        >
          <div className="w-full max-w-3xl flex flex-col gap-5">
            <div className="flex items-center gap-4">
              {/* <h2 className="text-4xl  tracking-widest font-semibold">
                Menu,{" "}
              </h2> */}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="2em"
                height="2em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z"
                ></path>
                <rect
                  width={2}
                  height={7}
                  x={11}
                  y={6}
                  fill="currentColor"
                  rx={1}
                >
                  <animateTransform
                    attributeName="transform"
                    dur="9s"
                    repeatCount="indefinite"
                    type="rotate"
                    values="0 12 12;360 12 12"
                  ></animateTransform>
                </rect>
                <rect
                  width={2}
                  height={9}
                  x={11}
                  y={11}
                  fill="currentColor"
                  rx={1}
                >
                  <animateTransform
                    attributeName="transform"
                    dur="0.75s"
                    repeatCount="indefinite"
                    type="rotate"
                    values="0 12 12;360 12 12"
                  ></animateTransform>
                </rect>
              </svg>
              <SessionProvider size="text-4xl" />
            </div>

            <nav
              role="navigation"
              aria-label="Links de navegação"
              className="w-full"
            >
              <ul className="flex flex-col gap-4 py-8">
                <li>
                  <Link
                    to={"/"}
                    onClick={() => {
                      window.scrollTo(0, 0);
                      handleMenuToggle();
                    }}
                    className="flex items-center gap-4 py-4 text-3xl tracking-wide font-semibold"
                  >
                    <House size={28} aria-hidden="true" />
                    <span>Home</span>
                  </Link>
                </li>
                {combinedMenu.map(([key, item]) => (
                  <MenuItem
                    key={key}
                    to={item.path}
                    label={item.label}
                    IconComponent={iconsMap[item.label]}
                    handleMenuToggle={handleMenuToggle}
                  />
                ))}
              </ul>
            </nav>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 text-2xl font-bold cursor-pointer"
              disabled={loading}
              aria-busy={loading}
            >
              <LogOut strokeWidth={"0.2rem"} />
              {loading ? "Saliendo..." : "Salir"}
            </button>
          </div>
        </aside>
      )}
    </div>
  );
};

export default HeaderMenu;

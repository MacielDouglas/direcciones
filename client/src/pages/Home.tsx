import { menuOptions, menuSs } from "../constants/menu";
import { Link } from "react-router-dom";
import {
  UserRound,
  MapPinned,
  UsersRound,
  Dock,
  SendHorizontal,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectIsSS, selectUserName } from "../store/selectors/userSelectors";
import { useFetchAddresses } from "../graphql/hooks/useAddress";
import { useEffect } from "react";

const iconsMap: Record<
  string,
  React.ComponentType<{ size?: number | string }>
> = {
  Tarjetas: Dock,
  Direcciones: MapPinned,
  Usuarios: UsersRound,
  Perfil: UserRound,
  Asignar: SendHorizontal,
};

type MenuItemProps = {
  to: string;
  label: string;
  IconComponent?: React.ComponentType<{ size?: string | number }>;
  isSS?: boolean;
};

const MenuItem = ({ to, label, IconComponent, isSS }: MenuItemProps) => (
  <div
    className={`p-4 rounded-xl max-w-2xl ${
      isSS
        ? "bg-destaque-primary dark:text-primary-drk"
        : "bg-tertiary-lgt dark:bg-second-drk"
    }`}
  >
    <Link to={to} className="flex items-center gap-6 pl-3">
      {IconComponent && <IconComponent size={32} />}
      <p className="font-medium text-xl tracking-widest">{label}</p>
    </Link>
  </div>
);

const Home = () => {
  const isSS = useSelector(selectIsSS);
  const name = useSelector(selectUserName);
  const { fetchAddresses } = useFetchAddresses();

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return (
    <div className="w-full mb-20 h-full">
      <div className="flex flex-col justify-between items-center max-w-7xl mx-auto">
        <div className="text-center p-10">
          <h1 className="text-4xl tracking-wide font-light mb-6">
            Bienvenido, <span className="font-medium">{name}</span>
          </h1>
          <p className="text-lg">Elija una opción para comenzar:</p>
        </div>
        <div className="w-full p-5">
          <nav className="flex flex-col space-y-5 max-w-xl mx-auto">
            {Object.entries(menuOptions).map(([key, item]) => (
              <MenuItem
                key={key}
                to={item.path}
                label={item.label}
                IconComponent={iconsMap[item.label]}
              />
            ))}

            {isSS &&
              Object.entries(menuSs).map(([key, item]) => (
                <MenuItem
                  key={`ss-${key}`} // Added prefix to avoid potential key conflicts
                  to={item.path}
                  label={item.label}
                  IconComponent={iconsMap[item.label]}
                  isSS={true}
                />
              ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Home;

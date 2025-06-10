import { useSelector } from "react-redux";
import { selectUserData } from "../store/selectors/userSelectors";
import ButtonDarkMode from "../components/utils/ButtonDarkMode";

const Home = () => {
  const { name = "" } = useSelector(selectUserData) || {};
  return (
    <div className="bg-primary-lgt dark:bg-primary-drk text-primary-drk dark:text-primary-lgt">
      <h1>Home</h1>
      <p>Benvindo: {name && name}</p>
      <div className="p-5 bg-destaque-primary">
        <p className="p-5 text-sm">Volte Sempre</p>
      </div>

      <ButtonDarkMode />
    </div>
  );
};

export default Home;

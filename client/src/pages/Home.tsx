import { useSelector } from "react-redux";
import { selectUserData } from "../store/selectors/userSelectors";

const Home = () => {
  const { isSS = false, name = "" } = useSelector(selectUserData) || {};
  return (
    <div>
      <h1>Home</h1>
      <p>Benvindo: {name && name}</p>
      <p>Volte Sempre</p>
    </div>
  );
};

export default Home;

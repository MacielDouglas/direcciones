import { useSelector } from "react-redux";
import { selectUserData } from "../store/selectors/userSelectors";

const UserPage = () => {
  const { name = "Usuário", profilePicture = "" } =
    useSelector(selectUserData) || {};

  const isValidUrl = profilePicture.startsWith("http");

  return (
    <div className="w-full h-full mb-20">
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center gap-6 mt-10">
        {isValidUrl ? (
          <img
            src={profilePicture}
            alt={`Imagem do usuário: ${name}`}
            className="w-[168px] h-[168px] object-cover rounded-full border shadow"
          />
        ) : (
          <div className="w-[168px] h-[168px] rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border">
            Sem imagem
          </div>
        )}
        <p className="text-xl font-semibold">{name}</p>
      </div>
    </div>
  );
};

export default UserPage;

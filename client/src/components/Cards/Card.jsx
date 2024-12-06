import { useSelector } from "react-redux";

function Card() {
  const user = useSelector((state) => state.user);
  const { myCards } = user;

  console.log(myCards);
  return (
    <div className="text-start text-lg w-full h-screen bg-details">
      <div className="space-y-5 px-4 pt-3">
        {!myCards && <p>Actualmente no tienes tartejas asignadas.</p>}
      </div>
    </div>
  );
}

export default Card;

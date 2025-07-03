import { useNavigate } from "react-router-dom";

interface EditAddressProps {
  id: string;
}
const ButtonEditAddress = ({ id }: EditAddressProps) => {
  const navigate = useNavigate();
  const handleEdit = () => navigate(`/addresses?tab=update-address&id=${id}`);

  return (
    <button
      onClick={handleEdit}
      className="bg-primary-drk dark:bg-primary-lgt text-white dark:text-primary-drk w-full  rounded-lg text-sm shadow-md mt-2 py-3 cursor-pointer"
    >
      Editar la dirección
    </button>
  );
};

export default ButtonEditAddress;

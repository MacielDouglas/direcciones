type UpdateAddressProps = {
  id: string | null;
};

const UpdateAddress = ({ id }: UpdateAddressProps) => {
  console.log(id);
  return <div>UpdateAddress</div>;
};

export default UpdateAddress;

import { useSelector } from "react-redux";
import PropTypes from "prop-types";

function Address({ id }) {
  const addresses = useSelector((state) => state.addresses.addressesData);

  const address = addresses.find((address) => address.id === id);
  console.log(address);
  return <div>Address</div>;
}

export default Address;
Address.propTypes = {
  id: PropTypes.string.isRequired,
};

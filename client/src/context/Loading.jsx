import { Player } from "@lottiefiles/react-lottie-player";
import PropTypes from "prop-types";

function Loading({ text }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
      <Player
        autoplay
        loop
        // src="https://assets3.lottiefiles.com/packages/lf20_YNs7Ld.json"
        src="https://lottie.host/f4160263-ae92-43c0-8d0c-cfd14cf2896d/Q86AWuCDYM.json"
        style={{ height: "400px", width: "400px" }}
      />
      <p className="mt-4 text-2xl text-secondary">{text}</p>
    </div>
  );
}

export default Loading;

Loading.propTypes = {
  text: PropTypes.string,
};

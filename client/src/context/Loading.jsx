import { Player } from "@lottiefiles/react-lottie-player";
import PropTypes from "prop-types";

function Loading({ text }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] bg-primary">
      <p className="mt-4 text-2xl text-secondary">{text}</p>
      <Player
        autoplay
        loop
        src="https://lottie.host/f4160263-ae92-43c0-8d0c-cfd14cf2896d/Q86AWuCDYM.json"
        style={{ height: "400px", width: "400px" }}
      />
    </div>
  );
}

export default Loading;

Loading.propTypes = {
  text: PropTypes.string,
};

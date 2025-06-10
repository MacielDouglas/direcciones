import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useMutation } from "@apollo/client";
import { app } from "../../firebase/firebase";
import { LOGIN_GOOGLE } from "../../graphql/mutations/user.mutations";
import { setUser } from "../../store/userSlice";

const GoogleAuth = () => {
  const auth = useMemo(() => getAuth(app), []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [loginGoogle] = useMutation(LOGIN_GOOGLE);

  const handleLoginGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const result = await signInWithPopup(auth, provider);
      const { displayName, email, photoURL, uid } = result.user;

      const { data } = await loginGoogle({
        variables: { user: { displayName, email, photoUrl: photoURL, uid } },
      });

      if (!data?.loginWithGoogle?.success) {
        throw new Error(data?.loginWithGoogle?.message || "Erro desconhecido");
      }

      const userData = data.loginWithGoogle.user;
      dispatch(setUser({ user: userData }));
      // toast("Login com sucesso!!!");

      navigate("/");
      setLoading(false);
    } catch (error) {
      // toast("Erro de login");
      setLoading(false);
      console.error(error);
    }
  };
  console.log(loading);
  return (
    <button
      type={"button"}
      onClick={handleLoginGoogle}
      className="bg-destaque-primary p-4 rounded-lg text-xl w-full cursor-pointer disabled:cursor-not-allowed disabled:bg-orange-300"
      disabled={loading}
    >
      {!loading ? (
        "Login com google"
      ) : (
        <div className="flex items-center gap-2 justify-center">
          Carregando{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5em"
            height="1.5em"
            viewBox="0 0 24 24"
          >
            <rect width="2.8" height="12" x="1" y="6" fill="currentColor">
              <animate
                id="svgSpinnersBarsScale0"
                attributeName="y"
                begin="0;svgSpinnersBarsScale1.end-0.1s"
                calcMode="spline"
                dur="0.6s"
                keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
                values="6;1;6"
              />
              <animate
                attributeName="height"
                begin="0;svgSpinnersBarsScale1.end-0.1s"
                calcMode="spline"
                dur="0.6s"
                keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
                values="12;22;12"
              />
            </rect>
            <rect width="2.8" height="12" x="5.8" y="6" fill="currentColor">
              <animate
                attributeName="y"
                begin="svgSpinnersBarsScale0.begin+0.1s"
                calcMode="spline"
                dur="0.6s"
                keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
                values="6;1;6"
              />
              <animate
                attributeName="height"
                begin="svgSpinnersBarsScale0.begin+0.1s"
                calcMode="spline"
                dur="0.6s"
                keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
                values="12;22;12"
              />
            </rect>
            <rect width="2.8" height="12" x="10.6" y="6" fill="currentColor">
              <animate
                attributeName="y"
                begin="svgSpinnersBarsScale0.begin+0.2s"
                calcMode="spline"
                dur="0.6s"
                keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
                values="6;1;6"
              />
              <animate
                attributeName="height"
                begin="svgSpinnersBarsScale0.begin+0.2s"
                calcMode="spline"
                dur="0.6s"
                keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
                values="12;22;12"
              />
            </rect>
            <rect width="2.8" height="12" x="15.4" y="6" fill="currentColor">
              <animate
                attributeName="y"
                begin="svgSpinnersBarsScale0.begin+0.3s"
                calcMode="spline"
                dur="0.6s"
                keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
                values="6;1;6"
              />
              <animate
                attributeName="height"
                begin="svgSpinnersBarsScale0.begin+0.3s"
                calcMode="spline"
                dur="0.6s"
                keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
                values="12;22;12"
              />
            </rect>
            <rect width="2.8" height="12" x="20.2" y="6" fill="currentColor">
              <animate
                id="svgSpinnersBarsScale1"
                attributeName="y"
                begin="svgSpinnersBarsScale0.begin+0.4s"
                calcMode="spline"
                dur="0.6s"
                keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
                values="6;1;6"
              />
              <animate
                attributeName="height"
                begin="svgSpinnersBarsScale0.begin+0.4s"
                calcMode="spline"
                dur="0.6s"
                keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
                values="12;22;12"
              />
            </rect>
          </svg>
        </div>
      )}
    </button>
  );
};

export default GoogleAuth;

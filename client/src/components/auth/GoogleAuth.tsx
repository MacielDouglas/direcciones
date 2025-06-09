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

  return (
    <button
      className="btn  cursor-pointer  "
      onClick={handleLoginGoogle}
      disabled={loading}
    >
      {loading ? (
        <span className="loading loading-spinner"></span>
      ) : (
        <svg
          aria-label="Google logo"
          width="2rem"
          height="2rem"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <g>
            <path d="m0 0H512V512H0" fill="transparent"></path>
            <path
              fill="#34a853"
              d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
            ></path>
            <path
              fill="#4285f4"
              d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
            ></path>
            <path
              fill="#fbbc02"
              d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
            ></path>
            <path
              fill="#ea4335"
              d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
            ></path>
          </g>
        </svg>
      )}
      Login with Google
    </button>
  );
};

export default GoogleAuth;

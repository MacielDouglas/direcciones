import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useMutation } from "@apollo/client";
import { app } from "../../firebase/firebase";
import { LOGIN_GOOGLE } from "../../graphql/mutations/user.mutations";
// import { setMyUser } from "../../store/userSlice";
import { useToastMessage } from "../../hooks/useToastMessage";
import { setMyUser } from "../../store/userSlice";
import LoadingSVG from "../ui/LoadingSVG";

const GoogleAuth = () => {
  const auth = useMemo(() => getAuth(app), []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToastMessage();

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
      dispatch(setMyUser({ user: userData }));
      showToast({ message: "¡Inicio de sesión exitoso!", type: "success" });

      navigate("/");
      setLoading(false);
    } catch (error) {
      showToast({ message: `Error sesión: ${error}`, type: "error" });

      setLoading(false);
    }
  };

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
          Carregando
          <LoadingSVG />
        </div>
      )}
    </button>
  );
};

export default GoogleAuth;

import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useMemo, useState } from "react";
import { app } from "../../firebase/firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
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
      //   toast("Login com sucesso!!!");

      navigate("/");
      setLoading(false);
    } catch (error) {
      //   toast("Erro de login");
      setLoading(false);
      console.error(error);
    }
  };
  return <button onClick={handleLoginGoogle}>LOGIN Google</button>;
};

export default GoogleAuth;

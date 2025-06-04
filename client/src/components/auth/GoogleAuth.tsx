import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess, selectIsAuthenticated } from "@/store/slices/authSlice";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "@/firebase/firebase";
import { useMutation } from "@apollo/client";
import { LOGIN_GOOGLE } from "@/graphql/mutations/user.mutation";

const GoogleAuth = () => {
  const auth = useMemo(() => getAuth(app), []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [loading, setLoading] = useState(false);

  const [loginGoogle] = useMutation(LOGIN_GOOGLE);

  const handleLoginGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const result = await signInWithPopup(auth, provider);
      const { displayName, email, photoURL, uid } = result.user;

      console.log("REsult: ", result);

      const { data } = await loginGoogle({
        variables: { user: { displayName, email, photoUrl: photoURL, uid } },
      });

      if (!data?.loginWithGoogle?.success) {
        throw new Error(data?.loginWithGoogle?.message || "Erro desconhecido");
      }

      const userData = data.loginWithGoogle.user;
      console.log("User data: ", userData);

      dispatch(loginSuccess(userData));

      navigate("/");
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
    // const result = await dispatch(loguin);
  };

  console.log("isAuthenticated", isAuthenticated);

  return (
    <Button
      size="lg"
      //   className="animate-spin"
      className="text-lg cursor-pointer "
      onClick={handleLoginGoogle}
    >
      {" "}
      {loading ? (
        <span className=" h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="2rem"
          height="2rem"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="animate-spin "
        >
          <path d="M12 5.5a6.5 6.5 0 1 0 6.326 8H13a1.5 1.5 0 0 1 0-3h7a1.5 1.5 0 0 1 1.5 1.5a9.5 9.5 0 1 1-2.801-6.736a1.5 1.5 0 1 1-2.116 2.127A6.48 6.48 0 0 0 12 5.5" />
        </svg>
      )}
      Iniciar sesión con Google
    </Button>
  );
};

export default GoogleAuth;

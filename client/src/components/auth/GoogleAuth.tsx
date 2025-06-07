import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "@/firebase/firebase";
import { useMutation } from "@apollo/client";
import { LOGIN_GOOGLE } from "@/graphql/mutations/user.mutation";
import { toast } from "sonner";
import { setUser } from "@/store/userSlice";

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
      toast("Login com sucesso!!!");

      navigate("/");
      setLoading(false);
    } catch (error) {
      toast("Erro de login");
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <Button
      size="lg"
      className="text-lg cursor-pointer "
      onClick={handleLoginGoogle}
    >
      {" "}
      {loading ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
        >
          <g>
            <rect
              width={2}
              height={5}
              x={11}
              y={1}
              fill="currentColor"
              opacity={0.14}
            ></rect>
            <rect
              width={2}
              height={5}
              x={11}
              y={1}
              fill="currentColor"
              opacity={0.29}
              transform="rotate(30 12 12)"
            ></rect>
            <rect
              width={2}
              height={5}
              x={11}
              y={1}
              fill="currentColor"
              opacity={0.43}
              transform="rotate(60 12 12)"
            ></rect>
            <rect
              width={2}
              height={5}
              x={11}
              y={1}
              fill="currentColor"
              opacity={0.57}
              transform="rotate(90 12 12)"
            ></rect>
            <rect
              width={2}
              height={5}
              x={11}
              y={1}
              fill="currentColor"
              opacity={0.71}
              transform="rotate(120 12 12)"
            ></rect>
            <rect
              width={2}
              height={5}
              x={11}
              y={1}
              fill="currentColor"
              opacity={0.86}
              transform="rotate(150 12 12)"
            ></rect>
            <rect
              width={2}
              height={5}
              x={11}
              y={1}
              fill="currentColor"
              transform="rotate(180 12 12)"
            ></rect>
            <animateTransform
              attributeName="transform"
              calcMode="discrete"
              dur="0.75s"
              repeatCount="indefinite"
              type="rotate"
              values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12"
            ></animateTransform>
          </g>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 5.5a6.5 6.5 0 1 0 6.326 8H13a1.5 1.5 0 0 1 0-3h7a1.5 1.5 0 0 1 1.5 1.5a9.5 9.5 0 1 1-2.801-6.736a1.5 1.5 0 1 1-2.116 2.127A6.48 6.48 0 0 0 12 5.5" />
        </svg>
      )}
      Iniciar sesión con Google
    </Button>
  );
};

export default GoogleAuth;
